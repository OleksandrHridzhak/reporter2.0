export type OptionalBlockType = 'abstract' | 'workProgress' | 'conclusion' | 'appendix' | 'references';
export type BlockType = 'titlePage' | OptionalBlockType;

export interface TitlePageData {
  faculty: string;
  labNumber: string;
  course: string;
  topic: string;
  studentGroup: string;
  studentName: string;
  teacherTitle: string;
  teacherName: string;
  year: string;
}

export interface AbstractData {
  content: string;
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

export interface AppendixData {
  title: string;
  code: string;
}

export interface ReferencesData {
  items: string[];
}

export interface ReportData {
  titlePage: TitlePageData;
  enabledBlocks: OptionalBlockType[];
  abstract: AbstractData;
  workProgress: WorkProgressData;
  conclusion: ConclusionData;
  appendix: AppendixData;
  references: ReferencesData;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  targetBlock?: BlockType;
}
