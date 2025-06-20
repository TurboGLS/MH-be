import { Router } from 'express';
import sourceMultimetriRouter from './sourceMultimetri/sourceMultimetri.router'
import deviceRouter from './device/device.router';
import userRouter from './user/user.router';
import authRouter from './auth/auth.router';
import varlistRouter from './varList/varList.router';
import sourceFotovoltaiciRouter from './sourceFotovoltaici/sourceFotovoltaici.router';
import verificationRouter from './verification/verification.router';
import cleanupRouter from './jobs/cleanup.router';

const router = Router();

router.use('/device', deviceRouter)
router.use('/sourceMultimetri', sourceMultimetriRouter);
router.use('/sourceFotovoltaici', sourceFotovoltaiciRouter);
router.use('/users', userRouter);
router.use('/varlist', varlistRouter);
router.use(authRouter);
router.use('/verification', verificationRouter);
router.use('/jobs', cleanupRouter);

export default router;