import { Router } from "express";
import { getData } from "./sourceMultimetri.controller";

const router = Router();

router.get('/getData', getData);

export default router;