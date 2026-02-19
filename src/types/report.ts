export type BlockType = 'titlePage' | 'abstract' | 'workProgress' | 'conclusion' | 'references';

export interface TitlePageData {
  university: string;
  faculty: string;
  department: string;
  workType: string;
  subject: string;
  labNumber: string;
  topic: string;
  studentName: string;
  group: string;
  teacherName: string;
  city: string;
  year: string;
}

export interface AbstractData {
  purpose: string;
  tasks: string[];
  tools: string;
}

export interface WorkProgressStep {
  id: string;
  title: string;
  content: string;
}

export interface WorkProgressData {
  steps: WorkProgressStep[];
}

export interface ConclusionData {
  content: string;
}

export interface ReferencesData {
  items: string[];
}

export interface ReportData {
  titlePage: TitlePageData;
  abstract: AbstractData;
  workProgress: WorkProgressData;
  conclusion: ConclusionData;
  references: ReferencesData;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  targetBlock?: BlockType;
}
