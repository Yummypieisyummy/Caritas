import { pool, query } from '../config/db';

// Switched to return data or null here and let the service/auth decide how to handle null

const serviceError = (message: string, status: number) => {
  const error = new Error(message) as Error & { status?: number };
  error.status = status;
  return error;
};

type OrgProfilePostRow = {
  latitude?: string | number | null;
  longitude?: string | number | null;
  [key: string]: unknown;
};

type UpdateOrgProfileInput = {
  about?: string;
  pfp_url?: string | null;
  banner_url?: string | null;
  contact_info?: {
    phone?: string;
    public_email?: string;
  };
};

export async function createOrg(data: any) {
  const { name, email, about, contact_info, pfp_url, banner_url } = data;

  if (!name || !email) {
    throw new Error('Name and email are required');
  }

  const { rows } = await query(
    `
    INSERT INTO organizations (name, email, about, contact_info, pfp_url, banner_url)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [name, email, about, contact_info, pfp_url, banner_url],
  );

  return rows[0];
}

export async function getOrgById(id: string) {
  const { rows } = await query(`SELECT * FROM organizations WHERE id = $1`, [
    id,
  ]);
  // if (!rows.length) throw new Error('Organization not found');
  return rows[0] || null;
}

function withPostCoordinates(post: OrgProfilePostRow) {
  return {
    ...post,
    latitude: post.latitude == null ? null : Number(post.latitude),
    longitude: post.longitude == null ? null : Number(post.longitude),
  };
}

export async function getOrgProfileById(id: string) {
  const organization = await getOrgById(id);

  if (!organization) {
    throw serviceError('Organization not found', 404);
  }

  const { rows: activePosts } = await query(
    `
    SELECT
      posts.*,
      organizations.name AS org_name,
      NULL::double precision AS distance_miles
    FROM posts
    JOIN organizations ON posts.org_id = organizations.id
    WHERE posts.org_id = $1
      AND posts.status = 'active'
    ORDER BY posts.created_at DESC
    `,
    [id],
  );

  return {
    organization,
    activePosts: activePosts.map(withPostCoordinates),
  };
}

export async function updateOrgProfile(
  id: string,
  data: UpdateOrgProfileInput,
) {
  if (!id) {
    throw serviceError('OrgId is required', 400);
  }

  if (!data || typeof data !== 'object') {
    throw serviceError('Profile data is required', 400);
  }

  const updates: string[] = [];
  const values: unknown[] = [];

  if (data.about !== undefined) {
    values.push(data.about);
    updates.push(`about = $${values.length}`);
  }

  if (Object.prototype.hasOwnProperty.call(data, 'pfp_url')) {
    values.push(data.pfp_url ?? null);
    updates.push(`pfp_url = $${values.length}`);
  }

  if (Object.prototype.hasOwnProperty.call(data, 'banner_url')) {
    values.push(data.banner_url ?? null);
    updates.push(`banner_url = $${values.length}`);
  }

  if (data.contact_info !== undefined) {
    if (!data.contact_info || typeof data.contact_info !== 'object') {
      throw serviceError('Contact info must be an object', 400);
    }

    values.push({
      phone: data.contact_info.phone ?? '',
      public_email: data.contact_info.public_email ?? '',
    });
    updates.push(
      `contact_info = COALESCE(contact_info, '{}'::jsonb) || $${values.length}::jsonb`,
    );
  }

  if (!updates.length) {
    throw serviceError('No profile fields provided', 400);
  }

  values.push(id);
  const { rows } = await query(
    `
    UPDATE organizations
    SET ${updates.join(', ')},
        updated_at = now()
    WHERE id = $${values.length}
    RETURNING *
    `,
    values,
  );

  if (!rows.length) {
    throw serviceError('Organization not found', 404);
  }

  return rows[0];
}

export async function listOrgs() {
  const { rows } = await query(
    `SELECT * FROM organizations ORDER BY created_at DESC`,
  );
  return rows;
}

export async function addOrgUser(data: any) {
  const { org_id, user_id, role } = data;

  if (!org_id || !user_id || !role) {
    throw new Error('Org ID, User ID, and Role are required');
  }

  const { rows } = await query(
    `
    INSERT INTO org_users (org_id, user_id, role)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [org_id, user_id, role],
  );

  return rows[0];
}

export async function assertOrgVerified(orgId: string) {
  if (!orgId) {
    throw new Error('OrgId is required');
  }

  const { rows } = await query(
    `SELECT verified FROM organizations WHERE id = $1`,
    [orgId],
  );

  if (!rows.length) {
    throw new Error('Organization not found');
  }

  if (!rows[0].verified) {
    throw new Error('Organization not verified');
  }

  return true;
}

export async function submitForVerification(orgId: string, documents: any) {
  if (!orgId) {
    throw serviceError('OrgId is required', 400);
  }

  if (!documents) {
    throw serviceError('Verification documents are required', 400);
  }

  const orgResult = await query<{
    pfp_url: string | null;
    banner_url: string | null;
    about: string | null;
  }>(
    `
    SELECT pfp_url, banner_url, about
    FROM organizations
    WHERE id = $1
    `,
    [orgId],
  );

  if (!orgResult.rows.length) {
    throw serviceError('Organization not found', 404);
  }

  const org = orgResult.rows[0];
  const missingFields = [!org.about?.trim() && 'about'].filter(Boolean);

  if (missingFields.length) {
    throw serviceError(
      `Complete your organization profile before submitting for verification. Missing: ${missingFields.join(
        ', ',
      )}.`,
      400,
    );
  }

  const { rows } = await query(
    `
    INSERT INTO organization_verifications (org_id, status, documents)
    VALUES ($1, 'pending', $2)
    RETURNING *
    `,
    [orgId, documents],
  );

  return rows[0];
}

export async function deleteOrg(orgId: string) {
  if (!orgId) {
    throw new Error('OrgId is required');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const memberResult = await client.query<{ user_id: string }>(
      `SELECT user_id FROM org_users WHERE org_id = $1`,
      [orgId],
    );
    const memberIds = memberResult.rows.map((row) => row.user_id);

    const { rows } = await client.query<{ id: string }>(
      `DELETE FROM organizations WHERE id = $1 RETURNING id`,
      [orgId],
    );

    if (!rows.length) {
      throw new Error('Organization not found');
    }

    if (memberIds.length) {
      await client.query(
        `
        DELETE FROM users u
        WHERE u.id = ANY($1::uuid[])
          AND NOT EXISTS (
            SELECT 1
            FROM org_users ou
            WHERE ou.user_id = u.id
          )
        `,
        [memberIds],
      );
    }

    await client.query('COMMIT');
    return rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function exportOrgData(orgId: string) {
  if (!orgId) {
    throw new Error('OrgId is required');
  }

  const { rows } = await query(
    `
    SELECT json_build_object(
      'organization', json_build_object(
        'id', o.id,
        'name', o.name,
        'email', o.email,
        'verified', o.verified,
        'pfp_url', o.pfp_url,
        'banner_url', o.banner_url,
        'contact_info', o.contact_info,
        'about', o.about,
        'created_at', o.created_at,
        'updated_at', o.updated_at
      ),
      'team_members', (
        SELECT COALESCE(json_agg(
          json_build_object(
            'id', ou.id,
            'user_id', u.id,
            'email', u.email,
            'role', ou.role,
            'email_verified_at', u.email_verified_at
          )
          ORDER BY u.email
        ), '[]'::json)
        FROM org_users ou
        JOIN users u ON u.id = ou.user_id
        WHERE ou.org_id = o.id
      ),
      'posts', (
        SELECT COALESCE(json_agg(p ORDER BY p.created_at DESC), '[]'::json)
        FROM posts p
        WHERE p.org_id = o.id
      ),
      'verifications', (
        SELECT COALESCE(json_agg(ov ORDER BY ov.submitted_at DESC), '[]'::json)
        FROM organization_verifications ov
        WHERE ov.org_id = o.id
      ),
      'invites', (
        SELECT COALESCE(json_agg(
          json_build_object(
            'id', oi.id,
            'email', oi.email,
            'role', oi.role,
            'invited_by', oi.invited_by,
            'expires_at', oi.expires_at,
            'created_at', oi.created_at
          )
          ORDER BY oi.created_at DESC
        ), '[]'::json)
        FROM organization_invites oi
        WHERE oi.org_id = o.id
      )
    ) AS export_data
    FROM organizations o
    WHERE o.id = $1
    `,
    [orgId],
  );

  if (!rows.length) {
    throw new Error('Organization not found');
  }

  return rows[0].export_data;
}
