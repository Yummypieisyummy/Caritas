// import { query } from '../config/db';

// export async function createPost(data: any) {
//   if (!data.title) {
//     throw new Error('Post title is required');
//   }

//   const org = await query(`SELECT verified FROM organizations WHERE id = $1`, [
//     data.org_id,
//   ]);

//   if (!org.rows.length) {
//     throw new Error('Organization not found');
//   }

//   if (!org.rows[0].verified) {
//     throw new Error('Organization is not verified');
//   }

//   const { rows } = await query(
//     `
//     INSERT INTO posts (
//       org_id,
//       type,
//       title,
//       short_description,
//       long_description,
//       location,
//       date_start,
//       date_end
//     )
//     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
//     RETURNING *
//     `,
//     [
//       data.org_id,
//       data.type,
//       data.title,
//       data.short_description,
//       data.long_description,
//       data.location,
//       data.date_start,
//       data.date_end,
//     ],
//   );

//   return rows[0];
// }

// export async function getPostById(id: string) {
//   const { rows } = await query(`SELECT * FROM posts WHERE id = $1`, [id]);

//   if (!rows.length) {
//     throw new Error('Post not found');
//   }

//   return rows[0];
// }

// // Changing how this functions
// export async function listPosts(filters: any) {
//   return NaN;
// }

import { pool, query } from '../config/db';
import * as orgsServices from './org.service';
import { geocodeAddress } from './geocode.service';
import {
  addPostDocument,
  deletePostDocument,
  searchPostIds,
  updatePostDocument,
} from '../config/search_engine';

type CreatePostInput = {
  org_id: string;
  post_type: string;
  event_type: string;
  title: string;
  description: string;
  additional_details?: string;
  location: string;
  date_start: string;
  date_end?: string;
  days_of_week?: string[];
  requirements?: unknown;
  contact_email: string;
  contact_phone: string;
};

type PostFilters = {
  post_type?: string;
  event_type?: string;
  searchQuery?: string;
  postIds?: string[];
  daysNeeded?: unknown;
  requirements?: unknown;
  userLat?: string | number;
  userLng?: string | number;
  maxDistanceMiles?: string | number;
};

type PostStatus = 'active' | 'closed';

type ListPostsQueryOptions = {
  orgId?: string;
  status?: PostStatus;
};

type PostRow = {
  location: string;
  latitude?: string | number | null;
  longitude?: string | number | null;
  [key: string]: unknown;
};

type PostWithCoordinates = PostRow & {
  latitude: number | null;
  longitude: number | null;
};

function withCoordinates(post: PostRow): PostWithCoordinates {
  return {
    ...post,
    latitude: post.latitude == null ? null : Number(post.latitude),
    longitude: post.longitude == null ? null : Number(post.longitude),
  };
}

function withCoordinatesForMany(posts: PostRow[]): PostWithCoordinates[] {
  return posts.map((post) => withCoordinates(post));
}

export async function createPost(data: CreatePostInput) {
  if (!data) {
    throw new Error('Post data is required');
  }

  await orgsServices.assertOrgVerified(data.org_id);

  const requirements = normalizeStringArray(data.requirements);
  const coordinates = await geocodeAddress(data.location);
  const client = await pool.connect();
  let committed = false;

  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `
      INSERT INTO posts (
        org_id,
        post_type,
        event_type,
        title,
        description,
        additional_details,
        location,
        date_start,
        date_end,
        days_of_week,
        requirements,
        contact_email,
        contact_phone,
        latitude,
        longitude
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      RETURNING *
      `,
      [
        data.org_id,
        data.post_type,
        data.event_type,
        data.title,
        data.description,
        data.additional_details ?? null,
        data.location,
        data.date_start,
        data.date_end ?? null,
        data.days_of_week ?? null,
        requirements,
        data.contact_email,
        data.contact_phone,
        coordinates?.latitude ?? null,
        coordinates?.longitude ?? null,
      ],
    );

    const post = rows[0];

    await client.query('COMMIT');
    committed = true;
    await addPostDocument(post);
    return withCoordinates(post);
  } catch (error) {
    if (!committed) {
      await client.query('ROLLBACK');
    }
    throw error;
  } finally {
    client.release();
  }
}

export async function getPostById(id: string) {
  const { rows } = await query(
    `
    SELECT posts.*
    FROM posts
    WHERE posts.id = $1
    `,
    [id],
  );

  if (!rows.length) {
    throw new Error('Post not found');
  }

  return withCoordinates(rows[0]);
}

function normalizeStringArray(value?: unknown): string[] {
  if (!value) {
    return [];
  }

  const values = Array.isArray(value) ? value : [value];

  return values
    .flatMap((item) => String(item).split(','))
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item, index, items) => items.indexOf(item) === index);
}

function toFiniteNumber(value: unknown): number | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function buildDistanceExpression(latParam: number, lngParam: number) {
  return `
    3958.8 * 2 * ASIN(
      SQRT(
        POWER(
          SIN(RADIANS((posts.latitude::double precision - $${latParam}) / 2)),
          2
        )
        + COS(RADIANS($${latParam}))
        * COS(RADIANS(posts.latitude::double precision))
        * POWER(
          SIN(RADIANS((posts.longitude::double precision - $${lngParam}) / 2)),
          2
        )
      )
    )
  `;
}

function buildListPostsQuery(
  filters: PostFilters = {},
  options: ListPostsQueryOptions = {},
) {
  const whereClauses: string[] = [];
  const values: unknown[] = [];
  const userLat = toFiniteNumber(filters.userLat);
  const userLng = toFiniteNumber(filters.userLng);
  const maxDistanceMiles = toFiniteNumber(filters.maxDistanceMiles);
  const shouldCalculateDistance = userLat !== null && userLng !== null;

  let distanceSelect = 'NULL::double precision AS distance_miles';
  let orderBy = 'created_at DESC';

  if (filters.post_type) {
    values.push(filters.post_type);
    whereClauses.push(`posts.post_type = $${values.length}`);
  }

  if (filters.event_type) {
    values.push(filters.event_type);
    whereClauses.push(`posts.event_type = $${values.length}`);
  }

  if (filters.postIds?.length) {
    values.push(filters.postIds);
    whereClauses.push(`posts.id = ANY($${values.length}::uuid[])`);
  }

  const daysNeeded = normalizeStringArray(filters.daysNeeded);
  const requirements = normalizeStringArray(filters.requirements);

  if (daysNeeded.length) {
    const dayClauses: string[] = [];

    if (daysNeeded.includes('Weekdays')) {
      dayClauses.push(`
        (
          posts.days_of_week && ARRAY['Monday','Tuesday','Wednesday','Thursday','Friday']::text[]
          OR (
            posts.event_type = 'one-time'
            AND EXTRACT(DOW FROM posts.date_start) BETWEEN 1 AND 5
          )
        )
      `);
    }

    if (daysNeeded.includes('Weekends')) {
      dayClauses.push(`
        (
          posts.days_of_week && ARRAY['Saturday','Sunday']::text[]
          OR (
            posts.event_type = 'one-time'
            AND EXTRACT(DOW FROM posts.date_start) IN (0, 6)
          )
        )
      `);
    }

    if (dayClauses.length) {
      whereClauses.push(`(${dayClauses.join(' OR ')})`);
    }
  }

  if (requirements.length) {
    values.push(requirements);
    whereClauses.push(`
      posts.requirements && $${values.length}::text[]
    `);
  }

  if (options.orgId) {
    values.push(options.orgId);
    whereClauses.push(`posts.org_id = $${values.length}`);
  }

  if (options.status) {
    values.push(options.status);
    whereClauses.push(`posts.status = $${values.length}`);
  }

  if (shouldCalculateDistance) {
    values.push(userLat);
    const latParam = values.length;
    values.push(userLng);
    const lngParam = values.length;
    distanceSelect = `
      CASE
        WHEN posts.latitude IS NOT NULL AND posts.longitude IS NOT NULL
        THEN ${buildDistanceExpression(latParam, lngParam)}
        ELSE NULL::double precision
      END AS distance_miles
    `;
    orderBy = 'distance_miles ASC NULLS LAST, created_at DESC';
  }

  const whereClause = whereClauses.length
    ? `WHERE ${whereClauses.join(' AND ')}`
    : '';
  let maxDistanceClause = '';

  if (shouldCalculateDistance && maxDistanceMiles !== null) {
    values.push(maxDistanceMiles);
    maxDistanceClause = `WHERE distance_miles <= $${values.length}`;
  }

  return {
    text: `
      SELECT *
      FROM (
        SELECT
          posts.*,
          organizations.name AS org_name,
          ${distanceSelect}
        FROM posts
        JOIN organizations ON posts.org_id = organizations.id
        ${whereClause}
      ) filtered_posts
      ${maxDistanceClause}
      ORDER BY ${orderBy}
    `,
    values,
  };
}

export async function listPosts(filters: PostFilters = {}) {
  const { text, values } = buildListPostsQuery(filters);
  const { rows } = await query(text, values);

  return withCoordinatesForMany(rows);
}

// Add pagination later
export async function listPublicPosts(filters: PostFilters = {}) {
  let postIds = filters.postIds;

  if (filters.searchQuery) {
    postIds = await searchPostIds(filters.searchQuery, { status: 'active' });

    if (!postIds.length) {
      return [];
    }
  }

  const { searchQuery, ...sqlFilters } = filters;
  void searchQuery;

  const { text, values } = buildListPostsQuery(
    {
      ...sqlFilters,
      postIds,
    },
    {
      status: 'active',
    },
  );
  const { rows } = await query(text, values);

  return withCoordinatesForMany(rows);
}

// Note: You should also update listOrgPosts in this same file to use the same JOIN logic!
export async function listOrgPosts(orgId: string, filters: PostFilters = {}) {
  await orgsServices.assertOrgVerified(orgId);

  const { text, values } = buildListPostsQuery(filters, { orgId });
  const { rows } = await query(text, values);

  return withCoordinatesForMany(rows);
}

export async function deletePostById(orgId: string, postId: string) {
  if (!postId) {
    throw new Error('PostId is required');
  }

  await orgsServices.assertOrgVerified(orgId);

  const { rows } = await query(
    `DELETE FROM posts WHERE org_id = $1 AND id = $2 RETURNING *`,
    [orgId, postId],
  );

  if (!rows.length) {
    throw new Error(
      'Post not found or you do not have permission to delete it',
    );
  }

  await deletePostDocument(postId);
}

export async function updatePostStatus(
  orgId: string,
  postId: string,
  status: 'active' | 'closed',
) {
  if (!postId || !status) {
    throw new Error('PostID and status are required');
  }

  await orgsServices.assertOrgVerified(orgId);

  const { rows } = await query(
    `UPDATE posts SET status = $3 WHERE org_id = $1 AND id = $2 RETURNING *`,
    [orgId, postId, status],
  );

  if (!rows.length) {
    throw new Error(
      'Post not found or you do not have permission to update it',
    );
  }

  await updatePostDocument({ id: postId, status });

  return withCoordinates(rows[0]);
}
