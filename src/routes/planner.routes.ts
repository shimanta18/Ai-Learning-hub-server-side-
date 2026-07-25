import { Router } from 'express';
import { PlannerController } from '../controllers/planner.controller';
import { verifyFirebaseToken } from '../middlewares/auth.middleware';
const router = Router();


router.post('/', verifyFirebaseToken, PlannerController.handleGeneratePlan);

export default router;