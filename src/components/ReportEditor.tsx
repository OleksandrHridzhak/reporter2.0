import React from 'react';
import type { BlockType, ReportData } from '../types/report';
import { TitlePageBlock } from './blocks/TitlePageBlock';
import { AbstractBlock } from './blocks/AbstractBlock';
import { WorkProgressBlock } from './blocks/WorkProgressBlock';
import { ConclusionBlock } from './blocks/ConclusionBlock';
import { ReferencesBlock } from './blocks/ReferencesBlock';

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
  return (
    <main className="report-editor">
      <div className="report-editor__toolbar">
        <div className="toolbar-left">
          <span className="toolbar-logo">📝 Reporter 2.0</span>
          <span className="toolbar-subtitle">ДСТУ + ЛНУ ім. Івана Франка</span>
        </div>
        <div className="toolbar-actions">
          <button className="btn btn--secondary" onClick={onNew} title="Новий звіт">🆕 Новий</button>
          <button className="btn btn--secondary" onClick={onSave} title="Зберегти як JSON">💾 Зберегти</button>
          <button className="btn btn--secondary" onClick={onLoad} title="Завантажити JSON">📂 Завантажити</button>
          <button className="btn btn--primary" onClick={onExport} title="Експортувати в DOCX">⬇️ Експорт DOCX</button>
        </div>
      </div>

      <div className="report-editor__content">
        <TitlePageBlock
          data={data.titlePage}
          onChange={d => onChange({ ...data, titlePage: d })}
          isActive={activeBlock === 'titlePage'}
          onActivate={() => onActivateBlock('titlePage')}
        />
        <AbstractBlock
          data={data.abstract}
          onChange={d => onChange({ ...data, abstract: d })}
          isActive={activeBlock === 'abstract'}
          onActivate={() => onActivateBlock('abstract')}
        />
        <WorkProgressBlock
          data={data.workProgress}
          onChange={d => onChange({ ...data, workProgress: d })}
          isActive={activeBlock === 'workProgress'}
          onActivate={() => onActivateBlock('workProgress')}
        />
        <ConclusionBlock
          data={data.conclusion}
          onChange={d => onChange({ ...data, conclusion: d })}
          isActive={activeBlock === 'conclusion'}
          onActivate={() => onActivateBlock('conclusion')}
        />
        <ReferencesBlock
          data={data.references}
          onChange={d => onChange({ ...data, references: d })}
          isActive={activeBlock === 'references'}
          onActivate={() => onActivateBlock('references')}
        />
      </div>
    </main>
  );
};
