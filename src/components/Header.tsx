import React from 'react';
import { 
  Terminal, 
  Sparkles, 
  Cpu, 
  Code2, 
  BookOpen, 
  CheckCircle2, 
  ExternalLink,
  Zap,
  FlaskConical
} from 'lucide-react';
import { StackType } from '../types';

interface HeaderProps {
  currentStack: StackType;
  onSelectStack: (stack: StackType) => void;
  onOpenPresets: () => void;
  onToggleSandbox: () => void;
  isSandboxOpen: boolean;
  hasApiKey: boolean;
}

const STACKS: StackType[] = [
  'React',
  'Next.js',
  'Node.js',
  'TypeScript',
  'Python',
  'Full-Stack'
];

export const Header: React.FC<HeaderProps> = ({
  currentStack,
  onSelectStack,
  onOpenPresets,
  onToggleSandbox,
  isSandboxOpen,
  hasApiKey
}) => {
  return (
    <header className="border-b border-slate-800 bg-[#0F172A] sticky top-0 z-40 px-4 lg:px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] text-xs tracking-wider">
              BQ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold tracking-tight text-white flex items-center gap-1.5">
                  Bano Qabil <span className="text-blue-500">AI</span>
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-blue-600/10 text-blue-400 border border-blue-500/30 rounded">
                  Mentor v3.8
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Software Engineering Mentor & Real-Time Debugging Assistant
              </p>
            </div>
          </div>

          {/* Quick status pill on mobile */}
          <div className="md:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Mentor
          </div>
        </div>

        {/* Stack Selection Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs text-slate-400 font-medium mr-1 shrink-0 hidden lg:inline">
            Active Stack:
          </span>
          {STACKS.map(stack => {
            const isActive = currentStack === stack;
            return (
              <button
                key={stack}
                onClick={() => onSelectStack(stack)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/40 shadow-[0_0_12px_rgba(37,99,235,0.15)] font-semibold'
                    : 'bg-[#1E293B]/60 text-slate-400 hover:text-slate-200 hover:bg-[#1E293B] border border-slate-800'
                }`}
              >
                {stack === 'React' && <span className="text-[#61dafb]">⚛</span>}
                {stack === 'Next.js' && <span className="text-white font-mono text-[11px]">▲</span>}
                {stack === 'Node.js' && <span className="text-[#68a063]">⬢</span>}
                {stack === 'TypeScript' && <span className="text-[#3178c6] font-bold text-[11px]">TS</span>}
                {stack === 'Python' && <span className="text-[#ffde57]">🐍</span>}
                {stack === 'Full-Stack' && <Cpu className="w-3 h-3 text-blue-400" />}
                {stack}
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            onClick={onOpenPresets}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1E293B] hover:bg-slate-700/80 text-slate-200 border border-slate-700/80 transition"
            title="Load authentic student bug scenarios"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Student Bug Labs</span>
          </button>

          <button
            onClick={onToggleSandbox}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              isSandboxOpen
                ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                : 'bg-[#1E293B] hover:bg-slate-700/80 text-slate-200 border-slate-700/80'
            }`}
            title="Open interactive JS/TS test console"
          >
            <FlaskConical className="w-3.5 h-3.5 text-blue-400" />
            <span>{isSandboxOpen ? 'Hide Sandbox' : 'Live Sandbox'}</span>
          </button>

          <div className="hidden md:flex items-center space-x-2 text-xs font-medium bg-[#0B0E14] border border-slate-800 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400">Next.js / Node.js Environment</span>
          </div>
        </div>

      </div>
    </header>
  );
};
