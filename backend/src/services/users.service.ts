import { query } from "../config/db";

export async function createUser(data: any) {
  const { email, password_hash, org_id } = data;

  if (!email || !password_hash) {
    throw new Error("Email and password are required");
  }

  const { rows } = await query(
    `
    INSERT INTO users (email, password_hash, org_id)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [email, password_hash, org_id]
  );

  return rows[0];
}

export async function getUserById(id: string) {
  const { rows } = await query(`SELECT * FROM users WHERE id = $1`, [id]);
  if (!rows.length) throw new Error("User not found");
  return rows[0];
}

export async function listUsers() {
  const { rows } = await query(`SELECT * FROM users ORDER BY created_at DESC`);
  return rows;
}
