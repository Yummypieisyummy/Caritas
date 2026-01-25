import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { asyncHandler } from '../utils/async_handler';

const router = Router();

router.post('/register', asyncHandler(authController.register));
router.post('/login', asyncHandler(authController.login));
router.post('/logout', asyncHandler(authController.logout));
router.post('/register', asyncHandler(authController.refresh));

export default router;
