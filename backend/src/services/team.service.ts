import crypto from 'crypto';
import { pool, query } from '../config/db';
import { InviteInput, OrgUserRole } from '../types/team';
import { sendEmail } from '../utils/send_email';
import * as orgsServices from './org.service';

const FRONTEND = process.env.FRONTEND_URL;

const serviceError = (message: string, status: number) => {
  const error = new Error(message) as Error & { status?: number };
  error.status = status;
  return error;
};

export const getTeamData = async (orgId: string) => {
  const org = await query(`SELECT verified FROM organizations WHERE id = $1`, [
    orgId,
  ]);

  if (!org.rows.length) {
    throw serviceError('Organization not found', 404);
  }

  if (!org.rows[0].verified) {
    throw serviceError('Organization not verified', 403);
  }

  const { rows: members } = await query(
    `SELECT
      u.id,
      u.email,
      ou.role,
      'active' AS status,
      u.email_verified_at AS "emailVerifiedAt",
      u.created_at AS "createdAt"
    FROM org_users ou
    JOIN users u ON ou.user_id = u.id
    WHERE ou.org_id = $1
    ORDER BY ou.role ASC, u.created_at DESC`,
    [orgId],
  );

  const { rows: invites } = await query(
    `SELECT
      id,
      email,
      role,
      'pending' AS status,
      invited_by AS "invitedBy",
      expires_at AS "expiresAt",
      created_at AS "createdAt"
    FROM organization_invites
    WHERE org_id = $1
    ORDER BY created_at DESC`,
    [orgId],
  );

  return { members, invites };
};

export const inviteMember = async (data: InviteInput) => {
  const { orgId, inviterId, inviterRole, email, role } = data;
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail || !role) {
    throw serviceError('Email and role are required.', 400);
  }

  if (!['admin', 'member'].includes(role)) {
    throw serviceError('Role must be admin or member.', 400);
  }

  if (inviterRole !== 'admin') {
    throw serviceError(
      'Only organization admins can invite new team members.',
      403,
    );
  }

  await orgsServices.assertOrgVerified(orgId);

  const existingMember = await query(
    `SELECT 1
    FROM users u
    JOIN org_users ou ON ou.user_id = u.id
    WHERE LOWER(u.email) = LOWER($1)
    LIMIT 1`,
    [normalizedEmail],
  );

  if (existingMember.rows.length) {
    throw serviceError('This email already belongs to an organization.', 409);
  }

  const existingInvite = await query(
    `SELECT 1
    FROM organization_invites
    WHERE LOWER(email) = LOWER($1)
    LIMIT 1`,
    [normalizedEmail],
  );

  if (existingInvite.rows.length) {
    throw serviceError(
      'This email already has a pending organization invite.',
      409,
    );
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // invite expires in 7 days

  const { rows } = await query(
    `INSERT INTO organization_invites (org_id, email, role, token, invited_by, expires_at)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [orgId, normalizedEmail, role, token, inviterId, expiresAt],
  );

  const invite = rows[0];

  // Send the notification email
  const inviteUrl = `${FRONTEND}/signup?inviteToken=${token}`;
  const subject = `You've been invited to join an organization on Caritas`;
  const message = `
  <p>Hello,</p>

  <p>You have been invited to join an organization on Caritas as a <strong>${role}</strong>.</p>

  <p>
    Click the link below to create your account and accept the invitation:<br/>
    <a href="${inviteUrl}">${inviteUrl}</a>
  </p>

  <p>This invitation will be applied after you verify your email. The link will expire in 7 days.</p>
`;

  await sendEmail(normalizedEmail, subject, message);

  // Just print url to console for now:
  console.log('invite url', inviteUrl);

  return invite;
};

export const removeMember = async (
  orgId: string,
  requesterId: string,
  targetUserId: string,
) => {
  if (!orgId || !requesterId || !targetUserId) {
    throw serviceError(
      'Org ID, requester ID, and target user ID are required.',
      400,
    );
  }

  const { rows: requesterRows } = await query<{ role: OrgUserRole }>(
    `SELECT role
    FROM org_users
    WHERE org_id = $1 AND user_id = $2
    LIMIT 1`,
    [orgId, requesterId],
  );

  if (!requesterRows.length || requesterRows[0].role !== 'admin') {
    throw serviceError('Only organization admins can remove team members.', 403);
  }

  const { rows: targetRows } = await query<{ role: OrgUserRole }>(
    `SELECT role
    FROM org_users
    WHERE org_id = $1 AND user_id = $2
    LIMIT 1`,
    [orgId, targetUserId],
  );

  if (!targetRows.length) {
    throw serviceError('Team member not found.', 404);
  }

  if (targetRows[0].role === 'admin') {
    throw serviceError('Admins cannot remove another admin.', 403);
  }

  await query(
    `DELETE FROM org_users
    WHERE org_id = $1 AND user_id = $2`,
    [orgId, targetUserId],
  );
};

export const revokeInvite = async (orgId: string, inviteId: string) => {
  if (!orgId || !inviteId) {
    throw serviceError('Org ID and invite ID are required.', 400);
  }

  const { rowCount } = await query(
    `DELETE FROM organization_invites
    WHERE org_id = $1 AND id = $2`,
    [orgId, inviteId],
  );

  if (!rowCount) {
    throw serviceError('Invite not found.', 404);
  }
};

export const acceptInvite = async (token: string) => {
  if (!token) {
    throw serviceError('Invite token is required.', 400);
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const inviteResult = await client.query<{
      id: string;
      org_id: string;
      email: string;
      role: OrgUserRole;
      expires_at: Date;
      org_name: string;
    }>(
      `SELECT
        oi.id,
        oi.org_id,
        oi.email,
        oi.role,
        oi.expires_at,
        o.name AS org_name
      FROM organization_invites oi
      JOIN organizations o ON o.id = oi.org_id
      WHERE oi.token = $1
      FOR UPDATE OF oi`,
      [token],
    );

    const invite = inviteResult.rows[0];

    if (!invite) {
      throw serviceError('Invite not found or already accepted.', 404);
    }

    if (new Date(invite.expires_at).getTime() < Date.now()) {
      throw serviceError('This invite has expired.', 410);
    }

    const normalizedEmail = invite.email.trim().toLowerCase();
    const userResult = await client.query<{ id: string; email: string }>(
      `SELECT id, email
      FROM users
      WHERE LOWER(email) = LOWER($1)
      LIMIT 1`,
      [normalizedEmail],
    );

    const user = userResult.rows[0];

    if (!user) {
      throw serviceError(
        'Create an account with the invited email before accepting this invite.',
        409,
      );
    }

    const existingMembership = await client.query(
      `SELECT 1
      FROM org_users
      WHERE user_id = $1
      LIMIT 1`,
      [user.id],
    );

    if (existingMembership.rows.length) {
      throw serviceError('This email already belongs to an organization.', 409);
    }

    await client.query(
      `INSERT INTO org_users (org_id, user_id, role)
      VALUES ($1, $2, $3)`,
      [invite.org_id, user.id, invite.role],
    );

    await client.query(
      `DELETE FROM organization_invites
      WHERE id = $1`,
      [invite.id],
    );

    await client.query('COMMIT');

    return {
      orgId: invite.org_id,
      orgName: invite.org_name,
      email: user.email,
      role: invite.role,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
