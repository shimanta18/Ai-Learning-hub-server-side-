import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

/**
 * Generates a text response from the Gemini model based on a prompt.
 * @param prompt The prompt instruction for the AI.
 */
export const generateAIResponse = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        if (!response.text) {
            throw new Error('AI returned an empty response.');
        }

        return response.text;
    } catch (error: any) {
        console.error('Gemini API Error details:', error);
        throw new Error(`AI Generation failed: ${error.message}`);
    }
};


export const generateChatResponse = async (history: any[], userContext: string): Promise<string> => {
    try {

        const contents = history;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                systemInstruction: `You are the official AI Learning Assistant for LearningHub. 
                Be highly supportive, concise, and technical. 
                Context about the current user: ${userContext}`,
                temperature: 0.7,
            }
        });


        if (!response.text) throw new Error('AI returned an empty response.');
        return response.text;
    } catch (error: any) {
        console.error('Chat AI Error:', error);
        throw new Error(`Chat generation failed: ${error.message}`);
    }
};


export const generateSmartRecommendations = async (completedCourses: string[], catalog: any[]): Promise<any> => {
    try {
        // Compress catalog data down to key variables to keep the prompt clean and context-focused
        const formattedCatalog = catalog.map((course: any) => ({
            id: course._id.toString(), // Extracting the real MongoDB string Object ID
            title: course.title,
            category: course.category,
            level: course.level,
            description: course.description
        }));

        const prompt = `
        You are an expert academic advisor for LearningHub.
        Analyze the user's completed courses: ${JSON.stringify(completedCourses)}.
        Here is our platform's current catalog of available courses: ${JSON.stringify(formattedCatalog)}.
        
        Recommend exactly 2 or 3 courses from the catalog that logically follow what the user has completed.
        Ensure you pull the exact "id" from the catalog items provided.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "ARRAY",
                    items: {
                        type: "OBJECT",
                        properties: {
                            id: { type: "STRING", description: "The exact database string ID of the recommended course" },
                            title: { type: "STRING" },
                            reasoning: { type: "STRING", description: "A one-sentence personalized reason explaining why this fits their history" }
                        },
                        required: ["id", "title", "reasoning"]
                    }
                }
            }
        });

        return JSON.parse(response.text || "[]");
    } catch (error: any) {
        console.error('Recommendation AI Error:', error);
        throw new Error(`Recommendation generation failed: ${error.message}`);
    }
};