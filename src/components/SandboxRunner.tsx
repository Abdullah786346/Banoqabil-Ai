import React, { useState } from 'react';
import { Play, RotateCcw, CheckCircle, AlertCircle, Terminal, Sparkles, X } from 'lucide-react';

interface SandboxRunnerProps {
  initialCode?: string;
  onClose?: () => void;
}

export const SandboxRunner: React.FC<SandboxRunnerProps> = ({
  initialCode = `// Bano Qabil Live JS/TS Sandbox
// Test your functions and algorithms in real-time

function calculateStudentGrade(scores) {
  const average = scores.reduce((acc, curr) => acc + curr, 0) / scores.length;
  console.log('Class average score:', average.toFixed(2));
  
  if (average >= 90) return 'A+ Outstanding';
  if (average >= 80) return 'A Excellent';
  if (average >= 70) return 'B Good';
  return 'C Needs Practice';
}

const marks = [88, 92, 79, 95, 84];
const result = calculateStudentGrade(marks);
console.log('Result:', result);
return result;`,
  onClose
}) => {
  const [code, setCode] = useState(initialCode);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [returnValue, setReturnValue] = useState<any>(null);

  const runCode = () => {
    setLogs([]);
    setError(null);
    setReturnValue(null);

    const capturedLogs: string[] = [];
    const customConsole = {
      log: (...args: any[]) => {
        capturedLogs.push(
          args.map(a => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' ')
        );
      },
      warn: (...args: any[]) => {
        capturedLogs.push('[WARN] ' + args.map(a => String(a)).join(' '));
      },
      error: (...args: any[]) => {
        capturedLogs.push('[ERROR] ' + args.map(a => String(a)).join(' '));
      },
      info: (...args: any[]) => {
        capturedLogs.push('[INFO] ' + args.map(a => String(a)).join(' '));
      }
    };

    try {
      // Execute within safe function scope with injected console
      const runner = new Function('console', code);
      const result = runner(customConsole);
      setLogs(capturedLogs);
      if (result !== undefined) {
        setReturnValue(typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result));
      }
    } catch (err: any) {
      setError(err?.message || 'Execution error');
      setLogs(capturedLogs);
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    setLogs([]);
    setError(null);
    setReturnValue(null);
  };

  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col mb-4">
      {/* Sandbox Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0F172A] border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 font-mono">
            <span>🧪 Bano Qabil Live Test Sandbox</span>
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-600/10 text-blue-400 border border-blue-500/30">
            Client Safe Eval
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runCode}
            className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition shadow-[0_0_12px_rgba(37,99,235,0.3)]"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Run Code</span>
          </button>
          <button
            onClick={handleReset}
            className="p-1 rounded bg-[#1E293B] hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition text-xs border border-slate-700/60"
            title="Reset code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded bg-[#1E293B] hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition text-xs border border-slate-700/60"
              title="Close Sandbox"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Editor & Console Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 bg-[#0B0E14]">
        {/* Code Input */}
        <div className="p-3">
          <label className="block text-[11px] font-medium text-slate-400 mb-1.5 font-mono">
            Executable Script:
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            rows={8}
            className="w-full bg-[#011627] font-mono text-xs text-slate-100 p-3 rounded-lg border border-slate-800 focus:border-blue-500 focus:outline-none resize-none leading-5"
          />
        </div>

        {/* Live Output */}
        <div className="p-3 bg-[#0B0E14] flex flex-col">
          <label className="block text-[11px] font-medium text-slate-400 mb-1.5 font-mono flex items-center gap-1.5">
            <Terminal className="w-3 h-3 text-blue-400" />
            <span>Console Output & Return Value:</span>
          </label>

          <div className="flex-1 bg-[#011627] p-3 rounded-lg border border-slate-800 font-mono text-xs overflow-y-auto max-h-[200px] space-y-1">
            {logs.length === 0 && !error && returnValue === null && (
              <p className="text-slate-500 italic text-[11px]">
                Click "Run Code" to execute this snippet and see stdout here...
              </p>
            )}

            {logs.map((log, idx) => (
              <div key={idx} className="text-emerald-400 flex items-start gap-1.5">
                <span className="text-slate-600 select-none">❯</span>
                <span className="whitespace-pre-wrap">{log}</span>
              </div>
            ))}

            {returnValue !== null && (
              <div className="text-blue-300 pt-1 border-t border-slate-800 flex items-start gap-1.5 font-semibold">
                <span className="text-blue-500">← Return:</span>
                <span className="whitespace-pre-wrap">{returnValue}</span>
              </div>
            )}

            {error && (
              <div className="text-rose-400 pt-1 flex items-start gap-1.5 bg-rose-950/30 p-2 rounded border border-rose-900/40">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span className="whitespace-pre-wrap">{error}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
