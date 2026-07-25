import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const PLANNER_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        planTitle: { type: Type.STRING, description: 'Catchy title for the study plan' },
        summary: { type: Type.STRING, description: '2-sentence strategic summary' },
        milestones: {
            type: Type.ARRAY,
            description: 'Chronological study timeline',
            items: {
                type: Type.OBJECT,
                properties: {
                    period: { type: Type.STRING, description: 'e.g., Day 1, Week 1' },
                    focusArea: { type: Type.STRING, description: 'Core topic' },
                    tasks: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: '3-4 actionable tasks'
                    },
                    timeEstimate: { type: Type.STRING, description: 'Estimated time' },
                    proTip: { type: Type.STRING, description: 'Technical study tip' }
                },
                required: ['period', 'focusArea', 'tasks', 'timeEstimate', 'proTip']
            }
        }
    },
    required: ['planTitle', 'summary', 'milestones']
};

export class PlannerService {

    // Generates a structured JSON study roadmap via Gemini

    static async generateStudyPlan(data: {
        topic: string;
        duration: string;
        hoursPerDay?: string;
        experienceLevel?: string;
    }) {
        const prompt = `Create a realistic, actionable study plan for learning: "${data.topic}".
    Duration: ${data.duration}.
    Daily Time Commitment: ${data.hoursPerDay || '2'} hours/day.
    Target Level/Goal: ${data.experienceLevel || 'Beginner aiming for mastery'}.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: 'You are an expert academic curriculum designer and senior technical mentor.',
                temperature: 0.5,
                responseMimeType: 'application/json',
                responseSchema: PLANNER_SCHEMA,
            }
        });

        return JSON.parse(response.text || '{}');
    }
}