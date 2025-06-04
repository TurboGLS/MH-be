import { Router } from "express";
import { getDeviceInfo, getDeviceModel, getCategorie } from "./device.controller";

const router = Router();

router.get('/modelli', getDeviceModel);
router.get('/categoriaInfo', getDeviceInfo);
router.get('/categoria', getCategorie);

export default router;