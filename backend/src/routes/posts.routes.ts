import { Router } from 'express';
import * as postsController from '../controllers/posts.controller';
import { asyncHandler } from '../utils/async_handler';
import { verifyAccessToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/public', asyncHandler(postsController.getPublicPosts));

router.use(verifyAccessToken);

// TODO: Add comments documenting how every route works

/**
 * POST /posts
 * Create a post
 */
router.post('/', asyncHandler(postsController.createPost));

/**
 * GET /posts/:id
 * Fetch a single post
 */
router.get('/:id', asyncHandler(postsController.getPostById));

router.delete('/:id', asyncHandler(postsController.deletePostById));

router.patch(
  '/update/status/:id',
  asyncHandler(postsController.updatePostStatus),
);

/**
 * GET /posts
 * List posts (optionally filtered)
 */
router.get('/', asyncHandler(postsController.getOrgPosts));

export default router;
