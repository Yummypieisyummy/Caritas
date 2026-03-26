import { query } from '../config/db';

// Switched to return data or null here and let the service/auth decide how to handle null

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
