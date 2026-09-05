import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  User,
  Send,
  Sparkles,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  Lightbulb,
  CornerDownLeft
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext.jsx';
import { apiClient } from '../api/client.js';

const SUGGESTED_PROMPTS = [
  'Where am I spending the most?',
  'Find unusual expenses',
  'How can I reduce expenses?',
  'Give me a financial summary',
  'What is my financial health score?',
  'How is my cash flow?',
  'How much did I spend on marketing?'
];

export const ControllerChatPage = () => {
  const { dashboardData } = useFinance();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `### 👋 Greetings! I am your AI Finance Controller.
I am connected directly to your transaction database and financial intelligence engine.

Ask me anything about your cash flow, category breakdowns, anomalies, or cost-saving opportunities.

**Try asking:**
- *"Where am I spending the most?"*
- *"Which expenses should I reduce?"*
- *"What are my unusual transactions?"*`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const newMessages = [...messages, { role: 'user', content: text, timestamp: new Date() }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await apiClient.sendChatMessage(newMessages);
      if (res.success && res.data) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: res.data.content,
          timestamp: new Date()
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ **Controller Notice:** ${err.message || 'Unable to process query. Please ensure backend server is active.'}`,
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Chat history cleared. How can I assist you with your business accounts today?`,
        timestamp: new Date()
      }
    ]);
  };

  // Basic Markdown Renderer for bold, bullets, headers
  const renderFormattedContent = (content) => {
    return content.split('\n').map((line, lIdx) => {
      // Header 3
      if (line.startsWith('### ')) {
        return <h4 key={lIdx} className="text-sm font-bold text-emerald-400 font-display mt-2 mb-1">{line.replace('### ', '')}</h4>;
      }
      // Header 2
      if (line.startsWith('## ')) {
        return <h3 key={lIdx} className="text-base font-bold text-white font-display mt-3 mb-1.5">{line.replace('## ', '')}</h3>;
      }
      // Bullet points
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const text = line.substring(2);
        return (
          <li key={lIdx} className="ml-4 list-disc text-slate-300 my-0.5 leading-relaxed">
            {formatBold(text)}
          </li>
        );
      }
      // Numbered items
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={lIdx} className="text-slate-300 my-1 leading-relaxed">
            {formatBold(line)}
          </div>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={lIdx} className="h-2" />;
      }
      return (
        <p key={lIdx} className="text-slate-300 leading-relaxed my-0.5">
          {formatBold(line)}
        </p>
      );
    });
  };

  const formatBold = (str) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={pIdx} className="font-bold text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={pIdx} className="text-emerald-300">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col rounded-2xl bg-[#0F172A]/90 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="relative p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Bot className="w-5 h-5" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0F172A]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-display flex items-center gap-2">
              Ask Your AI Finance Controller
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Grounded Mode
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Live queries powered by real transactions • Zero hallucinated figures
            </p>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          title="Clear chat history"
        >
          <Trash2 className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Suggested Prompts Pills */}
      <div className="px-4 py-2.5 bg-slate-900/40 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 shrink-0">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Suggested:
        </span>
        {SUGGESTED_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="px-3 py-1 rounded-full text-[11px] font-medium bg-slate-800 hover:bg-emerald-500/20 hover:border-emerald-500/40 border border-slate-700 text-slate-300 hover:text-emerald-300 transition-all shrink-0 active:scale-95 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages List Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`relative max-w-2xl rounded-2xl p-4 text-xs shadow-lg ${
                msg.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none font-medium'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              {msg.role === 'assistant' ? (
                renderFormattedContent(msg.content)
              ) : (
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              )}

              {msg.role === 'assistant' && (
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                  <span>AI Finance Controller • Grounded Data Response</span>
                  <button
                    onClick={() => handleCopy(msg.content, idx)}
                    className="flex items-center gap-1 text-slate-400 hover:text-slate-200"
                  >
                    {copiedIdx === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="p-2 rounded-xl bg-slate-800 text-slate-300 shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span>Analyzing journal entries & synthesizing grounded response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-4 border-t border-slate-800 bg-slate-900/80"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Ask anything (e.g. 'Where am I spending the most?', 'What are my unusual transactions?')..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="w-full pl-4 pr-12 py-3 rounded-xl bg-[#080C14] border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 p-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-40"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ControllerChatPage;
