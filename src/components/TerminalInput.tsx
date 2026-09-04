import React from 'react';
import { 
  Terminal, 
  AlertTriangle, 
  Trash2, 
  Check, 
  Copy, 
  Flame,
  Bug
} from 'lucide-react';

interface TerminalInputProps {
  errorLog: string;
  onChange: (value: string) => void;
  stack: string;
}

export const TerminalInput: React.FC<TerminalInputProps> = ({
  errorLog,
  onChange,
  stack
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    if (!errorLog) return;
    try {
      await navigator.clipboard.writeText(errorLog);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Detect common errors in log for smart visual feedback
  const detectedErrorTypes = [];
  if (/hydration/i.test(errorLog)) detectedErrorTypes.push('Hydration Mismatch');
  if (/typeerror/i.test(errorLog)) detectedErrorTypes.push('TypeError');
  if (/referenceerror/i.test(errorLog)) detectedErrorTypes.push('ReferenceError');
  if (/maximum update depth/i.test(errorLog)) detectedErrorTypes.push('Infinite Loop');
  if (/cors/i.test(errorLog)) detectedErrorTypes.push('CORS Block');
  if (/keyerror/i.test(errorLog)) detectedErrorTypes.push('KeyError');
  if (/unhandledpromiserejection/i.test(errorLog)) detectedErrorTypes.push('Unhandled Promise');
  if (/ts\d+/i.test(errorLog)) detectedErrorTypes.push('TypeScript Diagnostic');

  return (
    <div className="flex flex-col bg-[#0F172A] rounded-xl border border-slate-800 overflow-hidden shadow-sm">
      {/* Terminal Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#0F172A] border-b border-slate-800">
        <div className="flex items-center gap-2">
          {/* Terminal Dots */}
          <div className="flex items-center gap-1.5 mr-1">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
          </div>
          <Terminal className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs font-mono font-medium text-slate-300">
            Console / Stack Trace / Error Log
          </span>
          {detectedErrorTypes.length > 0 && (
            <div className="hidden sm:flex items-center gap-1">
              {detectedErrorTypes.map(tag => (
                <span 
                  key={tag} 
                  className="px-1.5 py-0.5 text-[10px] font-mono bg-rose-950/40 text-rose-400 border border-rose-800/40 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {errorLog && (
            <>
              <button
                onClick={handleCopy}
                className="p-1 rounded bg-[#1E293B] hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition text-xs border border-slate-700/60"
                title="Copy log"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
              <button
                onClick={() => onChange('')}
                className="p-1 rounded bg-[#1E293B] hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition text-xs border border-slate-700/60"
                title="Clear terminal log"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Terminal Text Area */}
      <div className="p-3 bg-[#011627]">
        <textarea
          value={errorLog}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Paste terminal error, build failure, or console error log here (optional)...
Example:
Uncaught TypeError: Cannot read properties of undefined (reading 'map')
  at StudentRoster (StudentRoster.tsx:24)`}
          spellCheck={false}
          rows={4}
          className="w-full bg-transparent font-mono text-xs leading-5 text-rose-300 focus:outline-none resize-none placeholder:text-slate-500 selection:bg-rose-500/30"
        />
      </div>
    </div>
  );
};
