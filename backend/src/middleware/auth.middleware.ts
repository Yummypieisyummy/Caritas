// USAGE:
// router.use(verifyAccessToken);   // All routes below require authentication
// router.get(...);                 // Protected route
// router.use(requireVerifiedOrg);  // All routes below also require verified org
// router.post(...);                //Protected + verified org required

import jwt from 'jsonwebtoken';
import { AuthPayload } from '../types/auth';

const JWT_ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;

// Base level token verification for protected routes
export function verifyAccessToken(req, res, next) {
  const authHeader = req.headers.authorization;

  const token = authHeader?.split(' ')[1]; // Extract the "Bearer <token>"

  if (!token) {
    throw new Error('Access token is required'); // Need to add status codes later
  }

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET!) as AuthPayload;
    req.user = decoded; // Save user info in the request
    next(); // Continue to the next middleware / route
  } catch (err: any) {
    throw err || 'Invalid or expired access token'; // Add status code, improve overall auth error handling later - a bit confusing
  }
}

// Check if org is verified from token payload for routes like: creating, updating posts, etc
export function requireVerifiedOrg(req, res, next) {
  if (!req.user?.orgVerified) {
    throw new Error('Organization is not verified');
  }
  next();
}
