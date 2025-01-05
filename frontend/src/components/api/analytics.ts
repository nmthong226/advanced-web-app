    import axios from "axios";

    export const getAISummary = async (userId: string) => {
        try {
            const response = await axios.get(
            `http://localhost:3000/ai-feedbacks/summary-insights/${userId}`
            );
            return response;
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }