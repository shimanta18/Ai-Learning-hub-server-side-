import { Router, Response } from 'express';
import { verifyFirebaseToken, isAdmin } from '../middlewares/auth.middleware';
import fs from 'fs';
import path from 'path';

const router = Router();

// @route   GET /api/v1/admin/logs
router.get('/logs', verifyFirebaseToken, isAdmin, (req, res) => {
    const logFilePath = path.join(__dirname, '../../system.log');

    // Check if file exists first
    if (!fs.existsSync(logFilePath)) {
        return res.json({ success: true, logs: ['System initialized. No logs found yet.'] });
    }

    fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ success: false, message: 'Could not read logs' });

        const logLines = data.split('\n').filter(line => line.length > 0).reverse().slice(0, 100);
        res.json({ success: true, logs: logLines });
    });
});

export default router;