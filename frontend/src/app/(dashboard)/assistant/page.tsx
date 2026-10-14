'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Loader2, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  timestamp: Date;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am Pulse AI, your business decision intelligence assistant. I can help you analyze your metrics, find anomalies, and forecast future performance based on your actual data. How can I help you today?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Get the selected business ID from local storage or context (mocking for now, assuming demo business)
      // In a real app, you'd get this from your global state/auth context
      const businessId = localStorage.getItem('selectedBusinessId') || 'demo-business-id';
      const token = localStorage.getItem('token'); // or from auth context

      const response = await fetch(`http://localhost:4000/api/businesses/${businessId}/pulse/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ question: userMsg.content })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get response');
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.data.answer,
        confidence: data.data.confidence,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'm sorry, I encountered an error: ${error.message}. Please check if the backend is running and you are logged in.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-5xl mx-auto rounded-2xl overflow-hidden border border-[#2A2A2D] bg-[#111113] shadow-2xl">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b border-[#2A2A2D] bg-[#171719]">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 border border-white/20 mr-4 text-white">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight">Pulse AI Assistant</h2>
          <p className="text-sm text-[#A1A1AA]">Grounded in your actual business data</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1
                  ${message.role === 'user' 
                    ? 'bg-[#1D1D20] border border-[#2A2A2D] ml-3 text-[#A1A1AA]' 
                    : 'bg-white/10 border border-white/20 mr-3 text-white'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-[#A1A1AA]" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                    ${message.role === 'user'
                      ? 'bg-white text-[#0A0A0B] font-medium rounded-tr-sm shadow-md'
                      : 'bg-[#171719] text-[#F5F5F5] border border-[#2A2A2D] rounded-tl-sm shadow-md'
                    }`}
                  >
                    {message.content}
                  </div>
                  
                  {/* Metadata (Time & Confidence) */}
                  <div className="flex items-center mt-2 space-x-2 text-xs text-[#71717A] px-1">
                    <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    
                    {message.confidence && (
                      <>
                        <span>•</span>
                        <div className="flex items-center group relative cursor-help">
                          <AlertCircle className={`w-3.5 h-3.5 mr-1 
                            ${message.confidence === 'HIGH' ? 'text-[#4ADE80]' 
                            : message.confidence === 'MEDIUM' ? 'text-[#FBBF24]' 
                            : 'text-[#F87171]'}`} 
                          />
                          <span className={
                            message.confidence === 'HIGH' ? 'text-[#4ADE80]' 
                            : message.confidence === 'MEDIUM' ? 'text-[#FBBF24]' 
                            : 'text-[#F87171]'
                          }>
                            {message.confidence} Confidence
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex flex-row max-w-[80%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 bg-white/10 border border-white/20 mr-3">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="px-5 py-4 rounded-2xl rounded-tl-sm bg-[#171719] border border-[#2A2A2D] flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                  <span className="text-sm text-[#A1A1AA]">Analyzing metrics...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#171719] border-t border-[#2A2A2D]">
        <form onSubmit={handleSubmit} className="relative flex items-end max-w-4xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Ask about your revenue, expenses, or forecasts..."
            className="w-full bg-[#0A0A0B] border border-[#2A2A2D] text-[#F5F5F5] placeholder-[#71717A] text-sm rounded-xl py-4 pl-4 pr-14 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all resize-none custom-scrollbar"
            rows={1}
            style={{ minHeight: '56px', maxHeight: '160px' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2.5 bottom-2.5 p-2 rounded-lg bg-white text-[#0A0A0B] hover:bg-[#A3A3A3] focus:outline-none disabled:opacity-40 transition-colors shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="text-center mt-3">
          <p className="text-[11px] text-[#71717A]">Pulse AI can make mistakes. Always verify important business decisions.</p>
        </div>
      </div>
    </div>
  );
}
