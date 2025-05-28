import { Router } from "express";
import { downloadVarList } from "./varList.controller";

const router = Router();

router.post('/download', downloadVarList);

export default router;