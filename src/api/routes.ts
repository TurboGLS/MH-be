import { Router } from 'express';
import sourceRouter from './sourceMultimetri/source.router'
import deviceRouter from './device/device.router';
import userRouter from './user/user.router';
import authRouter from './auth/auth.router';
import varlistRouter from './varList/varList.router';

const router = Router();

router.use('/device', deviceRouter)
router.use('/source', sourceRouter);
router.use('/users', userRouter);
router.use('/varlist', varlistRouter);
router.use(authRouter);

export default router;