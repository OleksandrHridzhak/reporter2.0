import React from 'react';
import type { ConclusionData, LabReport } from '../../types/report';
import { AiBlockButton } from '../AiBlockButton';

interface Props {
  data: ConclusionData;
  onChange: (data: ConclusionData) => void;
  isActive: boolean;
  onActivate: () => void;
  apiKey: string;
  report: LabReport;
  exampleReports?: LabReport[];
  customPrompt?: string;
}

export const ConclusionBlock: React.FC<Props> = ({ data, onChange, isActive, onActivate, apiKey, report, exampleReports, customPrompt }) => {
  return (
    <div className={`block ${isActive ? 'block--active' : ''}`} onClick={onActivate}>
      <div className="block__header">
        <h2 className="block__title">✅ Висновок</h2>
        <AiBlockButton
          blockType="conclusion"
          report={report}
          apiKey={apiKey}
          onApply={text => onChange({ content: text })}
          exampleReports={exampleReports}
          customPrompt={customPrompt}
        />
      </div>
      <div className="block__body">
        <div className="field-row">
          <label>Висновок</label>
          <textarea
            value={data.content}
            onChange={e => onChange({ content: e.target.value })}
            rows={5}
            placeholder="У ході виконання лабораторної роботи було..."
            onClick={e => e.stopPropagation()}
          />
        </div>
      </div>
    </div>
  );
};
