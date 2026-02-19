import { GoogleGenerativeAI } from '@google/generative-ai';
import type { OptionalBlockType, LabReport } from '../types/report';

export const BLOCK_DESCS: Record<OptionalBlockType, string> = {
  abstract:     'мету роботи — короткий опис цілей лабораторної роботи (2–4 речення)',
  workProgress: 'хід роботи — пронумерований список кроків виконання лабораторної роботи (5–8 пунктів)',
  conclusion:   'висновок — підсумок результатів лабораторної роботи (2–4 речення)',
  appendix:     'вміст додатку (код програми або інший матеріал)',
};

export function extractSectionText(report: LabReport, blockType: OptionalBlockType): string {
  if (blockType === 'abstract') return report.abstract?.content ?? '';
  if (blockType === 'conclusion') return report.conclusion?.content ?? '';
  if (blockType === 'workProgress') {
    return (report.workProgress?.items ?? []).map((it, i) => `${i + 1}. ${it.text}`).join('\n');
  }
  if (blockType === 'appendix') return report.appendix?.code ?? '';
  return '';
}

export function buildPrompt(
  blockType: OptionalBlockType,
  report: LabReport,
  exampleReports: LabReport[],
  customPrompt: string,
): string {
  const desc = BLOCK_DESCS[blockType];
  const parts: string[] = [
    `Ти асистент для написання академічних звітів. Стиль: офіційний, науковий, українська мова. Дотримуйся стандартів ДСТУ.`,
    `Напиши ${desc} для лабораторної роботи №${report.labNumber}${report.topic ? ` на тему "${report.topic}"` : ''}.`,
  ];
  if (report.methodicalText?.trim()) {
    parts.push(`\nМетодичні вказівки:\n${report.methodicalText.trim()}`);
  }
  if (customPrompt.trim()) {
    parts.push(`\nДодаткові правила:\n${customPrompt.trim()}`);
  }
  if (exampleReports.length > 0) {
    const examples = exampleReports
      .map(r => {
        const sectionText = extractSectionText(r, blockType);
        if (!sectionText.trim()) return null;
        return `Лабораторна №${r.labNumber}${r.topic ? ` (${r.topic})` : ''}:\n${sectionText.trim()}`;
      })
      .filter(Boolean);
    if (examples.length > 0) {
      parts.push(`\nПриклади з попередніх виконаних звітів (орієнтуйся на стиль та структуру):\n${examples.join('\n\n')}`);
    }
  }
  parts.push(
    `\nСтвори РІВНО 3 різних варіанти. Розділяй їх рядком "===VARIANT===". Пиши тільки текст розділу без зайвих пояснень та заголовків.`
  );
  return parts.join('\n');
}

/** Calls Gemini and returns the first generated variant text. */
export async function generateFirstVariant(
  blockType: OptionalBlockType,
  report: LabReport,
  apiKey: string,
  exampleReports: LabReport[],
  customPrompt: string,
): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const result = await model.generateContent(buildPrompt(blockType, report, exampleReports, customPrompt));
  const text = result.response.text();
  const parts = text.split(/===VARIANT===/).map((s: string) => s.trim()).filter(Boolean);
  return parts[0] ?? text.trim();
}
