import { useState, useRef, useEffect } from "react";
import { X } from 'phosphor-react';
import '../styles/ChatBot.css';

function Chatbot({ onClose }: { onClose: () => void }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ type: string, content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Mock responses for demonstration
  const getMockResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
      return "I'd be happy to help you with your resume! Consider highlighting your key skills, quantifying your achievements, and tailoring it to the specific job you're applying for.";
    } else if (lowerMessage.includes('interview')) {
      return "Great question about interviews! Remember to research the company, prepare specific examples using the STAR method, and have thoughtful questions ready to ask the interviewer.";
    } else if (lowerMessage.includes('job') || lowerMessage.includes('career')) {
      return "Career planning is important! Focus on identifying your strengths, exploring growth opportunities in your field, and building a strong professional network.";
    } else if (lowerMessage.includes('skill')) {
      return "Developing new skills is key to career growth! Consider both technical skills relevant to your field and soft skills like communication, leadership, and problem-solving.";
    } else {
      return "That's a great question! I'm here to help with career advice, resume tips, interview preparation, and professional development. What specific aspect would you like to explore?";
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

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = getMockResponse(userMessage);
      setMessages(prev => [...prev, { type: 'bot', content: response }]);
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
