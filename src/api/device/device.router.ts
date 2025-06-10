import { Router } from "express";
import { getDeviceInfo, getDeviceModel, getCategorie, getCollectionDynamic } from "./device.controller";
import { isAuthenticated } from "../../lib/auth/auth.middlware";

const router = Router();

router.use(isAuthenticated);
router.get('/modelli', getDeviceModel);
router.get('/categoriaInfo', getDeviceInfo);
router.get('/categoria', getCategorie);
router.get('/collection/:categoria', getCollectionDynamic);

export default router;