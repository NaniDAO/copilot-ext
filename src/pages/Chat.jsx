import React, { useState } from "react";
import "./Chat.css";
import { CONFIG } from "../config";
import ReactMarkdown from "react-markdown";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return; // Prevent empty messages

    setIsLoading(true);

    // Add user message to chat
    setChatHistory((prev) => [...prev, { role: "user", content: message }]);

    chrome.tabs.captureVisibleTab(null, { format: "png" }, async (dataUrl) => {
      if (chrome.runtime.lastError) {
        console.error("Screenshot error:", chrome.runtime.lastError);
        setIsLoading(false);
        return;
      }

      try {
        const requestBody = {
          model: "google/gemini-2.0-flash-001",
          messages: [
            {
              role: "system",
              content: "BE HONEST. BE BASED. ALWAYS ANSWER THE USER EARNESTLY.",
            },
            ...chatHistory,
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: message,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: dataUrl,
                  },
                },
              ],
            },
          ],
        };

        const response = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + CONFIG.OPENROUTER_API_KEY,
            },
            body: JSON.stringify(requestBody),
          },
        );

        const data = await response.json();

        console.log("assistant", data);

        // Add bot response to chat
        setChatHistory((prev) => [
          ...prev,
          { role: "assistant", content: data.choices[0].message.content },
        ]);
      } catch (error) {
        console.error("API error:", error);
        setChatHistory((prev) => [
          ...prev,
          { sender: "bot", text: "Sorry, something went wrong." },
        ]);
      } finally {
        setIsLoading(false);
      }
    });

    setMessage("");
  };

  return (
    <div className="chat">
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isLoading}
        />
        <button onClick={handleSend} disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
      <div className="chat-messages">
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-content">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
