import { Router } from "express";
import * as usersController from "../controllers/users.controller";
import { asyncHandler } from "../utils/async_handler";

const router = Router();

router.post("/", asyncHandler(usersController.createUser));
router.get("/", asyncHandler(usersController.listUsers));
router.get("/:id", asyncHandler(usersController.getUserById));

export default router;
