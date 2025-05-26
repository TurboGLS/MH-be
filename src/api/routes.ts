import { Router } from 'express';
import sourceRouter from './sourceMultimetri/source.router'
import multimetriRouter from './multimetri/multimetri.router';
import authRouter from './auth/auth.router';

const router = Router();

router.use('/multimetri', multimetriRouter)
router.use('/source', sourceRouter);
router.use('/users', authRouter);

export default router;