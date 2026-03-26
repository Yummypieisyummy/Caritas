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

import { query } from '../config/db';
import * as orgsServices from './org.service';

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
  contact_email: string;
  contact_phone: string;
};

export async function createPost(data: CreatePostInput) {
  if (!data) {
    throw new Error('Post data is required');
  }

  await orgsServices.assertOrgVerified(data.org_id);

  const { rows } = await query(
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
      contact_email,
      contact_phone
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
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
      data.contact_email,
      data.contact_phone,
    ],
  );

  return rows[0];
}

export async function getPostById(id: string) {
  const { rows } = await query(`SELECT * FROM posts WHERE id = $1`, [id]);

  if (!rows.length) {
    throw new Error('Post not found');
  }

  return rows[0];
}

// Add filters later and maybe pagination
export async function listOrgPosts(orgId: string) {
  await orgsServices.assertOrgVerified(orgId);

  const { rows } = await query(
    `SELECT * FROM posts WHERE org_id = $1 ORDER BY date_start DESC`,
    [orgId],
  );

  return rows;
}

export async function listPublicPosts() {
  // pass filters later

  const { rows } = await query(
    `SELECT * FROM posts WHERE status = 'active' ORDER BY date_start DESC`,
  );

  return rows;
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

  return rows[0];
}
