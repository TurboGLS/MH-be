import { Router } from 'express';
import sourceRouter from './sourceMultimetri/source.router'
import multimetriRouter from './multimetri/multimetri.router';

const router = Router();

router.use('/multimetri', multimetriRouter)
router.use('/source', sourceRouter);

export default router;