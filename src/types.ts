export type StackType = 
  | 'React' 
  | 'Next.js' 
  | 'Node.js' 
  | 'TypeScript' 
  | 'Python' 
  | 'Full-Stack';

export type AnalysisMode = 'debug' | 'refactor' | 'explain';

export interface PresetBug {
  id: string;
  title: string;
  stack: StackType;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  fileName: string;
  code: string;
  errorLog: string;
  studentQuestion: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  codeSnippet?: string;
}

export interface DebugState {
  code: string;
  errorLog: string;
  question: string;
  stack: StackType;
  fileName: string;
  mode: AnalysisMode;
  isLoading: boolean;
  activeTab: 'workspace' | 'sandbox' | 'presets';
}
