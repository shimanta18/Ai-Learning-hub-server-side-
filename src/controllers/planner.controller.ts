import { Request, Response } from 'express';
import { PlannerService } from '../services/planner.service';

export class PlannerController {

    static async handleGeneratePlan(req: Request, res: Response) {
        try {
            const { topic, duration, hoursPerDay, experienceLevel } = req.body;

            if (!topic || !duration) {
                return res.status(400).json({
                    success: false,
                    message: 'Topic and duration are required fields.'
                });
            }

            const plan = await PlannerService.generateStudyPlan({
                topic,
                duration,
                hoursPerDay,
                experienceLevel
            });

            return res.json({ success: true, plan });

        } catch (error) {
            console.error('Study Planner Controller Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to generate study plan. Please try again later.'
            });
        }
    }
}