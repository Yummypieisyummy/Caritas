import { query } from "../config/db";

export async function createOrg(data: any) {
  const { name, email, about, contact_info, pfp_url, banner_url } = data;

  if (!name || !email) {
    throw new Error("Name and email are required");
  }

  const { rows } = await query(
    `
    INSERT INTO organizations (name, email, about, contact_info, pfp_url, banner_url)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [name, email, about, contact_info, pfp_url, banner_url]
  );

  return rows[0];
}

export async function getOrgById(id: string) {
  const { rows } = await query(`SELECT * FROM organizations WHERE id = $1`, [id]);
  if (!rows.length) throw new Error("Organization not found");
  return rows[0];
}

export async function listOrgs() {
  const { rows } = await query(
    `SELECT * FROM organizations ORDER BY created_at DESC`
  );
  return rows;
}
