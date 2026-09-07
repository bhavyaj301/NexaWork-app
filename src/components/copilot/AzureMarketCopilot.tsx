import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  RotateCcw,
  Download,
  Copy,
  Check,
  Zap,
  Sliders
} from 'lucide-react';
import { azureService } from '../../services/azureService';
import { downloadMarkdownReport } from '../../utils/exportUtils';

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const promptStarters = [
  'What are the highest paying Azure GenAI architect roles in 2026?',
  'How do I transition from AWS Solutions Architect to Azure AI-102?',
  'Compare Microsoft Fabric vs Dataproc & Snowflake compensation',
  'What questions should I prepare for an Azure Kubernetes (AKS) Lead interview?'
];

export const AzureMarketCopilot: React.FC = () => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: 'Hello! I am your Azure Market Copilot. I analyze 2.48M+ active cloud postings, compensation benchmarks, and Microsoft certification paths in real-time. How can I help you elevate your cloud career today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    } catch (e) {
      const errorMsg: CopilotMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: 'An error occurred connecting to Azure OpenAI. Please check your credentials or retry.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportTranscript = () => {
    const transcript = messages
      .map(m => `### ${m.sender === 'user' ? '👤 User' : '🤖 Azure Copilot'} (${m.timestamp})\n\n${m.text}\n`)
      .join('\n---\n\n');
    downloadMarkdownReport('azure-copilot-transcript.md', `# Azure Market Copilot Transcript\n\n${transcript}`);
  };

  return (
    <div className="w-full space-y-8 animate-fade-in flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-color)] text-center sm:text-left">
        <div className="space-y-2">
          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight mb-1">
              Azure Market Copilot AI
            </h2>
            <span className="azure-badge">GPT-4o Intelligence</span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Conversational assistant grounded in live telemetry, salary benchmarks, and interview negotiation frameworks.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setMessages([messages[0]])}
            className="azure-btn-secondary text-xs flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear Chat</span>
          </button>
          <button
            onClick={handleExportTranscript}
            className="azure-btn-primary text-xs flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export Transcript</span>
          </button>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="w-full saas-card p-6 sm:p-8 rounded-3xl flex flex-col h-[650px] justify-between space-y-4">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm relative group ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                      : 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>

                  <div
                    className={`flex items-center justify-between gap-4 mt-2 text-[10px] ${
                      isUser ? 'text-blue-200' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    <span>{msg.timestamp}</span>

                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="hover:text-white transition flex items-center gap-1"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-9 h-9 rounded-xl bg-slate-700 flex items-center justify-center text-white shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-4 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] rounded-bl-none flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse delay-75" />
                <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse delay-150" />
                <span className="text-xs text-[var(--text-muted)] font-mono ml-1">Analyzing Azure telemetry...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Starters */}
        <div className="pt-2 border-t border-[var(--border-color)]">
          <span className="text-[11px] font-bold text-[var(--text-muted)] block mb-2 text-center sm:text-left">
            Suggested Intelligence Prompts:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 justify-center sm:justify-start">
            {promptStarters.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="px-3 py-1.5 rounded-xl bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] whitespace-nowrap transition"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            placeholder="Ask about Azure job trends, compensation benchmarks, interview prep..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] rounded-2xl px-5 py-3.5 text-xs sm:text-sm text-[var(--text-primary)] placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-inner leading-relaxed"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || loading}
            className="azure-btn-primary p-3.5 rounded-2xl shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
