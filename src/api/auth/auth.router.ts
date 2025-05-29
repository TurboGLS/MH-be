import { validate } from "../../lib/validation-middleware";
import { Router } from "express";
import { AddUserDTO } from "./auth.dto";
import { register, login, refresh } from "./auth.controller";

const router = Router();

router.post('/register', validate(AddUserDTO), register);
router.post('/login', login);
router.post('/refresh', refresh);

export default router;
