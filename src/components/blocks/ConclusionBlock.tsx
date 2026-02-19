import React from 'react';
import type { ConclusionData } from '../../types/report';

interface Props {
  data: ConclusionData;
  onChange: (data: ConclusionData) => void;
  isActive: boolean;
  onActivate: () => void;
}

export const ConclusionBlock: React.FC<Props> = ({ data, onChange, isActive, onActivate }) => {
  return (
    <div className={`block ${isActive ? 'block--active' : ''}`} onClick={onActivate}>
      <div className="block__header">
        <h2 className="block__title">✅ Висновок</h2>
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
