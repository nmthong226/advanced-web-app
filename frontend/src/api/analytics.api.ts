import axios from "axios";


export async function fetchAISummaryInsights(): Promise<Object> {
    const url = 'http://127.0.0.1:3000/ai-feedbacks/summary-insights/user_2qKiCnBjfxdDoA7ng2MsICkwAGx';
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching AI Summary Insights:', error);
        throw error;
    }
}