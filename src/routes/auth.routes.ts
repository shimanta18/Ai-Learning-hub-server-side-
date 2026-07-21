import { Router, Response } from 'express';
import { registerUserController } from '../controllers/auth.controller';
import { registerUserSchema } from '../validations/user.validation';
import { verifyFirebaseToken, AuthenticatedRequest } from '../middlewares/auth.middleware';
import { User } from '../models/User'; // Adjust path to your User model if needed

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
            errors: error.errors?.map((e: any) => ({ path: e.path[1], message: e.message })) || [],
        });
    }
};

// POST route for registering a user
router.post('/register', validate(registerUserSchema), registerUserController);

// GET route for fetching current user & auto-registering in MongoDB if missing
// GET /api/v1/auth/me
// GET route for fetching current user & auto-registering in MongoDB if missing
router.get('/me', verifyFirebaseToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const firebaseUid = req.user?.uid;
        const email = req.user?.email;

        if (!firebaseUid) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Missing user credentials',
            });
        }

        // Try to find existing user in MongoDB
        let user = await User.findOne({ firebaseUid });

        // Auto-register if user authenticated via Firebase but missing in MongoDB
        if (!user) {
            const role: 'Admin' | 'User' = email?.toLowerCase().includes('admin')
                ? 'Admin'
                : 'User';

            user = await User.create({
                firebaseUid,
                email,
                role,
                displayName: req.user?.name || email?.split('@')[0] || 'User',
            });
        }

        return res.status(200).json({
            success: true,
            role: user.role,
            user,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
});

export const authRoutes = router;