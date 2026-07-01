import { Request, Response } from 'express';
import { generateAIResponse, generateChatResponse, generateSmartRecommendations } from '../services/ai.service';
import { User } from '../models/User';
import Course from '../models/Course';

/**
 * Handles basic single-prompt queries
 */
export const askGeminiController = async (req: Request, res: Response) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ success: false, message: "Prompt is required" });
        }

        const reply = await generateAIResponse(prompt);
        res.status(200).json({ success: true, reply });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Handles context-aware chat assistant with strict Gemini formatting
 */
export const chatController = async (req: Request | any, res: Response) => {
    try {
        const { message, history } = req.body;
        const userEmail = req.user?.email || 'Unknown User';

        // 1. Safely map past history to ensure strict Gemini SDK alignment
        const formattedHistory = (history || []).map((m: any) => ({
            // Convert 'ai' role to 'model' dynamically
            role: m.role === 'ai' || m.role === 'model' ? 'model' : 'user',
            // Fallback safely whether frontend passed an array of parts or raw content string
            parts: m.parts ? m.parts : [{ text: m.content || '' }]
        }));

        // 2. Append the newest message using the exact schema Gemini expects
        const fullHistory = [
            ...formattedHistory,
            { role: 'user', parts: [{ text: message }] }
        ];

        // Mocking user context for now
        const userContext = `The user's email is ${userEmail}. They are studying computer science and web development.`;

        // 3. Pass the fully sanitized history to your service layer
        const reply = await generateChatResponse(fullHistory, userContext);

        res.status(200).json({ success: true, reply });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Handles generating smart course recommendations from live MongoDB data
 */
export const recommendationsController = async (req: Request | any, res: Response) => {
    try {
        const firebaseUid = req.user?.uid;

        const dbUser: any = await (User as any).findOne({ firebaseUid }).populate('completedCourses');

        if (!dbUser) {
            return res.status(404).json({ success: false, message: 'User profile not found in database' });
        }

        const userCompletedCourses = dbUser.completedCourses?.map((course: any) =>
            `${course.title} (${course.category})`
        ) || [];

        const platformCatalog = await Course.find({}, 'title category level description initials numericPrice');

        const recommendations = await generateSmartRecommendations(userCompletedCourses, platformCatalog);

        res.status(200).json({ success: true, recommendations });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};