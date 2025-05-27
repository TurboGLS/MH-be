import { Router } from "express";
import { getData } from "./source.controller";

const router = Router();

router.get('/getData', getData);

export default router;