import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { User } from '../models/User';

// 1. YOUR REGISTRATION CONTROLLER (Keep your registration logic here)
export const registerUserController = async (req: Request, res: Response) => {
    try {
        const { email, firebaseUid } = req.body;

        // Your existing user registration/creation logic goes here
        // Example:
        // const newUser = await User.create({ email, firebaseUid, role: 'User' });

        return res.status(201).json({
            success: true,
            message: "User registered successfully"
        });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 2. YOUR GET ME CONTROLLER (For fetching the profile & role)
export const getMeController = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const firebaseUid = req.user?.uid;

        // Hunt down document properties based on your unique Firestore/Mongo key structure
        const dbUser = await (User as any).findOne({ firebaseUid });

        if (!dbUser) {
            return res.status(404).json({ success: false, message: 'User database profile missing' });
        }

        return res.status(200).json({
            success: true,
            role: dbUser.role || 'User', // Fallback defaults safely to standard privilege rules
            email: dbUser.email
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server lookup failure' });
    }
};