import React from 'react';
import type { AppendixData } from '../../types/report';

interface Props {
  data: AppendixData;
  onChange: (data: AppendixData) => void;
  isActive: boolean;
  onActivate: () => void;
}

export const AppendixBlock: React.FC<Props> = ({ data, onChange, isActive, onActivate }) => {
  return (
    <div className={`block ${isActive ? 'block--active' : ''}`} onClick={onActivate}>
      <div className="block__header">
        <h2 className="block__title">🗂️ Додаток</h2>
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
