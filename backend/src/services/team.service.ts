import crypto from 'crypto';
import { query } from '../config/db';
import { InviteInput } from '../types/team';
import { sendEmail } from '../utils/send_email';
import * as orgsServices from './org.service';
import { url } from 'inspector';

const FRONTEND = process.env.FRONTEND_URL;

export const getTeamData = async (orgId: string) => {
  const org = await query(`SELECT verified FROM organizations WHERE id = $1`, [
    orgId,
  ]);

  if (!org.rows.length) {
    throw new Error('Organization not found');
  }

  if (!org.rows[0].verified) {
    throw new Error('Organization not verified');
  }

  const { rows } = await query(
    `SELECT ou.role, u.id, u.email, u.email_verified_at, u.created_at
    FROM org_users ou
    JOIN users u ON ou.user_id = u.id
    WHERE org_id = $1
    ORDER BY ou.role ASC, u.created_at DESC`,
    [orgId],
  );

  return rows;
};

export const inviteTeamMember = async (data: InviteInput) => {
  const { orgId, inviterId, inviterRole, email, role } = data;

  if (!email || !role) {
    throw new Error('Email and role are required.');
  }

  if (inviterRole !== 'admin') {
    throw new Error('Only organization admins can invite new team members.');
  }

  await orgsServices.assertOrgVerified(orgId);

  const existingMember = await query(
    `SELECT * FROM users u JOIN org_users ou ON ou.user_id = u.id WHERE u.email = $1 and ou.org_id = $2`,
    [email, orgId],
  );

  if (existingMember.rows.length) {
    throw new Error('User is already a member of this organization.');
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // invite expires in 7 days

  const { rows } = await query(
    `INSERT INTO organization_invites (org_id, email, role, token, invited_by, expires_at)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (org_id, email) 
    DO UPDATE SET token = $4, expires_at = $6, created_at = NOW()
    RETURNING *`,
    [orgId, email, role, token, inviterId, expiresAt],
  );

  const invite = rows[0];

  // Send the notification email
  const inviteUrl = `${FRONTEND}/accept-invite?token=${token}`;
  const subject = `You've been invited to join an organization on Caritas`;
  const message = `
  <p>Hello,</p>

  <p>You have been invited to join an organization on Caritas as a <strong>${role}</strong>.</p>

  <p>
    Click the link below to accept the invitation:<br/>
    <a href="${inviteUrl}">${inviteUrl}</a>
  </p>

  <p>This link will expire in 7 days.</p>
`;

  await sendEmail(email, subject, message);

  // Just print url to console for now:
  console.log('invite url', inviteUrl);

  return invite;
};
