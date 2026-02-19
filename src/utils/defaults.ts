import type { ReportData, TitlePageData, AbstractData, WorkProgressData, ConclusionData, AppendixData, ReferencesData } from '../types/report';

export const defaultTitlePage: TitlePageData = {
  faculty: 'Факультет електроніки та комп\'ютерних технологій',
  labNumber: '1',
  course: '',
  topic: '',
  studentGroup: '',
  studentName: '',
  teacherTitle: 'Асист.',
  teacherName: '',
  year: new Date().getFullYear().toString(),
};

export const defaultAbstract: AbstractData = {
  content: '',
};

export const defaultWorkProgress: WorkProgressData = {
  steps: [
    { id: '1', title: '', content: '' },
  ],
};

export const defaultConclusion: ConclusionData = {
  content: '',
};

export const defaultAppendix: AppendixData = {
  title: 'Код програми',
  code: '',
};

export const defaultReferences: ReferencesData = {
  items: [''],
};

export const defaultReportData: ReportData = {
  titlePage: defaultTitlePage,
  enabledBlocks: ['abstract', 'workProgress', 'conclusion'],
  abstract: defaultAbstract,
  workProgress: defaultWorkProgress,
  conclusion: defaultConclusion,
  appendix: defaultAppendix,
  references: defaultReferences,
};
