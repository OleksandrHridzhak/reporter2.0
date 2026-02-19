export type OptionalBlockType = 'abstract' | 'workProgress' | 'conclusion' | 'appendix';
export type BlockType = 'titlePage' | OptionalBlockType;

// ──────────────────────────────────────────────
// Global student settings (shared across all spaces)
// ──────────────────────────────────────────────
export interface GlobalSettings {
  faculty: string;
  studentName: string;
  studentGroup: string;
  useOldReportsAsExamples: boolean;
  customPrompt: string;
}

// ──────────────────────────────────────────────
// Space = one subject/course
// ──────────────────────────────────────────────
export interface Space {
  id: string;
  courseName: string;
  teacherTitle: string;
  teacherName: string;
  reports: LabReport[];
}

// ──────────────────────────────────────────────
// LabReport = one lab work within a space
// ──────────────────────────────────────────────
export interface LabReport {
  id: string;
  labNumber: string;
  topic: string;
  methodicalText?: string;
  isDone?: boolean;
  enabledBlocks: OptionalBlockType[];
  abstract: AbstractData;
  workProgress: WorkProgressData;
  conclusion: ConclusionData;
  appendix: AppendixData;
}

// ──────────────────────────────────────────────
// Block data types
// ──────────────────────────────────────────────
export interface AbstractData {
  content: string;
}

export interface WorkProgressItem {
  id: string;
  text: string;
  itemCode?: string;       // optional code snippet under this step
  imageBase64?: string;    // optional image (base64 data URL) under this step
}

export interface WorkProgressData {
  items: WorkProgressItem[];
}

export interface ConclusionData {
  content: string;
}

export interface AppendixData {
  title: string;
  code: string;
}

// ──────────────────────────────────────────────
// Chat
// ──────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  targetBlock?: BlockType;
}
