import { Router } from "express";
import * as postsController from "../controllers/posts.controller";
import { asyncHandler } from "../utils/async_handler";

const router = Router();

// TODO: Add comments documenting how every route works

/**
 * POST /posts
 * Create a post
 */
router.post("/", asyncHandler(postsController.createPost));

/**
 * GET /posts/:id
 * Fetch a single post
 */
router.get("/:id", asyncHandler(postsController.getPostById));

/**
 * GET /posts
 * List posts (optionally filtered)
 */
router.get("/", asyncHandler(postsController.listPosts));

export default router;
