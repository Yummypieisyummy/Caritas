import { Router } from 'express';
import * as orgsController from '../controllers/org.controller';
import { asyncHandler } from '../utils/async_handler';

const router = Router();

router.get('/:id', asyncHandler(orgsController.getOrgProfileById));

export default router;
