import { query } from '../config/db';

// Switched to return data or null here and let the service/auth decide how to handle null
// Probably will need revised

export async function createUser(data: any) {
  const { email, password_hash, org_id } = data;

  if (!email || !password_hash) {
    throw new Error('Email and password are required');
  }

  const { rows } = await query(
    `
    INSERT INTO users (email, password_hash, org_id)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [email, password_hash, org_id],
  );

  return rows[0];
}

export async function getUserById(id: string) {
  const { rows } = await query(`SELECT * FROM users WHERE id = $1`, [id]);
  // if (!rows.length) throw new Error('User not found');
  return rows[0] || null;
}

export async function listUsers() {
  const { rows } = await query(`SELECT * FROM users ORDER BY created_at DESC`);
  return rows;
}

export async function getUserByEmail(email: string) {
  if (!email) {
    throw new Error('Email is required');
  }

  const { rows } = await query(`SELECT * FROM users WHERE email = $1`, [email]);
  // if (!rows.length) throw new Error('User not found');
  return rows[0] || null;
}

export async function getOrgUser(user_id: string) {
  if (!user_id) {
    throw new Error('User ID is required');
  }

  const { rows } = await query(`SELECT * FROM org_users WHERE user_id = $1`, [
    user_id,
  ]);
  // if (!rows.length) throw new Error('Org user relationship not found');
  return rows[0] || null;
}

// May want to make this dynamic later to handle different user updates
export async function verifyUserEmail(user_id: string) {
  if (!user_id) {
    throw new Error('User ID is required');
  }

  const { rows } = await query(
    `UPDATE users SET email_verified_at = NOW() WHERE id = $1 RETURNING *`,
    [user_id],
  );
  // if (!rows.length) throw new Error('User not found during verification update');
  return rows[0] || null;
}
