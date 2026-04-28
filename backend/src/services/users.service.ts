import { query } from '../config/db';

// Switched to return data or null here and let the service/auth decide how to handle null

type CreateUserInput = {
  email: string;
  password_hash: string;
};

export async function createUser(data: CreateUserInput) {
  const { email, password_hash } = data;

  if (!email || !password_hash) {
    throw new Error('Email and password are required');
  }

  const { rows } = await query(
    `
    INSERT INTO users (email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [email, password_hash],
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

// For users who belong to multiple orgs - retrieve all orgs a user belongs to
export async function getUserOrgs(user_id: string) {
  if (!user_id) {
    throw new Error('User ID is required');
  }

  const { rows } = await query(`SELECT * FROM org_users WHERE user_id = $1`, [
    user_id,
  ]);
  return rows || null;
}

export async function getSpecificOrgUser(user_id: string, org_id: string) {
  if (!user_id || !org_id) throw new Error('User ID and Org ID are required');

  const { rows } = await query(
    `SELECT * FROM org_users WHERE user_id = $1 AND org_id = $2`,
    [user_id, org_id],
  );
  return rows[0] || null;
}

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

export async function getPendingInviteByEmail(email: string) {
  if (!email) {
    throw new Error('Email is required');
  }

  const { rows } = await query(
    `
    SELECT *
    FROM organization_invites
    WHERE LOWER(email) = LOWER($1)
      AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1
    `,
    [email.trim().toLowerCase()],
  );

  return rows[0] || null;
}

export async function processPendingInviteForVerifiedUser(
  user_id: string,
  email: string,
  inviteToken?: string,
) {
  if (!user_id || !email) {
    throw new Error('User ID and email are required');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const params: unknown[] = [normalizedEmail];
  const tokenCondition = inviteToken ? 'AND token = $2' : '';

  if (inviteToken) {
    params.push(inviteToken);
  }

  const { rows: inviteRows } = await query(
    `
    SELECT id, org_id, role, expires_at
    FROM organization_invites
    WHERE LOWER(email) = LOWER($1)
      ${tokenCondition}
    ORDER BY created_at DESC
    LIMIT 1
    `,
    params,
  );

  const invite = inviteRows[0];

  if (!invite) {
    return null;
  }

  if (new Date(invite.expires_at).getTime() < Date.now()) {
    await query(`DELETE FROM organization_invites WHERE id = $1`, [invite.id]);
    throw new Error('This invite has expired');
  }

  const { rows: existingMembership } = await query(
    `SELECT 1 FROM org_users WHERE user_id = $1 LIMIT 1`,
    [user_id],
  );

  if (existingMembership.length) {
    return null;
  }

  const { rows: orgUserRows } = await query(
    `
    INSERT INTO org_users (org_id, user_id, role)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [invite.org_id, user_id, invite.role],
  );

  await query(`DELETE FROM organization_invites WHERE id = $1`, [invite.id]);

  return orgUserRows[0] || null;
}
