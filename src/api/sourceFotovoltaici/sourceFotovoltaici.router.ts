import { Router } from "express";
import { getData } from "./sourceFotovoltaici.controller";

const router = Router();

router.get('/getData', getData);

export default router;