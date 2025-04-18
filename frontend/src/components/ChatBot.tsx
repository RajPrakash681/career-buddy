import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../libs/apiCalls";
import { X } from 'phosphor-react';
import '../styles/ChatBot.css';

function Chatbot({ onClose }: { onClose: () => void }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ type: string, content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('light-mode');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([{
      type: 'bot',
      content: "Hi! I'm your AI Career Assistant. How can I help you today?"
    }]);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setMessage(`Analyzing file: ${file.name}\n\n${content.slice(0, 1000)}...`);
      };
      reader.readAsText(file);
      setSelectedFile(file);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    setMessage("");

    try {
      setIsLoading(true);
      setMessages(prev => [...prev, { type: 'user', content: userMessage }]);

      const response = await sendChatMessage(userMessage);

      if (response?.response) {
        setMessages(prev => [...prev, { type: 'bot', content: response.response }]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      setMessages(prev => [...prev, {
        type: 'error',
        content: `Error: ${error.message || "Failed to get a response"}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);  
  };

  return (
    <div className={`chatbot-wrapper ${isClosing ? 'closing' : ''}`}>
      <div className="chatbot-header">
        <h3>AI Career Assistant</h3>
        <button className="close-button" onClick={handleClose}>
          <X size={24} weight="bold" />
        </button>
      </div>

      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            {msg.content}
          </div>
        ))}
        {isLoading && <div className="loading">AI is thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="input-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask me anything about your career..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !message.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default Chatbot;
