import bcrypt from 'bcrypt';
import * as usersService from '../services/users.service';
import * as orgsService from '../services/org.service';
import { isValidEmail, isValidPassword } from '../utils/validation';
import { sendEmail } from '../utils/send_email';
import {
  signAccessToken,
  signEmailToken,
  signRefreshToken,
  verifyToken,
} from '../utils/tokens';
import { createTokenPayload } from '../utils/create_token_payload';
import { RegisterInput, LoginInput } from '../types/auth';
import { pool } from '../config/db';

const FRONTEND = process.env.FRONTEND_URL;

export async function register({ email, password, orgName }: RegisterInput) {
  if (!email || !password || !orgName) {
    throw new Error('Email, Password, and Org are required');
  }

  if (!isValidEmail(email) || !isValidPassword(password)) {
    throw new Error('Email and Password are invalid');
  }

  const existingUser = await usersService.getUserByEmail(email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const password_hash = await bcrypt.hash(password, 10);

  // const org = await orgsService.createOrg({ name: orgName, email });
  // const user = await usersService.createUser({
  //   email,
  //   password_hash,
  //   // org_id: org.id,
  // });

  // await orgsService.addOrgUser({
  //   user_id: user.id,
  //   org_id: org.id,
  //   role: 'admin', // Add org user on initial register as 'admin'
  // });

  // 1. Check out a dedicated client for the transaction
  const client = await pool.connect();
  let user, org;

  try {
    await client.query('BEGIN'); // Start Transaction

    const orgResult = await client.query(
      `INSERT INTO organizations (name, email) VALUES ($1, $2) RETURNING *`,
      [orgName, email],
    );
    org = orgResult.rows[0];

    const userResult = await client.query(
      `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *`,
      [email, password_hash],
    );
    user = userResult.rows[0];

    await client.query(
      `INSERT INTO org_users (org_id, user_id, role) VALUES ($1, $2, $3)`,
      [org.id, user.id, 'admin'],
    );

    await client.query('COMMIT'); // Save changes
  } catch (error) {
    await client.query('ROLLBACK'); // Undo everything if it fails
    console.error('Registration transaction failed:', error);
    throw new Error('Failed to register account. Please try again.');
  } finally {
    client.release(); // Return client to pool
  }

  const emailToken = signEmailToken({ user_id: user.id });
  const verifyURL = `${FRONTEND}/verify-email?token=${emailToken}`;

  const subject = 'Caritas Account Verification';
  const message = `Hi ${orgName},
Thank you for creating an account with Caritas!
To complete your registration, please verify your email by clicking the link below:
${verifyURL}

Once verified, our admins will review your organization's documentation before granting full access.

Best regards,
The Caritas Team`;
  await sendEmail(email, subject, message);

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    org: {
      id: org.id,
      name: org.name,
      verified: org.verified,
    },
  };
}

export async function login({ email, password }: LoginInput) {
  if (!email || !password) {
    throw new Error('Email and Password are required');
  }

  const user = await usersService.getUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!user.email_verified_at) {
    throw new Error('Unverified email');
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const userOrgs = await usersService.getUserOrgs(user.id);
  if (!userOrgs || userOrgs.length === 0) {
    throw new Error('User is not assigned to an organization');
  }

  const activeOrgRelation = userOrgs[0];

  const org = await orgsService.getOrgById(activeOrgRelation.org_id);
  if (!org) {
    throw new Error('Organization not found');
  }

  const fullPayload = createTokenPayload(user, org, activeOrgRelation);
  const accessToken = signAccessToken(fullPayload);
  const refreshToken = signRefreshToken({ user_id: user.id });

  return {
    tokens: { accessToken, refreshToken },
    user: {
      id: user.id,
      email: user.email,
    },
    org: {
      id: org.id,
      name: org.name,
      verified: org.verified,
    },
  };
}

export async function refresh(refreshToken: string) {
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  // Verify refresh token is still valid
  const decoded = verifyToken(refreshToken, 'REFRESH');

  const user = await usersService.getUserById(decoded.user_id);
  if (!user) {
    throw new Error('User no longer exists');
  }

  const userOrgs = await usersService.getUserOrgs(user.id);
  if (!userOrgs || userOrgs.length === 0) {
    throw new Error('User is not assigned to an organization');
  }

  const activeOrgRelation = userOrgs[0];
  const org = await orgsService.getOrgById(activeOrgRelation.org_id);
  if (!org) throw new Error('Organization not found');

  const fullPayload = createTokenPayload(user, org, activeOrgRelation);
  const newAccessToken = signAccessToken(fullPayload);
  const newRefreshToken = signRefreshToken({ user_id: user.id });

  return {
    tokens: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    user: {
      id: user.id,
      email: user.email,
    },
    org: {
      id: org.id,
      name: org.name,
      verified: org.verified,
    },
  };
}

export async function verifyEmail(emailToken: string) {
  if (!emailToken) {
    throw new Error('No email token provided');
  }

  const decoded = verifyToken(emailToken, 'EMAIL');

  const user = await usersService.getUserById(decoded.user_id);
  if (!user) {
    throw new Error('User not found');
  }

  if (user.email_verified_at) {
    return;
  }

  await usersService.verifyUserEmail(user.id);
}
