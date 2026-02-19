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
        <h2 className="block__title">✅ Висновки</h2>
      </div>
      <div className="block__body">
        <div className="field-row">
          <label>Текст висновків</label>
          <textarea
            value={data.content}
            onChange={e => onChange({ content: e.target.value })}
            rows={8}
            placeholder="Підведіть підсумок виконаної роботи..."
            onClick={e => e.stopPropagation()}
          />
        </div>
      </div>
    </div>
  );
};
