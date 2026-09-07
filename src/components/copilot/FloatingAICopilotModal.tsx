import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  RotateCcw,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { azureService } from '../../services/azureService';

export interface FloatingAICopilotProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const promptStarters = [
  'What are the highest paying GenAI architect roles in 2026?',
  'How do I transition to Senior Cloud AI Architect?',
  'Compare Microsoft Fabric vs Dataproc & Snowflake compensation',
  'What questions should I prepare for a Kubernetes Lead interview?'
];

export const FloatingAICopilotModal: React.FC<FloatingAICopilotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: 'Hello! I am your AI Market Copilot. I analyze 2.48M+ active cloud postings, compensation benchmarks, and certification career paths in real-time. What would you like to explore today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || loading) return;

    const userMsg: CopilotMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const responseText = await azureService.queryAzureCopilot(query);
      const botMsg: CopilotMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      const errorMsg: CopilotMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: 'An error occurred connecting to AI Services. Please retry your question.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-5 sm:right-7 z-50 animate-slide-down">
      <div
        className={`rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl transition-all duration-300 ${
          isExpanded
            ? 'w-[92vw] sm:w-[560px] h-[640px]'
            : 'w-[92vw] sm:w-[420px] h-[520px]'
        }`}
        style={{
          boxShadow: '0 25px 60px -12px rgba(0, 120, 212, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.08)'
        }}
      >
        {/* Header */}
        <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-surface-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-[var(--text-primary)]">AI Market Copilot</span>
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Online
                </span>
              </div>
              <span className="text-[10px] text-[var(--text-muted)]">Labor & Compensation Advisor</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setMessages([messages[0]])}
              className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] rounded-lg transition"
              title="Reset Chat"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] rounded-lg transition"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          {messages.map((m) => {
            const isBot = m.sender === 'assistant';
            return (
              <div
                key={m.id}
                className={`flex gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-6 h-6 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 mt-0.5 border border-sky-500/20">
                    <Sparkles className="w-3 h-3" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[82%] leading-relaxed ${
                    isBot
                      ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] border border-[var(--border-color)]'
                      : 'bg-blue-600 text-white shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  <span
                    className={`text-[9px] mt-1 block font-mono ${
                      isBot ? 'text-[var(--text-muted)]' : 'text-blue-200'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
                {!isBot && (
                  <div className="w-6 h-6 rounded-lg bg-blue-600/30 text-white flex items-center justify-center shrink-0 mt-0.5 border border-blue-400/30">
                    <User className="w-3 h-3" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-2.5 items-center text-xs text-[var(--text-muted)] animate-pulse pl-1">
              <Bot className="w-4 h-4 text-sky-400" />
              <span>AI is analyzing labor dataset...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Starters */}
        <div className="px-3 py-2 border-t border-[var(--border-color)] bg-[var(--bg-surface-subtle)] overflow-x-auto flex gap-1.5 no-scrollbar">
          {promptStarters.map((starter, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(starter)}
              disabled={loading}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-sky-400 transition"
            >
              {starter}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 border-t border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask AI about compensation, skills, trends..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
            className="flex-1 bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] text-[var(--text-primary)] px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:border-sky-400 transition"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition shadow-md shadow-blue-500/30"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
