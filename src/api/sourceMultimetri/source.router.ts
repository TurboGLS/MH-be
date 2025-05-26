import { Router } from "express";
import { getData, pingController } from "./source.controller";

const router = Router();

router.get('/ping', pingController);
router.get('/getData', getData);

export default router;