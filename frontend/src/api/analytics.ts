import axios from "axios";

export const fetchAISummary = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND}/ai-feedbacks/summary-insights`,
      );
      return response.data; // Return the AI summary data for further use
    } catch (error) {
      console.error('Error fetching AI summary:', error);
      return null; // Return null or handle the error as needed
    }
  };
  