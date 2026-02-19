import React from 'react';
import type { BlockType, OptionalBlockType, ReportData } from '../types/report';
import { TitlePageBlock } from './blocks/TitlePageBlock';
import { AbstractBlock } from './blocks/AbstractBlock';
import { WorkProgressBlock } from './blocks/WorkProgressBlock';
import { ConclusionBlock } from './blocks/ConclusionBlock';
import { AppendixBlock } from './blocks/AppendixBlock';
import { ReferencesBlock } from './blocks/ReferencesBlock';

const OPTIONAL_BLOCKS: { key: OptionalBlockType; label: string }[] = [
  { key: 'abstract', label: '📋 Мета' },
  { key: 'workProgress', label: '🔧 Хід роботи' },
  { key: 'conclusion', label: '✅ Висновки' },
  { key: 'appendix', label: '🗂️ Додаток' },
  { key: 'references', label: '📚 Список джерел' },
];

interface Props {
  data: ReportData;
  onChange: (data: ReportData) => void;
  activeBlock: BlockType | null;
  onActivateBlock: (block: BlockType) => void;
  onExport: () => void;
  onNew: () => void;
  onSave: () => void;
  onLoad: () => void;
}

export const ReportEditor: React.FC<Props> = ({
  data,
  onChange,
  activeBlock,
  onActivateBlock,
  onExport,
  onNew,
  onSave,
  onLoad,
}) => {
  const toggleBlock = (key: OptionalBlockType) => {
    const enabled = data.enabledBlocks.includes(key)
      ? data.enabledBlocks.filter(b => b !== key)
      : [...data.enabledBlocks, key];
    onChange({ ...data, enabledBlocks: enabled });
  };

  const has = (key: OptionalBlockType) => data.enabledBlocks.includes(key);

  return (
    <main className="report-editor">
      <div className="report-editor__toolbar">
        <div className="toolbar-left">
          <span className="toolbar-logo">📝 Reporter 2.0</span>
          <span className="toolbar-subtitle">ДСТУ + ЛНУ ім. Івана Франка</span>
        </div>
        <div className="toolbar-actions">
          <button className="btn btn--secondary" onClick={onNew}>🆕 Новий</button>
          <button className="btn btn--secondary" onClick={onSave}>💾 Зберегти</button>
          <button className="btn btn--secondary" onClick={onLoad}>📂 Завантажити</button>
          <button className="btn btn--primary" onClick={onExport}>⬇️ Експорт DOCX</button>
        </div>
      </div>

      <div className="blocks-toggle-bar">
        <span className="blocks-toggle-bar__label">Розділи:</span>
        {OPTIONAL_BLOCKS.map(({ key, label }) => (
          <button
            key={key}
            className={`block-toggle-btn ${has(key) ? 'block-toggle-btn--active' : ''}`}
            onClick={() => toggleBlock(key)}
            title={has(key) ? 'Приховати розділ' : 'Показати розділ'}
          >
            {has(key) ? '☑' : '☐'} {label}
          </button>
        ))}
      </div>

      <div className="report-editor__content">
        <TitlePageBlock
          data={data.titlePage}
          onChange={d => onChange({ ...data, titlePage: d })}
          isActive={activeBlock === 'titlePage'}
          onActivate={() => onActivateBlock('titlePage')}
        />

        {has('abstract') && (
          <AbstractBlock
            data={data.abstract}
            onChange={d => onChange({ ...data, abstract: d })}
            isActive={activeBlock === 'abstract'}
            onActivate={() => onActivateBlock('abstract')}
          />
        )}

        {has('workProgress') && (
          <WorkProgressBlock
            data={data.workProgress}
            onChange={d => onChange({ ...data, workProgress: d })}
            isActive={activeBlock === 'workProgress'}
            onActivate={() => onActivateBlock('workProgress')}
          />
        )}

        {has('conclusion') && (
          <ConclusionBlock
            data={data.conclusion}
            onChange={d => onChange({ ...data, conclusion: d })}
            isActive={activeBlock === 'conclusion'}
            onActivate={() => onActivateBlock('conclusion')}
          />
        )}

        {has('appendix') && (
          <AppendixBlock
            data={data.appendix}
            onChange={d => onChange({ ...data, appendix: d })}
            isActive={activeBlock === 'appendix'}
            onActivate={() => onActivateBlock('appendix')}
          />
        )}

        {has('references') && (
          <ReferencesBlock
            data={data.references}
            onChange={d => onChange({ ...data, references: d })}
            isActive={activeBlock === 'references'}
            onActivate={() => onActivateBlock('references')}
          />
        )}
      </div>
    </main>
  );
};
