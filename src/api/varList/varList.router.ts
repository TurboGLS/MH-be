import { Router } from "express";
import { downloadVarList } from "./varList.controller";

const router = Router();

router.get('/download', downloadVarList);

export default router;