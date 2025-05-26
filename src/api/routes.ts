import { Router } from 'express';
import sourceRouter from './sourceMultimetri/source.router'

const router = Router();

router.use('/source', sourceRouter);

export default router;