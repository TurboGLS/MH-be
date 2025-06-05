import { Router } from "express";
import { getDeviceInfo, getDeviceModel, getCategorie } from "./device.controller";
import { isAuthenticated } from "../../lib/auth/auth.middlware";

const router = Router();

router.use(isAuthenticated);
router.get('/modelli', getDeviceModel);
router.get('/categoriaInfo', getDeviceInfo);
router.get('/categoria', getCategorie);

export default router;