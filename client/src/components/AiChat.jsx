import React, { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import { chatAboutNewsStream } from "../services/articles";
import ReactMarkdown from "react-markdown";

export const AiChat = ({ title, author, link, launch }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Create a safe, unique key for localStorage based on the link
  const storageKey = `chat_history_${encodeURIComponent(link)}`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Sync messages to local storage whenever they change
  useEffect(() => {
    scrollToBottom();
    if (messages.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, storageKey]);

  const closeModal = () => {
    setOpen(false);
    // Removed setInputValue("") and setMessages([]) to preserve state when hiding
    setIsGenerating(false);
  };

  const startChat = () => {
    // Check local storage for existing history first
    const savedHistory = localStorage.getItem(storageKey);
    
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        if (parsedHistory && parsedHistory.length > 0) {
          setMessages(parsedHistory);
          setOpen(true);
          return; // Skip sending initial prompt since we have history
        }
      } catch (e) {
        console.error("Failed to parse chat history from local storage", e);
      }
    }

    // Only set initial prompt if no history exists and current messages are empty
    if (messages.length === 0) {
      const initialMsg = `This is a chat about the piece: ${title} by ${author} at ${link}. Start off by providing a brief summary.`;
      setInputValue(initialMsg);
    }
    setOpen(true);
  };

  useEffect(() => {
    if (launch) {
      startChat();
    }
  }, [launch]);
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isGenerating) return;

    const userMsgText = inputValue;
    setInputValue(""); // Clear input early for better UX
    setIsGenerating(true);

    const userMsg = {
      role: "user",
      parts: [{ text: userMsgText }],
    };
    
    // Add user message, and an empty model message placeholder
    setMessages((prevMsg) => [
        ...prevMsg, 
        userMsg,
        { role: "model", parts: [{ text: "" }] }
    ]);

    // We only want to send the previous history to the API, excluding the new empty model placeholder we just added.
    // However, the exact previous history matches what the user is sending now.
    const historyToSend = [...messages]; 

    try {
      await chatAboutNewsStream({ 
        messages: historyToSend, 
        inputValue: userMsgText,
        onChunk: (chunkText) => {
            setMessages((prevMsgs) => {
                const newMsgs = [...prevMsgs];
                const lastMsg = newMsgs[newMsgs.length - 1];
                if (lastMsg.role === "model") {
                    lastMsg.parts[0].text += chunkText;
                }
                return newMsgs;
            });
        }
      });
    } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prevMsgs) => {
            const newMsgs = [...prevMsgs];
            const lastMsg = newMsgs[newMsgs.length - 1];
            if (lastMsg.role === "model" && lastMsg.parts[0].text === "") {
               lastMsg.parts[0].text = "Error sending message! Try again later.";
            } else {
               newMsgs.push({ role: "system", text: "Error sending message" });
            }
            return newMsgs;
        });
    } finally {
        setIsGenerating(false);
    }
  };
  return (
    <div>
      <Modal
        isOpen={open}
        onRequestClose={closeModal}
        contentLabel="Chat About Stuff"
        ariaHideApp={false}
        shouldCloseOnOverlayClick={true}
        style={{
          overlay: {
            backgroundColor: "#4e4b4bf4",
          },
          content: {
            display: "flex",
            flexDirection: "column",
            height: "80%",
            width: "80%",
            margin: "auto",
            backgroundColor: "#091235",
            border: "none",
            padding: "0",
            borderRadius: "12px"
          },
        }}
      >
        <h2 className="rounded-md font-subheading font-bold mb-1 bg-secondary p-2 text-center md:m-2">
          {title}
        </h2>
        <div className="flex-grow overflow-y-auto mb-4 font-sans text-sm leading-relaxed scrollbar-thin scrollbar-track-gray-800">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 flex flex-col ${
                message.role === "user"
                  ? "items-end ml-2 mr-1 md:ml-[25%] md:mb-2 md:p-2"
                  : "items-start mr-2 ml-1 md:mr-[25%] md:mb-2 md:p-2"
              }`}
            >
              <div
                className={`inline-block p-3 rounded-xl max-w-full overflow-hidden ${
                  message.role === "user"
                    ? "bg-accent text-primary rounded-tr-none"
                    : "bg-gray-200 text-gray-900 rounded-tl-none"
                }`}
              >
                {message.role === "model" ? (
                    <ReactMarkdown className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 break-words">
                        {message.parts ? message.parts[0].text : "Error sending message! Try again later."}
                    </ReactMarkdown>
                ) : (
                    <span>{message.parts ? message.parts[0].text : "..."}</span>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex mt-auto mb-1 mx-1 gap-2 relative p-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" &&
              !e.shiftKey &&
              (e.preventDefault(), handleSendMessage())
            }
            className="flex-grow border rounded-lg p-2 bg-primary text-text disabled:opacity-50 resize-none h-24"
            placeholder={isGenerating ? "AI is typing..." : "Type your message..."}
            disabled={isGenerating}
          />
          <button
            onClick={handleSendMessage}
            disabled={isGenerating || !inputValue.trim()}
            className="h-24 bg-accent hover:bg-gray-400 text-primary font-bold rounded-lg px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors h-14"
          >
            {isGenerating ? (
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </span>
            ) : "Send"}
          </button>
        </div>
      </Modal>
    </div>
  );
};
