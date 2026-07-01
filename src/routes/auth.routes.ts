import { Router } from 'express';
import { registerUserController, getMeController } from '../controllers/auth.controller';
import { registerUserSchema } from '../validations/user.validation';
import { verifyFirebaseToken } from '../middlewares/auth.middleware';

const router = Router();

// Middleware helper to validate request data using Zod
const validate = (schema: any) => (req: any, res: any, next: any) => {
    try {
        schema.parse({ body: req.body, query: req.query, params: req.params });
        next();
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: error.errors.map((e: any) => ({ path: e.path[1], message: e.message })),
        });
    }
};

// POST route for registering a user
router.post('/register', validate(registerUserSchema), registerUserController);

// GET route for getting the current logged-in user profile & role
router.get('/me', verifyFirebaseToken, getMeController);

export const authRoutes = router;