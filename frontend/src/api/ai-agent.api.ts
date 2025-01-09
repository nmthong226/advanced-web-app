import axios from "axios";

export interface AIMessage {
    prompt: string; // The user's message to be sent to the AI agent
    userId?: string; // Optional user ID for identification (if applicable)
    preferredModel: string; // Optional preference for a specific AI model (if supported)
    userRole: string; // Optional user role for potential role-based responses (if applicable)
  }

export async function chatWithAiAgent(payload: AIMessage): Promise<Object> {
    const url = `${import.meta.env.VITE_BACKEND}/ai-agent`;
    try {
        const response = await axios.post(url, payload);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error fetching AI Summary Insights:', error);
        throw error;
    }
}