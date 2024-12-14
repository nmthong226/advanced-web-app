import React, { useEffect, Dispatch, SetStateAction, useRef } from "react";
import { FaArrowUp } from "react-icons/fa6";

interface MessageInputProps {
  messageInput: string;
  setMessageInput: Dispatch<SetStateAction<string>>;
  sendMessage: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ messageInput, setMessageInput, sendMessage }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Reset height when messageInput is cleared
  useEffect(() => {
    if (messageInput === "" && textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset to default height
    }
  }, [messageInput]);

  return (
    <div className="bottom-2 left-1/2 absolute flex flex-row w-full transform -translate-x-1/2">
      <div className="bottom-0 left-1/2 absolute flex w-[90%] transform -translate-x-1/2">
        <div className="flex flex-col justify-center items-center w-full">
          <div className="relative flex flex-row items-center bg-white mb-[2%] border rounded-[32px] w-full">
            <div className="flex flex-col w-full">
              <div className="relative flex flex-row">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  className="custom-scrollbar p-4 rounded-[32px] focus:ring-0 w-[87%] max-h-[250px] overflow-y-auto focus:outline-none resize-none"
                  placeholder="Input your message"
                  value={messageInput}
                  onChange={(e) => {
                    setMessageInput(e.target.value);
                    e.target.style.height = "auto"; // Reset height for recalculation
                    e.target.style.height = `${e.target.scrollHeight}px`; // Adjust to content
                  }}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <div className="right-0 bottom-0 absolute flex flex-row mr-[2%] mb-[6px]">
                  <button
                    className={`p-3 transition duration-300 ${
                      messageInput !== "" ? "bg-zinc-900 text-white hover:bg-zinc-800" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } rounded-full`}
                    onClick={sendMessage}
                  >
                    <FaArrowUp className={`size-5 ${messageInput !== "" ? "text-white" : "text-gray-700"}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <span className="text-center text-gray-600 text-xs xsm:text-sm lg:text-nowrap">
            Be cautious with the bot's reply.
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
