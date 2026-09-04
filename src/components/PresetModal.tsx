import React, { useState } from 'react';
import { X, BookOpen, ArrowRight, CheckCircle2, Bug, Code, Sparkles, Filter } from 'lucide-react';
import { PresetBug, StackType } from '../types';
import { STUDENT_BUG_PRESETS } from '../data/presets';

interface PresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: PresetBug) => void;
}

export const PresetModal: React.FC<PresetModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset
}) => {
  const [selectedStackFilter, setSelectedStackFilter] = useState<string>('all');

  if (!isOpen) return null;

  const filteredPresets = selectedStackFilter === 'all'
    ? STUDENT_BUG_PRESETS
    : STUDENT_BUG_PRESETS.filter(p => p.stack === selectedStackFilter);

  const stacks = ['all', 'React', 'Next.js', 'Node.js', 'TypeScript', 'Python', 'Full-Stack'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Student Bug Laboratories & Real-World Scenarios</span>
              </h2>
              <p className="text-xs text-slate-400">
                Practice debugging common pitfalls encountered by student software engineers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-6 py-3 border-b border-slate-800/80 bg-slate-950/40 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
          {stacks.map(stack => (
            <button
              key={stack}
              onClick={() => setSelectedStackFilter(stack)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition shrink-0 ${
                selectedStackFilter === stack
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-700/50'
              }`}
            >
              {stack === 'all' ? 'All Stacks' : stack}
            </button>
          ))}
        </div>

        {/* Presets List */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1">
          {filteredPresets.map((preset) => (
            <div
              key={preset.id}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/50 transition-all group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                    {preset.stack}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-medium rounded ${
                    preset.difficulty === 'Beginner'
                      ? 'bg-blue-950 text-blue-400 border border-blue-800/50'
                      : 'bg-amber-950 text-amber-400 border border-amber-800/50'
                  }`}>
                    {preset.difficulty}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {preset.fileName}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-100 group-hover:text-emerald-300 transition">
                  {preset.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {preset.description}
                </p>
                <div className="text-[11px] text-slate-500 italic">
                  Student question: "{preset.studentQuestion}"
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectPreset(preset);
                  onClose();
                }}
                className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-800 group-hover:bg-emerald-600 text-slate-200 group-hover:text-white text-xs font-semibold transition"
              >
                <span>Load Bug</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
