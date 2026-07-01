import { Request, Response } from 'express';
import { generateAIResponse, generateChatResponse, generateSmartRecommendations } from '../services/ai.service';
import { User } from '../models/User';
import Course from '../models/Course';


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


export const chatController = async (req: Request | any, res: Response) => {
    try {
        const { message, history } = req.body;
        const userEmail = req.user?.email || 'Unknown User';


        const formattedHistory = (history || []).map((m: any) => ({

            role: m.role === 'ai' || m.role === 'model' ? 'model' : 'user',

            parts: m.parts ? m.parts : [{ text: m.content || '' }]
        }));


        const fullHistory = [
            ...formattedHistory,
            { role: 'user', parts: [{ text: message }] }
        ];


        const userContext = `The user's email is ${userEmail}. They are studying computer science and web development.`;


        const reply = await generateChatResponse(fullHistory, userContext);

        res.status(200).json({ success: true, reply });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};



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