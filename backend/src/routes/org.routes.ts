import { Router } from "express";
import * as orgsController from "../controllers/org.controller";
import { asyncHandler } from "../utils/async_handler";

const router = Router();

router.post("/", asyncHandler(orgsController.createOrg));
router.get("/", asyncHandler(orgsController.listOrgs));
router.get("/:id", asyncHandler(orgsController.getOrgById));

export default router;
