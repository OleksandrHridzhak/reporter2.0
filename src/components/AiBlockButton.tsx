import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { OptionalBlockType, LabReport } from '../types/report';

const BLOCK_DESCS: Record<OptionalBlockType, string> = {
  abstract:     'мету роботи — короткий опис цілей лабораторної роботи (2–4 речення)',
  workProgress: 'хід роботи — пронумерований список кроків виконання лабораторної роботи (5–8 пунктів)',
  conclusion:   'висновок — підсумок результатів лабораторної роботи (2–4 речення)',
  appendix:     'вміст додатку (код програми або інший матеріал)',
};

function extractSectionText(report: LabReport, blockType: OptionalBlockType): string {
  if (blockType === 'abstract') return report.abstract?.content ?? '';
  if (blockType === 'conclusion') return report.conclusion?.content ?? '';
  if (blockType === 'workProgress') {
    return (report.workProgress?.items ?? []).map((it, i) => `${i + 1}. ${it.text}`).join('\n');
  }
  if (blockType === 'appendix') return report.appendix?.code ?? '';
  return '';
}

function buildPrompt(blockType: OptionalBlockType, report: LabReport, exampleReports: LabReport[], customPrompt: string): string {
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

interface Props {
  blockType: OptionalBlockType;
  report: LabReport;
  apiKey: string;
  onApply: (text: string) => void;
  exampleReports?: LabReport[];
  customPrompt?: string;
}

export const AiBlockButton: React.FC<Props> = ({ blockType, report, apiKey, onApply, exampleReports = [], customPrompt = '' }) => {
  const [variants, setVariants] = useState<string[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [open, setOpen]         = useState(false);

  const generate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!apiKey.trim()) {
      setError('Введіть API ключ Gemini у налаштуваннях.');
      setOpen(true);
      return;
    }
    setLoading(true);
    setError(null);
    setOpen(true);
    setVariants([]);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(buildPrompt(blockType, report, exampleReports, customPrompt));
      const text   = result.response.text();
      const parts  = text.split(/===VARIANT===/).map(s => s.trim()).filter(Boolean);
      setVariants(parts.length >= 2 ? parts : [text.trim()]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Помилка Gemini API');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    onApply(text);
    setOpen(false);
    setVariants([]);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(false);
    setVariants([]);
    setError(null);
  };

  return (
    <div className="ai-block-wrap">
      <button
        className="ai-block-btn"
        onClick={generate}
        disabled={loading}
        title="Згенерувати варіанти за допомогою AI"
      >
        {loading ? '⏳' : '✨'} AI
      </button>

      {open && (
        <div className="ai-variants-panel" onClick={e => e.stopPropagation()}>
          <div className="ai-variants-header">
            <span>✨ AI варіанти</span>
            <button className="ai-variants-close" onClick={handleClose} title="Закрити">✕</button>
          </div>

          {loading && (
            <div className="ai-variants-loading">
              <span /><span /><span />
              <span className="ai-variants-loading-text">Генерую варіанти…</span>
            </div>
          )}

          {error && <div className="ai-variants-error">⚠️ {error}</div>}

          {variants.map((v, i) => (
            <div key={i} className="ai-variant-card">
              <div className="ai-variant-card__num">Варіант {i + 1}</div>
              <div className="ai-variant-card__text">{v}</div>
              <button
                className="ai-variant-card__apply"
                onClick={e => handleApply(e, v)}
              >
                ↩ Застосувати
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
