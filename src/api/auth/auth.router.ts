import { validate } from "../../lib/validation-middleware";
import { Router } from "express";
import { AddUserDTO } from "./user.dto";
import { register, login } from "./auth.controller";

const router = Router();

router.post('/register', validate(AddUserDTO), register);
router.post('/login', login);

export default router;
