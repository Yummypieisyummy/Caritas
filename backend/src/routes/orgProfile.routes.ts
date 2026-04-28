import { Router } from 'express';
import * as orgsController from '../controllers/org.controller';
import { asyncHandler } from '../utils/async_handler';
import {
  verifyAccessToken,
  requireAdminRole,
} from '../middleware/auth.middleware';

const router = Router();

router.get('/:id', asyncHandler(orgsController.getOrgProfileById));
router.patch(
  '/:id',
  verifyAccessToken,
  requireAdminRole,
  asyncHandler(orgsController.updateOrgProfile),
);

export default router;
