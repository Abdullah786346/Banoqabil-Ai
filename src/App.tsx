import React, { useState, useEffect } from 'react';
import { 
  Bug, 
  Wand2, 
  Lightbulb, 
  Play, 
  Terminal, 
  CheckCircle2, 
  Sparkles, 
  MessageSquareCode, 
  FlaskConical, 
  BookOpen, 
  Zap, 
  ChevronRight,
  RotateCcw,
  GraduationCap,
  Cpu,
  Layers,
  HelpCircle,
  Code2
} from 'lucide-react';
import { Header } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { TerminalInput } from './components/TerminalInput';
import { DiagnosticView } from './components/DiagnosticView';
import { MentorChat } from './components/MentorChat';
import { SandboxRunner } from './components/SandboxRunner';
import { PresetModal } from './components/PresetModal';
import { StackType, AnalysisMode, ChatMessage, PresetBug } from './types';
import { STUDENT_BUG_PRESETS } from './data/presets';

export default function App() {
  // Primary Workspace State
  const [stack, setStack] = useState<StackType>('React');
  const [fileName, setFileName] = useState<string>('StudentComponent.tsx');
  const [code, setCode] = useState<string>(STUDENT_BUG_PRESETS[0].code);
  const [errorLog, setErrorLog] = useState<string>(STUDENT_BUG_PRESETS[0].errorLog);
  const [question, setQuestion] = useState<string>(STUDENT_BUG_PRESETS[0].studentQuestion);
  const [mode, setMode] = useState<AnalysisMode>('debug');

  // Diagnostic Output State
  const [diagnosticResult, setDiagnosticResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatGenerating, setIsChatGenerating] = useState<boolean>(false);
  const [activeRightTab, setActiveRightTab] = useState<'diagnostic' | 'chat'>('diagnostic');

  // Modals & Panels
  const [isSandboxOpen, setIsSandboxOpen] = useState<boolean>(false);
  const [isPresetModalOpen, setIsPresetModalOpen] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);

  // Show temporary toast notification
  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Check health on load
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setHasApiKey(Boolean(data.hasApiKey));
      })
      .catch(() => {
        // Silently catch in dev
      });
  }, []);

  // Keyboard shortcut: Cmd/Ctrl + Enter to trigger analysis
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunAnalysis(mode);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, errorLog, question, stack, mode]);

  // Main Analysis Handler
  const handleRunAnalysis = async (selectedMode: AnalysisMode = mode) => {
    if (!code.trim() && !errorLog.trim() && !question.trim()) {
      showToast('Please provide code, an error log, or a question first.');
      return;
    }

    setIsLoading(true);
    setActiveRightTab('diagnostic');
    setMode(selectedMode);

    try {
      const response = await fetch('/api/ai/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          errorLog,
          stack,
          question,
          mode: selectedMode,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Diagnostic failed');
      }

      setDiagnosticResult(data.result);
      showToast('Diagnostic completed by Bano Qabil AI!');

      // Automatically seed an introductory greeting in chat
      if (messages.length === 0) {
        setMessages([
          {
            id: 'init-msg',
            role: 'assistant',
            content: `Salam! I've analyzed your ${stack} code and identified the root cause. Review the detailed breakdown on the left, and feel free to ask any follow-up questions here!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err: any) {
      console.error(err);
      setDiagnosticResult(`### ⚠️ Mentor Diagnostic Error\n\nCould not analyze the code: ${err.message}\n\nPlease verify your input and try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Follow-up Chat Handler
  const handleSendChatMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsChatGenerating(true);
    setActiveRightTab('chat');

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          context: {
            stack,
            code,
            errorLog,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Chat request failed');
      }

      const botMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `I encountered an issue generating a response: ${err.message}. Please try asking again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsChatGenerating(false);
    }
  };

  // Apply Corrected Code to the Editor
  const handleApplyCodeToEditor = (newCode: string) => {
    setCode(newCode);
    showToast('Applied Bano Qabil AI corrected code to Editor!');
  };

  // Preset Selection
  const handleSelectPreset = (preset: PresetBug) => {
    setStack(preset.stack);
    setFileName(preset.fileName);
    setCode(preset.code);
    setErrorLog(preset.errorLog);
    setQuestion(preset.studentQuestion);
    setDiagnosticResult('');
    showToast(`Loaded ${preset.title}`);
  };

  // Quick Reset
  const handleResetWorkspace = () => {
    if (confirm('Reset workspace to blank state?')) {
      setCode('');
      setErrorLog('');
      setQuestion('');
      setDiagnosticResult('');
      setMessages([]);
      showToast('Workspace reset.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-300 flex flex-col font-sans selection:bg-blue-600/30 selection:text-blue-200">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-[#0F172A] border border-blue-500/40 text-blue-300 text-xs font-semibold shadow-[0_0_25px_rgba(0,0,0,0.8)] flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Global Application Header */}
      <Header
        currentStack={stack}
        onSelectStack={(newStack) => {
          setStack(newStack);
          if (newStack === 'Python') setFileName('main.py');
          else if (newStack === 'Node.js') setFileName('server.js');
          else setFileName('StudentComponent.tsx');
        }}
        onOpenPresets={() => setIsPresetModalOpen(true)}
        onToggleSandbox={() => setIsSandboxOpen(!isSandboxOpen)}
        isSandboxOpen={isSandboxOpen}
        hasApiKey={hasApiKey}
      />

      {/* Sub-Header / Student Mentor Welcome Banner */}
      <div className="border-b border-slate-800 bg-[#0F172A]/50 px-4 lg:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-600/10 text-blue-400 font-semibold border border-blue-500/30 text-[11px]">
              Active Session
            </span>
            <p className="text-slate-300 font-medium">
              Real-time engineering mentorship for web & full-stack student developers.
            </p>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-300">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Full-Stack Diagnostic Active</span>
            </span>
            <span>•</span>
            <span className="hidden md:inline">Ctrl+Enter to Analyze</span>
            <span>•</span>
            <button
              onClick={handleResetWorkspace}
              className="text-slate-400 hover:text-rose-400 transition flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 flex flex-col gap-5">
        
        {/* Interactive In-Browser JS/TS Sandbox Drawer */}
        {isSandboxOpen && (
          <SandboxRunner onClose={() => setIsSandboxOpen(false)} />
        )}

        {/* Dual-Pane Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-stretch">
          
          {/* LEFT PANE: Student Code & Error Studio (lg:col-span-6 or 7) */}
          <section className="lg:col-span-6 xl:col-span-6 flex flex-col gap-3.5">
            
            {/* Student's Specific Question or Goal */}
            <div className="bg-[#0F172A] rounded-xl border border-slate-800 p-3.5 shadow-sm">
              <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                <span>Student Question or Debugging Goal:</span>
              </label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. Why does my useEffect re-render infinitely? How do I make this type-safe?"
                className="w-full bg-[#1E293B] text-xs text-slate-200 px-3.5 py-2.5 rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none placeholder:text-slate-500 transition-colors"
              />
            </div>

            {/* Code Editor */}
            <div className="flex-1 min-h-[340px]">
              <CodeEditor
                code={code}
                onChange={setCode}
                fileName={fileName}
                onChangeFileName={setFileName}
                stack={stack}
              />
            </div>

            {/* Terminal Error Log / Traceback Input */}
            <div>
              <TerminalInput
                errorLog={errorLog}
                onChange={setErrorLog}
                stack={stack}
              />
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => handleRunAnalysis('debug')}
                disabled={isLoading}
                className="flex-1 min-w-[140px] py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold transition shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2"
              >
                <Bug className="w-4 h-4 text-white" />
                <span>{isLoading && mode === 'debug' ? 'Analyzing...' : 'Debug Root Cause'}</span>
              </button>

              <button
                onClick={() => handleRunAnalysis('refactor')}
                disabled={isLoading}
                className="py-2.5 px-3.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 disabled:opacity-50 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700/80 transition flex items-center gap-1.5"
                title="Refactor for clean code, type safety, and optimal performance"
              >
                <Wand2 className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Refactor</span>
              </button>

              <button
                onClick={() => handleRunAnalysis('explain')}
                disabled={isLoading}
                className="py-2.5 px-3.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 disabled:opacity-50 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700/80 transition flex items-center gap-1.5"
                title="Explain architecture and mental model"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Explain</span>
              </button>
            </div>
          </section>

          {/* RIGHT PANE: Mentor Analysis & Interactive Chat Workspace (lg:col-span-6) */}
          <section className="lg:col-span-6 xl:col-span-6 flex flex-col min-h-[550px]">
            {/* View Switcher Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveRightTab('diagnostic')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                    activeRightTab === 'diagnostic'
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Mentor Diagnostic</span>
                  {diagnosticResult && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                </button>

                <button
                  onClick={() => setActiveRightTab('chat')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                    activeRightTab === 'chat'
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]'
                  }`}
                >
                  <MessageSquareCode className="w-3.5 h-3.5 text-blue-400" />
                  <span>Mentor Q&A Chat</span>
                  {messages.length > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] rounded bg-[#1E293B] text-slate-300 border border-slate-700">
                      {messages.length}
                    </span>
                  )}
                </button>
              </div>

              <div className="text-[11px] text-slate-400 hidden sm:block">
                Mode: <span className="font-semibold text-slate-300 uppercase">{mode}</span>
              </div>
            </div>

            {/* Active Right Tab Content */}
            <div className="flex-1 flex flex-col">
              {activeRightTab === 'diagnostic' ? (
                <DiagnosticView
                  content={diagnosticResult}
                  isLoading={isLoading}
                  onApplyCodeToEditor={handleApplyCodeToEditor}
                  onAskFollowUp={(prompt) => {
                    handleSendChatMessage(prompt);
                  }}
                  fileName={fileName}
                />
              ) : (
                <MentorChat
                  messages={messages}
                  onSendMessage={handleSendChatMessage}
                  isGenerating={isChatGenerating}
                  onClearChat={() => setMessages([])}
                  stack={stack}
                />
              )}
            </div>
          </section>

        </div>
      </main>

      {/* Student Bug Scenario Preset Modal */}
      <PresetModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#0F172A] py-3.5 px-4 text-center text-xs text-slate-400">
        <p>
          Bano Qabil AI • Dedicated to empowering student developers across Pakistan and worldwide with real-time software engineering mentorship.
        </p>
      </footer>
    </div>
  );
}
