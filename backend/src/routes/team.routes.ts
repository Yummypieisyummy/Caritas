import { Router } from 'express';
import * as teamController from '../controllers/team.controller';
import { asyncHandler } from '../utils/async_handler';
import {
  requireAdminRole,
  verifyAccessToken,
} from '../middleware/auth.middleware';

const router = Router();

router.use(verifyAccessToken);
router.use(asyncHandler(requireAdminRole));

router.get('/', asyncHandler(teamController.getTeamByOrgId));
router.post('/invite', asyncHandler(teamController.addTeamMember));
router.delete(
  '/members/:targetUserId',
  asyncHandler(teamController.removeTeamMember),
);
router.delete('/invites/:inviteId', asyncHandler(teamController.revokeInvite));

export default router;
