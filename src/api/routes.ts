import { Router } from 'express';
import sourceMultimetriRouter from './sourceMultimetri/sourceMultimetri.router'
import deviceRouter from './device/device.router';
import userRouter from './user/user.router';
import authRouter from './auth/auth.router';
import varlistRouter from './varList/varList.router';
import sourceFotovoltaiciRouter from './sourceFotovoltaici/sourceFotovoltaici.router';

const router = Router();

router.use('/device', deviceRouter)
router.use('/sourceMultimetri', sourceMultimetriRouter);
router.use('/sourceFotovoltaici', sourceFotovoltaiciRouter);
router.use('/users', userRouter);
router.use('/varlist', varlistRouter);
router.use(authRouter);

export default router;