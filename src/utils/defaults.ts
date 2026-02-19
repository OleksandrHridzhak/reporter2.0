import type { GlobalSettings, Space, LabReport, AbstractData, WorkProgressData, ConclusionData, AppendixData, ReferencesData } from '../types/report';

export const defaultGlobalSettings: GlobalSettings = {
  faculty: 'Факультет електроніки та комп\'ютерних технологій',
  studentName: '',
  studentGroup: '',
};

export const defaultAbstract: AbstractData = { content: '' };

export const defaultWorkProgress: WorkProgressData = {
  items: [{ id: '1', text: '' }],
};

export const defaultConclusion: ConclusionData = { content: '' };

export const defaultAppendix: AppendixData = { title: 'Код програми', code: '' };

export const defaultReferences: ReferencesData = { items: [''] };

export function createDefaultReport(labNumber = '1'): LabReport {
  return {
    id: Date.now().toString(),
    labNumber,
    topic: '',
    enabledBlocks: ['abstract', 'workProgress', 'conclusion'],
    abstract: { ...defaultAbstract },
    workProgress: { items: [{ id: Date.now().toString(), text: '' }] },
    conclusion: { ...defaultConclusion },
    appendix: { ...defaultAppendix },
    references: { items: [''] },
  };
}

export function createDefaultSpace(courseName: string, teacherTitle: string, teacherName: string): Space {
  return {
    id: Date.now().toString(),
    courseName,
    teacherTitle,
    teacherName,
    reports: [],
  };
}
