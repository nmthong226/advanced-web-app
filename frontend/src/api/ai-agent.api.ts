import axios from "axios";


export async function chatWithAiAgent(userMessage: string): Promise<Object> {
    const url = `${import.meta.env.VITE_BACKEND}/ai-agent`;
    try {
        const response = await axios.post(url, {
            prompt: userMessage
        });
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error fetching AI Summary Insights:', error);
        throw error;
    }
}