import bcrypt from 'bcrypt';
import * as usersService from '../services/users.service';
import * as orgsService from '../services/org.service';
import { isValidEmail, isValidPassword } from '../utils/validation';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/tokens';
import { createTokenPayload } from '../utils/createTokenPayload';
import { RegisterInput, LoginInput } from '../types/auth';

export async function register({ email, password, orgName }: RegisterInput) {
  if (!email || !password || !orgName) {
    throw new Error('Email, Password, and Org are required');
  }

  if (!isValidEmail(email) || !isValidPassword(password)) {
    throw new Error('Email and Password are invalid');
  }

  // hash password
  const password_hash = await bcrypt.hash(password, 10);

  const org = await orgsService.createOrg({ name: orgName, email });
  const user = await usersService.createUser({
    email,
    password_hash,
    org_id: org.id,
  });

  await orgsService.addOrgUser({
    user_id: user.id,
    org_id: org.id,
    role: 'owner', // Add org user on initial register as 'owner'
  });

  // send an email verification if user was created successfully

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

  // Lookup user
  const user = await usersService.getUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Verify password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const orgUser = await usersService.getOrgUser(user.id);
  if (!orgUser) {
    throw new Error('User is not assigned to an organization');
  }

  const org = await orgsService.getOrgById(orgUser.org_id);
  if (!org.verified) {
    throw new Error('Organization is not verified');
  }

  // Create access token payload
  const fullPayload = createTokenPayload(user, org, orgUser);

  // Generate access and refresh tokens
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
  const decoded = verifyRefreshToken(refreshToken);

  const user = await usersService.getUserById(decoded.user_id);
  if (!user) {
    throw new Error('User does not exist');
  }

  const orgUser = await usersService.getOrgUser(user.id);
  if (!orgUser) {
    throw new Error('User is not assigned to an organization');
  }

  const org = await orgsService.getOrgById(orgUser.org_id);
  if (!org.verified) {
    throw new Error('Organization is not verified');
  }

  // Create access token payload
  const fullPayload = createTokenPayload(user, org, orgUser);

  // Generate new access and refresh tokens
  const newAccessToken = signAccessToken(fullPayload);
  const newRefreshToken = signRefreshToken(user.id);

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
