import { Router } from "express";
import { runCleanup } from "./cleanup.controller";

const router = Router();

router.post('/cleanup-users', runCleanup);

export default router;