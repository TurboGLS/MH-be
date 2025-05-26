import { validate } from "../../lib/validation-middleware";
import { Router } from "express";
import { AddUserDTO } from "./user.dto";
import { add, login } from "./auth.controller";

const router = Router();

router.post('/register', validate(AddUserDTO), add);
router.post('/login', login);

export default router;
