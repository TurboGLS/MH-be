import { Router } from "express";
import { getDeviceCategory, getDeviceModel } from "./device.controller";

const router = Router();

router.get('/modelli', getDeviceModel);
router.get('/categoria', getDeviceCategory);

export default router;