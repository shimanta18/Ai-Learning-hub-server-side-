import { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { DecodedIdToken } from 'firebase-admin/auth';

export interface AuthenticatedRequest extends Request {
    user?: DecodedIdToken;
}


export const verifyFirebaseToken = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized access token missing' });
    }
    const token = authHeader.split(' ')[1];

    if (!token || token === 'undefined' || token === 'null') {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: Session token is uninitialized or malformed'
        });
    }
    try {
        const decodedToken = await getAuth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error: any) {
        console.error('Firebase Auth Verification Error:', error.code, error.message);
        return res.status(401).json({ success: false, message: 'Session expired or invalid token' });
    }
};


export const isAdmin = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {

    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // Check if the role claim exists and equals 'admin'
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
    }

    next();
};