import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { asyncHandler } from '../utils/async_handler';
import { requireTurnstile } from "../middleware/require_turnstile";

const router = Router();

router.post('/register', requireTurnstile, asyncHandler(authController.register));
router.post('/login', requireTurnstile, asyncHandler(authController.login));
router.post('/logout', asyncHandler(authController.logout));
router.post('/refresh', asyncHandler(authController.refresh));
router.get('/verify-email', asyncHandler(authController.verifyEmail));

export default router;
