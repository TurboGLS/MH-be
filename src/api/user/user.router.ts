import { Router } from "express";
import { isAuthenticated } from "../../lib/auth/auth.middlware";
import { me } from "./user.controller";

const router = Router();

router.get('/me', isAuthenticated, me);

export default router;