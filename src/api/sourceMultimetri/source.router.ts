import { Router } from "express";
import { pingController } from "./source.controller";

const router = Router();

router.get('/ping', pingController);

export default router;