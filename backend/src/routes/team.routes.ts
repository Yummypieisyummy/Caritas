import { Router } from 'express';
import * as teamController from '../controllers/team.controller';
import { asyncHandler } from '../utils/async_handler';
import { verifyAccessToken } from '../middleware/auth.middleware';

const router = Router();

router.use(verifyAccessToken);

router.get('/', asyncHandler(teamController.getTeamByOrgId));
router.post('/invite', asyncHandler(teamController.addTeamMember));

export default router;
