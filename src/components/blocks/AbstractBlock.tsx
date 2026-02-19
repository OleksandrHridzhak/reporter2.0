import React from 'react';
import type { AbstractData, LabReport } from '../../types/report';
import { AiBlockButton } from '../AiBlockButton';

interface Props {
  data: AbstractData;
  onChange: (data: AbstractData) => void;
  isActive: boolean;
  onActivate: () => void;
  apiKey: string;
  report: LabReport;
  exampleReports?: LabReport[];
  customPrompt?: string;
}

export const AbstractBlock: React.FC<Props> = ({ data, onChange, isActive, onActivate, apiKey, report, exampleReports, customPrompt }) => {
  return (
    <div className={`block ${isActive ? 'block--active' : ''}`} onClick={onActivate}>
      <div className="block__header">
        <h2 className="block__title">📋 Мета роботи</h2>
        <AiBlockButton
          blockType="abstract"
          report={report}
          apiKey={apiKey}
          onApply={text => onChange({ content: text })}
          exampleReports={exampleReports}
          customPrompt={customPrompt}
        />
      </div>
      <div className="block__body">
        <div className="field-row">
          <label>Мета роботи</label>
          <textarea
            value={data.content}
            onChange={e => onChange({ content: e.target.value })}
            rows={4}
            placeholder="Ознайомитися з..."
            onClick={e => e.stopPropagation()}
          />
        </div>
      </div>
    </div>
  );
};
