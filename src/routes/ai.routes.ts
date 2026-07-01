import { Router } from 'express';
import { askGeminiController, chatController, recommendationsController } from '../controllers/ai.controller';
import { verifyFirebaseToken } from '../middlewares/auth.middleware';

// 👇 ADD THESE TWO LINES HERE TO FIND THE CULPRIT:
console.log("🔍 CONTROLLERS:", { askGeminiController, chatController, recommendationsController });
console.log("🔍 MIDDLEWARE:", verifyFirebaseToken);

const router = Router();

// Your existing open route
router.post('/ask', askGeminiController);

// New protected AI routes
router.post('/chat', verifyFirebaseToken, chatController);
router.get('/recommendations', verifyFirebaseToken, recommendationsController);

export default router;