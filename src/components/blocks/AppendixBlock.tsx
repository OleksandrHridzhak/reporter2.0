import React from 'react';
import type { AppendixData, LabReport } from '../../types/report';
import { AiBlockButton } from '../AiBlockButton';

interface Props {
  data: AppendixData;
  onChange: (data: AppendixData) => void;
  isActive: boolean;
  onActivate: () => void;
  apiKey: string;
  report: LabReport;
  exampleReports?: LabReport[];
  customPrompt?: string;
}

export const AppendixBlock: React.FC<Props> = ({ data, onChange, isActive, onActivate, apiKey, report, exampleReports, customPrompt }) => {
  return (
    <div className={`block ${isActive ? 'block--active' : ''}`} onClick={onActivate}>
      <div className="block__header">
        <h2 className="block__title">🗂️ Додаток</h2>
        <AiBlockButton
          blockType="appendix"
          report={report}
          apiKey={apiKey}
          onApply={text => onChange({ ...data, code: text })}
          exampleReports={exampleReports}
          customPrompt={customPrompt}
        />
      </div>
      <div className="block__body">
        <div className="field-row">
          <label>Назва додатку</label>
          <input
            type="text"
            value={data.title}
            onChange={e => onChange({ ...data, title: e.target.value })}
            placeholder="Код програми"
            onClick={e => e.stopPropagation()}
          />
        </div>
        <div className="field-row">
          <label>Вміст / Код</label>
          <textarea
            value={data.code}
            onChange={e => onChange({ ...data, code: e.target.value })}
            rows={10}
            className="code-textarea"
            placeholder="import random&#10;..."
            onClick={e => e.stopPropagation()}
          />
        </div>
      </div>
    </div>
  );
};
