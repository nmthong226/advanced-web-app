//Import icons
import { FaThumbsUp, FaExclamationCircle, FaLightbulb } from "react-icons/fa";
import { MdOutlineAutorenew } from "react-icons/md";
import { CiExport } from "react-icons/ci";
import { useEffect, useState } from "react";
import { fetchAISummaryInsights } from "@/api/analytics.api";

interface FeedbackInterface {
    strengths: string;
    improvements: string;
    motivation: string;
}

const AIFeedback = () => {
    // Mock data for AI feedback
    const [feedbackData, setFeedbackData] = useState<FeedbackInterface>({
        strengths: "",
        improvements: "",
        motivation: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            const localData = localStorage.getItem("aiFeedbackData");
            if (localData) {
                setFeedbackData(JSON.parse(localData));
            } else {
                try {
                    const data = await fetchAISummaryInsights();
                    setFeedbackData(data);

                    // Save data to localStorage
                    localStorage.setItem("aiFeedbackData", JSON.stringify(data));
                } catch (error) {
                    console.error("Failed to fetch AI Summary Insights");
                }
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-col gap-2 bg-white shadow-md p-2 h-full">
            <div className="flex flex-col space-y-2 p-4 border rounded-lg h-[92%]">
                <h3 className="bg-gradient-to-r from-indigo-500 to-cyan-400 mb-2 p-1 rounded-lg font-bold font-mono text-center text-white">✨ Summary Feedback & Insights</h3>
                <hr className="border-gray-300 border-t" />
                <div className="flex flex-col gap-2">
                    <h4 className="flex items-center gap-2 font-semibold text-sm text-zinc-900">
                        <FaThumbsUp className="text-green-500" />
                        Strengths
                    </h4>
                    <ul className="pl-5 list-disc">
                        {feedbackData.strengths}
                    </ul>
                </div>
                <hr className="border-gray-300 border-t" />
                <div className="flex flex-col gap-2">
                    <h4 className="flex items-center gap-2 font-semibold text-sm text-zinc-900">
                        <FaExclamationCircle className="text-orange-500" /> 
                        Areas for Improvement
                    </h4>
                    <ul className="pl-5 list-disc">
                        {feedbackData.improvements}
                    </ul>
                </div>
                <hr className="border-gray-300 border-t" />
                <div className="flex flex-col gap-2">
                    <h4 className="flex items-center gap-2 font-semibold text-sm text-zinc-900">
                        <FaLightbulb className="text-blue-500" /> Motivational Message
                    </h4>
                    <p className="text-[12px] italic">{feedbackData.motivation}</p>
                </div>
            </div>
            <div className="flex justify-between space-x-2 h-[8%]">
                <button className="flex justify-center items-center hover:bg-gray-200 border rounded w-[75%] text-gray-800">
                    <MdOutlineAutorenew className="mr-2 size-4" />
                    <p className="font-semibold text-[12px]">
                        Refresh Insights
                    </p>
                </button>
                <button className="flex justify-center items-center hover:bg-gray-200 border rounded w-[25%] text-gray-800">
                    <CiExport className="mr-2 size-4" />
                    <p className="font-semibold text-[12px]">
                        Export
                    </p>
                </button>
            </div>
        </div>
    );
};

export default AIFeedback;
