import React, { useRef, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  Trash2, 
  Code, 
  FileCode, 
  Wand2, 
  Sparkles,
  Layers
} from 'lucide-react';
import { StackType } from '../types';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  fileName: string;
  onChangeFileName: (name: string) => void;
  stack: StackType;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  fileName,
  onChangeFileName,
  stack,
}) => {
  const [copied, setCopied] = React.useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const lines = code.split('\n');
  const lineCount = lines.length;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleClear = () => {
    if (confirm('Clear current code in editor?')) {
      onChange('');
    }
  };

  const handleQuickSnippet = (snippetType: string) => {
    let snippet = '';
    if (snippetType === 'try-catch') {
      snippet = `try {\n  // Execute risky operation\n} catch (error) {\n  console.error('Operation failed:', error);\n}`;
    } else if (snippetType === 'use-effect') {
      snippet = `useEffect(() => {\n  const controller = new AbortController();\n  // Async effect with cleanup\n  return () => controller.abort();\n}, []);`;
    } else if (snippetType === 'express-route') {
      snippet = `app.get('/api/endpoint', async (req, res, next) => {\n  try {\n    res.json({ success: true });\n  } catch (err) {\n    next(err);\n  }\n});`;
    } else if (snippetType === 'ts-interface') {
      snippet = `export interface StudentRecord {\n  id: string;\n  fullName: string;\n  cohort: string;\n  isGraduated: boolean;\n}`;
    } else if (snippetType === 'python-func') {
      snippet = `def process_student_data(payload: dict) -> dict:\n    try:\n        return {"status": "success", "data": payload}\n    except Exception as e:\n        raise ValueError(f"Processing failed: {e}")`;
    }

    if (snippet) {
      onChange(code ? `${code}\n\n${snippet}` : snippet);
    }
  };

  // Sync scrolling between line numbers and textarea
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0F172A] rounded-xl border border-slate-800 overflow-hidden shadow-xl">
      {/* Editor Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-3.5 py-2.5 bg-[#0F172A] border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-blue-400" />
          <input
            type="text"
            value={fileName}
            onChange={(e) => onChangeFileName(e.target.value)}
            className="bg-[#1E293B] text-xs font-mono font-medium text-slate-200 px-2.5 py-1 rounded border border-slate-700 focus:border-blue-500 focus:outline-none w-48 transition-colors"
            placeholder="e.g. UserProfile.tsx"
          />
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            ({stack})
          </span>
        </div>

        {/* Quick Snippet Insertions */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-slate-400 text-xs hidden lg:inline mr-1">Insert:</span>
          {stack === 'React' || stack === 'Next.js' ? (
            <button
              onClick={() => handleQuickSnippet('use-effect')}
              className="px-2 py-0.5 rounded bg-[#1E293B] hover:bg-slate-700 text-slate-300 transition border border-slate-700/80"
            >
              + useEffect
            </button>
          ) : null}
          {stack === 'Node.js' || stack === 'Full-Stack' ? (
            <button
              onClick={() => handleQuickSnippet('express-route')}
              className="px-2 py-0.5 rounded bg-[#1E293B] hover:bg-slate-700 text-slate-300 transition border border-slate-700/80"
            >
              + Async Route
            </button>
          ) : null}
          {stack === 'Python' ? (
            <button
              onClick={() => handleQuickSnippet('python-func')}
              className="px-2 py-0.5 rounded bg-[#1E293B] hover:bg-slate-700 text-slate-300 transition border border-slate-700/80"
            >
              + Def Func
            </button>
          ) : (
            <button
              onClick={() => handleQuickSnippet('ts-interface')}
              className="px-2 py-0.5 rounded bg-[#1E293B] hover:bg-slate-700 text-slate-300 transition border border-slate-700/80"
            >
              + Interface
            </button>
          )}
          <button
            onClick={() => handleQuickSnippet('try-catch')}
            className="px-2 py-0.5 rounded bg-[#1E293B] hover:bg-slate-700 text-slate-300 transition border border-slate-700/80"
          >
            + Try/Catch
          </button>
        </div>

        {/* Editor Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded bg-[#1E293B] hover:bg-slate-700 text-slate-300 transition border border-slate-700/60"
            title="Copy source code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleClear}
            className="p-1.5 rounded bg-[#1E293B] hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 transition border border-slate-700/60"
            title="Clear editor"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Code Text Area with Line Numbers */}
      <div className="relative flex-1 flex overflow-hidden min-h-[260px] bg-[#011627]">
        {/* Line Numbers Column */}
        <div
          ref={lineNumbersRef}
          aria-hidden="true"
          className="w-11 py-3 bg-[#0B0E14] border-r border-slate-800 select-none text-right pr-2.5 font-mono text-xs text-slate-500 overflow-hidden leading-6"
        >
          {Array.from({ length: Math.max(lineCount, 12) }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Actual Code Textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          placeholder={`// Paste or write your ${stack} student code here...\n// Include the function, component, or full-stack handler you need Bano Qabil AI to troubleshoot or refactor.`}
          spellCheck={false}
          className="w-full h-full p-3 font-mono text-xs leading-6 text-slate-100 bg-transparent resize-none focus:outline-none focus:ring-0 selection:bg-blue-600/30 placeholder:text-slate-500"
          style={{ tabSize: 2 }}
        />
      </div>

      {/* Editor Footer Status Bar */}
      <div className="px-3.5 py-1.5 bg-[#0F172A] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span>{lineCount} lines</span>
          <span>{code.length} characters</span>
          <span className="hidden sm:inline">UTF-8</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-blue-400 font-medium">Bano Qabil Code Studio</span>
        </div>
      </div>
    </div>
  );
};
