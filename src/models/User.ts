import { Schema, model, Document } from 'mongoose';

// TypeScript interface for the User Document
export interface IUser extends Document {
    firebaseUid: string;
    email: string;
    role: 'User' | 'Admin';
    displayName?: string;
    createdAt: Date;
}

const userSchema = new Schema<IUser>({
    firebaseUid: {
        type: String,
        required: true,
        unique: true,
        index: true // Speeds up lookups when checking user profiles
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['User', 'Admin'],
        default: 'User' // New signups default to normal users safely
    },
    displayName: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const User = model<IUser>('User', userSchema);