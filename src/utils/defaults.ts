import type { ReportData, TitlePageData, AbstractData, WorkProgressData, ConclusionData, ReferencesData } from '../types/report';

export const defaultTitlePage: TitlePageData = {
  university: 'ЛЬВІВСЬКИЙ НАЦІОНАЛЬНИЙ УНІВЕРСИТЕТ ІМЕНІ ІВАНА ФРАНКА',
  faculty: 'Факультет прикладної математики та інформатики',
  department: 'Кафедра програмування',
  workType: 'ЗВІТ',
  subject: 'з дисципліни «»',
  labNumber: '№ 1',
  topic: 'Тема: ',
  studentName: '',
  group: '',
  teacherName: '',
  city: 'Львів',
  year: new Date().getFullYear().toString(),
};

export const defaultAbstract: AbstractData = {
  purpose: '',
  tasks: [''],
  tools: '',
};

export const defaultWorkProgress: WorkProgressData = {
  steps: [
    { id: '1', title: 'Крок 1', content: '' },
  ],
};

export const defaultConclusion: ConclusionData = {
  content: '',
};

export const defaultReferences: ReferencesData = {
  items: [''],
};

export const defaultReportData: ReportData = {
  titlePage: defaultTitlePage,
  abstract: defaultAbstract,
  workProgress: defaultWorkProgress,
  conclusion: defaultConclusion,
  references: defaultReferences,
};
