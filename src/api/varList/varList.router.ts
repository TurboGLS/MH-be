import { Router } from "express";
import { downloadVarList } from "./varList.controller";
import { isAuthenticated } from "../../lib/auth/auth.middlware";

const router = Router();

router.use(isAuthenticated);
router.post('/download', downloadVarList);

export default router;