import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('Database initialization failure: MONGODB_URI configuration is missing from .env.');
        }
        await mongoose.connect(uri);
        console.log('📡 Secured robust connection to MongoDB Atlas Cluster.');
    } catch (error) {
        console.error('Critical database connection error:', error);
        process.exit(1);
    }
};