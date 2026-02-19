import React from 'react';
import type { WorkProgressData, WorkProgressItem } from '../../types/report';

interface Props {
  data: WorkProgressData;
  onChange: (data: WorkProgressData) => void;
  isActive: boolean;
  onActivate: () => void;
}

export const WorkProgressBlock: React.FC<Props> = ({ data, onChange, isActive, onActivate }) => {
  const addItem = () => {
    onChange({ items: [...data.items, { id: Date.now().toString(), text: '' }] });
  };

  const removeItem = (id: string) => {
    const items = data.items.filter(s => s.id !== id);
    onChange({ items: items.length ? items : [{ id: Date.now().toString(), text: '' }] });
  };

  const updateItem = (id: string, patch: Partial<WorkProgressItem>) => {
    onChange({ items: data.items.map(s => s.id === id ? { ...s, ...patch } : s) });
  };

  return (
    <div className={`block ${isActive ? 'block--active' : ''}`} onClick={onActivate}>
      <div className="block__header">
        <h2 className="block__title">🔧 Хід роботи</h2>
      </div>
      <div className="block__body">
        <div className="progress-list">
          {data.items.map((item, i) => (
            <div key={item.id} className="progress-item">
              <span className="progress-num">{i + 1}.</span>
              <input
                type="text"
                className="progress-text-input"
                value={item.text}
                onChange={e => updateItem(item.id, { text: e.target.value })}
                placeholder="Текст пункту..."
                onClick={e => e.stopPropagation()}
              />
              {data.items.length > 1 && (
                <button
                  className="btn-icon"
                  onClick={e => { e.stopPropagation(); removeItem(item.id); }}
                  title="Видалити пункт"
                >✕</button>
              )}
            </div>
          ))}
        </div>
        <button className="btn-add" onClick={e => { e.stopPropagation(); addItem(); }}>
          + Додати пункт
        </button>
      </div>
    </div>
  );
};
