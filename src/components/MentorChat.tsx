import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  RefreshCw, 
  Trash2,
  CornerDownLeft,
  GraduationCap
} from 'lucide-react';
import { ChatMessage, StackType } from '../types';

interface MentorChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isGenerating: boolean;
  onClearChat: () => void;
  stack: StackType;
}

export const MentorChat: React.FC<MentorChatProps> = ({
  messages,
  onSendMessage,
  isGenerating,
  onClearChat,
  stack
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-[#0F172A] rounded-xl border border-slate-800 overflow-hidden shadow-xl">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0F172A] border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center font-bold text-white text-[11px] shadow-[0_0_10px_rgba(37,99,235,0.3)]">
            BQ
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
              <span>Bano Qabil Mentor Chat</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </h3>
            <p className="text-[10px] text-slate-400">Ask any follow-up, concept explanation, or code advice</p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={onClearChat}
            className="p-1.5 rounded bg-[#1E293B] hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition text-xs border border-slate-700/60"
            title="Clear chat history"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0B0E14]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-blue-900/30 mb-3">
              AI
            </div>
            <h4 className="text-xs font-semibold text-slate-200 mb-1">
              Have a question about your code or the fix?
            </h4>
            <p className="text-[11px] text-slate-400 max-w-xs mb-4">
              Your senior engineering mentor is ready. Ask anything about {stack}, system architecture, test strategies, or syntax nuances.
            </p>
            <div className="flex flex-col gap-2 w-full max-w-xs text-left">
              {[
                `Why did the bug happen in this ${stack} code?`,
                "How do I prevent this error in production?",
                "Can you show a minimal test case for this?",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => onSendMessage(suggestion)}
                  className="text-[11px] text-slate-300 hover:text-blue-300 p-2.5 rounded-lg bg-[#1E293B] hover:bg-slate-700 border border-slate-700/80 transition"
                >
                  "{suggestion}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start space-x-3 max-w-3xl ${
                m.role === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : ''
              }`}
            >
              {m.role === 'assistant' ? (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-[11px] font-bold text-white shadow-lg shadow-blue-900/30">
                  AI
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-800 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-slate-300 border border-slate-700">
                  USER
                </div>
              )}

              <div
                className={`text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-slate-800/60 rounded-2xl rounded-tr-none p-3.5 text-slate-200 border border-slate-700 max-w-[85%]'
                    : 'bg-blue-950/20 border border-blue-500/20 rounded-2xl rounded-tl-none p-4 text-slate-300 max-w-[90%] shadow-sm'
                }`}
              >
                {m.role === 'assistant' ? (
                  <div className="markdown-body">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0 text-xs leading-5 text-slate-300">{children}</p>,
                        code: ({ className, children, ...props }: any) => {
                          const match = /language-(\w+)/.exec(className || '');
                          const isInline = !match && !String(children).includes('\n');
                          if (isInline) {
                            return (
                              <code className="px-1.5 py-0.5 bg-[#011627] rounded font-mono text-[10px] text-blue-300 border border-slate-800" {...props}>
                                {children}
                              </code>
                            );
                          }
                          return (
                            <pre className="my-2.5 p-3 bg-[#011627] rounded-lg font-mono text-[11px] overflow-x-auto text-slate-200 border border-slate-800">
                              <code>{children}</code>
                            </pre>
                          );
                        }
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                )}
                <span className="block text-[9px] text-slate-500 text-right mt-1.5 font-mono">
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))
        )}

        {isGenerating && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-[11px] font-bold text-white shadow-lg shadow-blue-900/30">
              AI
            </div>
            <div className="bg-blue-950/20 border border-blue-500/20 rounded-2xl rounded-tl-none p-3.5 text-xs text-blue-300 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
              <span>Bano Qabil Mentor is formulating explanation...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSubmit} className="p-3 bg-[#0F172A] border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask Bano Qabil AI anything about ${stack} or this fix...`}
          disabled={isGenerating}
          className="flex-1 bg-[#1E293B] border border-slate-700 focus:border-blue-500 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none placeholder:text-slate-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || isGenerating}
          className="h-9 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-[0_0_12px_rgba(37,99,235,0.3)]"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ask</span>
        </button>
      </form>
    </div>
  );
};
