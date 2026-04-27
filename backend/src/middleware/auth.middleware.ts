// USAGE:
// router.use(verifyAccessToken);   // All routes below require authentication
// router.get(...);                 // Protected route
// router.use(requireVerifiedOrg);  // All routes below also require verified org
// router.post(...);                //Protected + verified org required

import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { query } from '../config/db';
import { AuthPayload } from '../types/auth';

const JWT_ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;

// Base level token verification for protected routes
export function verifyAccessToken(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  const token = authHeader?.split(' ')[1]; // Extract the "Bearer <token>"

  if (!token) {
    throw new Error('Access token is required'); // Need to add status codes later
  }

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET!) as AuthPayload;
    (req as any).user = decoded; // Save user info in the request
    next(); // Continue to the next middleware / route
  } catch (err: any) {
    throw err || 'Invalid or expired access token'; // Add status code, improve overall auth error handling later - a bit confusing
  }
}

const forbidden = (message: string) => {
  const error = new Error(message) as Error & { status?: number };
  error.status = 403;
  return error;
};

// Check if the authenticated user's organization is verified for protected org workflows.
export async function requireVerifiedOrg(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const user = (req as any).user as AuthPayload | undefined;

    if (!user?.org_id) {
      throw forbidden('Organization is required');
    }

    const { rows } = await query<{ verified: boolean }>(
      `SELECT verified FROM organizations WHERE id = $1`,
      [user.org_id],
    );

    if (!rows.length || rows[0].verified !== true) {
      throw forbidden('Organization must be verified to perform this action');
    }

    next();
  } catch (error) {
    next(error);
  }
}

// Check the current org_users row for sensitive organization actions.
export async function requireAdminRole(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const user = (req as any).user as AuthPayload | undefined;
    const orgId = req.params.id || user?.org_id;

    if (!user || user.role !== 'admin') {
      throw forbidden('Admin role is required to perform this action');
    }

    if (!orgId || orgId !== user.org_id) {
      throw forbidden('You do not have access to this organization');
    }

    const { rows } = await query(
      `
      SELECT 1
      FROM org_users
      WHERE org_id = $1
        AND user_id = $2
        AND role = 'admin'
      LIMIT 1
      `,
      [orgId, user.user_id],
    );

    if (!rows.length) {
      throw forbidden('Admin role is required to perform this action');
    }

    next();
  } catch (error) {
    next(error);
  }
}
