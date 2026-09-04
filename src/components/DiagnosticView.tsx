import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  FileCheck, 
  Bug, 
  Lightbulb, 
  ShieldCheck, 
  Download,
  Share2,
  RefreshCw
} from 'lucide-react';

interface DiagnosticViewProps {
  content: string;
  isLoading: boolean;
  onApplyCodeToEditor: (codeSnippet: string) => void;
  onAskFollowUp: (prompt: string) => void;
  fileName: string;
}

export const DiagnosticView: React.FC<DiagnosticViewProps> = ({
  content,
  isLoading,
  onApplyCodeToEditor,
  onAskFollowUp,
  fileName
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Extract the main corrected code block if present
  const extractedCode = React.useMemo(() => {
    if (!content) return '';
    const codeBlockMatch = content.match(/```(?:tsx|typescript|jsx|javascript|python|js|ts)?\n([\s\S]*?)```/);
    return codeBlockMatch ? codeBlockMatch[1].trim() : '';
  }, [content]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BanoQabil-AI-Debug-Report-${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported by your browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      // Clean markdown tags for natural spoken mentor voice
      const cleanText = content
        .replace(/```[\s\S]*?```/g, 'Code block omitted.')
        .replace(/[#*`_>-]/g, ' ')
        .slice(0, 1500); // Read the primary diagnosis
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-[#0F172A] rounded-xl border border-slate-800 text-center">
        <div className="relative mb-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center animate-pulse">
            <Sparkles className="w-8 h-8 text-blue-400 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
          </span>
        </div>
        <h3 className="text-base font-semibold text-white mb-1">
          Bano Qabil AI is Analyzing Your Code...
        </h3>
        <p className="text-xs text-slate-400 max-w-md mb-4 leading-relaxed">
          Evaluating runtime execution path, checking compiler diagnostics, identifying root cause, and preparing production-grade fix.
        </p>
        <div className="flex items-center gap-2 text-xs text-blue-400 font-mono bg-blue-950/40 px-3 py-1.5 rounded-full border border-blue-500/30">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>Tracing full-stack call stack & dependencies</span>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-[#0F172A]/50 rounded-xl border border-dashed border-slate-800 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#1E293B] border border-slate-700 flex items-center justify-center mb-4 text-blue-400 shadow-inner">
          <Bug className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-white mb-1.5">
          Ready for Real-Time Debugging & Mentorship
        </h3>
        <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
          Provide your code snippet, paste any error logs or terminal traceback, and ask your question. Bano Qabil AI will pinpoint the exact root cause, explain the concepts, and write verified production code.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-md w-full text-left">
          <div className="p-3.5 rounded-lg bg-[#0F172A] border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Step-by-Step Root Cause</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Clear breakdown of why the error was raised at compile or runtime.
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-[#0F172A] border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Production-Ready Code</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Type-safe, modern implementations with best practices built-in.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0F172A] rounded-xl border border-slate-800 overflow-hidden shadow-xl">
      {/* Mentor Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-[#0F172A] border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <h2 className="text-xs font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Bano Qabil Mentor Diagnostic</span>
          </h2>
          <span className="text-[11px] px-2 py-0.5 rounded bg-blue-600/10 text-blue-400 border border-blue-500/30 font-mono">
            Target: {fileName}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {extractedCode && (
            <button
              onClick={() => onApplyCodeToEditor(extractedCode)}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition shadow-[0_0_12px_rgba(37,99,235,0.3)]"
              title="Replace source code in editor with Bano Qabil AI's corrected snippet"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Apply Fix to Editor</span>
              <span className="sm:hidden">Apply</span>
            </button>
          )}

          <button
            onClick={toggleSpeech}
            className={`p-1.5 rounded text-xs transition border ${
              isSpeaking
                ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                : 'bg-[#1E293B] text-slate-300 hover:text-white border-slate-700/80 hover:bg-slate-700'
            }`}
            title={isSpeaking ? 'Stop voice readout' : 'Listen to mentor explanation'}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-slate-300" />}
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded bg-[#1E293B] hover:bg-slate-700 text-slate-300 border border-slate-700/80 transition"
            title="Copy full markdown report"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="p-1.5 rounded bg-[#1E293B] hover:bg-slate-700 text-slate-300 border border-slate-700/80 transition"
            title="Download report (.md)"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Diagnostic Markdown Body */}
      <div className="flex-1 overflow-y-auto p-5 text-slate-300 text-xs leading-relaxed space-y-4 font-sans bg-[#0B0E14]">
        <div className="markdown-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-base font-semibold text-white border-b border-slate-800 pb-2 mb-3 mt-1 flex items-center gap-2">
                  <span className="text-blue-500">#</span> {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-sm font-semibold text-blue-400 mt-4 mb-2 flex items-center gap-2 border-l-2 border-blue-500 pl-2.5">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xs font-semibold text-slate-200 mt-3 mb-1.5">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="mb-2.5 text-slate-300 leading-6 text-xs">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-5 mb-3 space-y-1 text-slate-300 text-xs">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-5 mb-3 space-y-1 text-slate-300 text-xs">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="leading-5">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="text-white font-semibold">{children}</strong>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-blue-500 bg-blue-950/20 px-3.5 py-2.5 rounded-r-md text-blue-200 my-3 text-xs italic">
                  {children}
                </blockquote>
              ),
              code: ({ className, children, ...props }: any) => {
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !match && !String(children).includes('\n');
                
                if (isInline) {
                  return (
                    <code className="px-1.5 py-0.5 rounded bg-[#1E293B] font-mono text-[11px] text-blue-300 border border-slate-700" {...props}>
                      {children}
                    </code>
                  );
                }

                return (
                  <div className="my-3 rounded-lg overflow-hidden border border-slate-800 bg-[#011627] font-mono text-xs shadow-md">
                    <div className="flex items-center justify-between px-3.5 py-2 bg-[#0F172A] border-b border-slate-800 text-[11px] text-slate-400">
                      <span className="text-blue-400 font-semibold uppercase text-[10px]">{match ? match[1] : 'code'}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 text-[10px] font-semibold">FIXED</span>
                        <span className="text-slate-600">•</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(String(children))}
                          className="hover:text-white transition text-slate-400"
                        >
                          Copy Snippet
                        </button>
                      </div>
                    </div>
                    <pre className="p-3.5 overflow-x-auto text-slate-200 leading-5">
                      <code>{children}</code>
                    </pre>
                  </div>
                );
              }
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* Quick Follow-Up Question Suggestions */}
        <div className="pt-4 border-t border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <Lightbulb className="w-3 h-3 text-blue-400" />
            <span>Continue Mentorship - Suggested Follow-ups:</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "Can you show how to write unit tests for this fix?",
              "What is the time and space complexity of this solution?",
              "How would I write this in Next.js Server Actions?",
              "Explain line-by-line what happens under the hood"
            ].map((q) => (
              <button
                key={q}
                onClick={() => onAskFollowUp(q)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-[#1E293B] hover:bg-slate-700 text-slate-300 hover:text-blue-300 border border-slate-700/80 transition flex items-center gap-1"
              >
                <span>{q}</span>
                <ArrowRight className="w-2.5 h-2.5 text-slate-500" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
