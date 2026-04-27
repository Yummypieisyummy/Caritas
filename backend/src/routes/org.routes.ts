import { Router } from 'express';
import * as orgsController from '../controllers/org.controller';
import { asyncHandler } from '../utils/async_handler';
import {
  verifyAccessToken,
  requireAdminRole,
} from '../middleware/auth.middleware';

const router = Router();

router.post('/', asyncHandler(orgsController.createOrg));
router.get('/', asyncHandler(orgsController.listOrgs));
router.get('/:id', asyncHandler(orgsController.getOrgById));
router.post(
  '/:id/verification',
  verifyAccessToken,
  requireAdminRole,
  orgsController.submitVerification,
);

// Delete and export organization data require authentication + admin role.
router.delete(
  '/:id',
  verifyAccessToken,
  requireAdminRole,
  orgsController.deleteOrganization,
);
router.get(
  '/:id/export',
  verifyAccessToken,
  requireAdminRole,
  orgsController.exportOrganizationData,
);

export default router;
