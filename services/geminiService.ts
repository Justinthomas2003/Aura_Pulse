
import { GoogleGenAI, Type } from "@google/genai";
import { Activity, OptimizationSuggestion, LongTermGoal, GoalType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getScheduleOptimization = async (activities: Activity[], goals: LongTermGoal[]): Promise<OptimizationSuggestion[]> => {
  if (activities.length === 0) return [];

  const activitiesString = activities
    .map(a => `${a.startTime}-${a.endTime}: ${a.title} (${a.category})`)
    .join('\n');

  const goalsString = goals
    .map(g => `${g.title} (${g.type}): ${g.completedHours}/${g.estimatedTotalHours} hours done`)
    .join('\n');

  const prompt = `Analyze this daily schedule and long-term goals. Provide 3-5 constructive suggestions.
    Schedule:
    ${activitiesString}
    
    Active Goals:
    ${goalsString}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              impact: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
              suggestion: { type: Type.STRING }
            },
            required: ['title', 'impact', 'suggestion']
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    return [];
  }
};

export const estimateGoalDuration = async (title: string, creator: string, type: GoalType): Promise<{ hours: number, info: string }> => {
  const prompt = `Provide an accurate estimation of how many hours it takes to complete the ${type} "${title}" by ${creator}. 
    For books, estimate average reading time. For courses, estimate total video/study time. 
    Return a JSON object with 'hours' (number) and 'info' (short string).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hours: { type: Type.NUMBER },
            info: { type: Type.STRING }
          },
          required: ['hours', 'info']
        }
      }
    });
    return JSON.parse(response.text || '{"hours": 10, "info": "Standard estimation"}');
  } catch (error) {
    return { hours: 10, info: "Generic estimation" };
  }
};
