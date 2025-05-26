import { Router } from "express";
import { getMultimetriModel } from "./multimetri.controller";

const router = Router();

router.get('/modelli', getMultimetriModel);

export default router;