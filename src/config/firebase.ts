// src/config/firebase.ts
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import path from 'path';

let serviceAccount;

if (process.env.FIREBASE_CREDENTIALS) {
    // Production: Parse the JSON string from Render's Environment Variable
    serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
} else {
    // Local Development: Fallback to your local file in the backend root directory
    serviceAccount = require(path.join(__dirname, '../../serviceAccountKey.json'));
}

if (getApps().length === 0) {
    initializeApp({
        credential: cert(serviceAccount),
    });
    console.log('🔥 Firebase Admin SDK initialized successfully.');
}

export const auth = getAuth();