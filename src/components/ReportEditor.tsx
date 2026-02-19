import React from 'react';
import type { BlockType, OptionalBlockType, GlobalSettings, Space, LabReport } from '../types/report';
import { TitlePageBlock } from './blocks/TitlePageBlock';
import { AbstractBlock } from './blocks/AbstractBlock';
import { WorkProgressBlock } from './blocks/WorkProgressBlock';
import { ConclusionBlock } from './blocks/ConclusionBlock';
import { AppendixBlock } from './blocks/AppendixBlock';

const OPTIONAL_BLOCKS: { key: OptionalBlockType; label: string }[] = [
  { key: 'abstract',     label: '📋 Мета' },
  { key: 'workProgress', label: '🔧 Хід роботи' },
  { key: 'conclusion',   label: '✅ Висновки' },
  { key: 'appendix',     label: '🗂️ Додаток' },
];

interface Props {
  global: GlobalSettings;
  space: Space;
  report: LabReport;
  onReportChange: (r: LabReport) => void;
  activeBlock: BlockType | null;
  onActivateBlock: (block: BlockType) => void;
  onExport: () => void;
  onBack: () => void;
  onSave: () => void;
  apiKey: string;
}

export const ReportEditor: React.FC<Props> = ({
  global,
  space,
  report,
  onReportChange,
  activeBlock,
  onActivateBlock,
  onExport,
  onBack,
  onSave,
  apiKey,
}) => {
  const toggleBlock = (key: OptionalBlockType) => {
    const enabled = report.enabledBlocks.includes(key)
      ? report.enabledBlocks.filter(b => b !== key)
      : [...report.enabledBlocks, key];
    onReportChange({ ...report, enabledBlocks: enabled });
  };

  const has = (key: OptionalBlockType) => report.enabledBlocks.includes(key);

  return (
    <main className="report-editor">
      <div className="report-editor__toolbar">
        <div className="toolbar-left">
          <button className="btn btn--secondary btn--back" onClick={onBack}>← Назад</button>
          <div>
            <span className="toolbar-logo">{space.courseName}</span>
            <span className="toolbar-subtitle"> · Лаб. #{report.labNumber}{report.topic ? ` · ${report.topic}` : ''}</span>
          </div>
        </div>
        <div className="toolbar-actions">
          <button className="btn btn--secondary" onClick={onSave}>💾 Зберегти JSON</button>
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
          global={global}
          space={space}
          report={report}
          onReportChange={onReportChange}
          isActive={activeBlock === 'titlePage'}
          onActivate={() => onActivateBlock('titlePage')}
        />

        {has('abstract') && (
          <AbstractBlock
            data={report.abstract}
            onChange={d => onReportChange({ ...report, abstract: d })}
            isActive={activeBlock === 'abstract'}
            onActivate={() => onActivateBlock('abstract')}
            apiKey={apiKey}
            report={report}
          />
        )}

        {has('workProgress') && (
          <WorkProgressBlock
            data={report.workProgress}
            onChange={d => onReportChange({ ...report, workProgress: d })}
            isActive={activeBlock === 'workProgress'}
            onActivate={() => onActivateBlock('workProgress')}
            apiKey={apiKey}
            report={report}
          />
        )}

        {has('conclusion') && (
          <ConclusionBlock
            data={report.conclusion}
            onChange={d => onReportChange({ ...report, conclusion: d })}
            isActive={activeBlock === 'conclusion'}
            onActivate={() => onActivateBlock('conclusion')}
            apiKey={apiKey}
            report={report}
          />
        )}

        {has('appendix') && (
          <AppendixBlock
            data={report.appendix}
            onChange={d => onReportChange({ ...report, appendix: d })}
            isActive={activeBlock === 'appendix'}
            onActivate={() => onActivateBlock('appendix')}
            apiKey={apiKey}
            report={report}
          />
        )}
      </div>
    </main>
  );
};
