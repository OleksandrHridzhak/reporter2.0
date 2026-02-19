import React from 'react';
import type { ReferencesData } from '../../types/report';

interface Props {
  data: ReferencesData;
  onChange: (data: ReferencesData) => void;
  isActive: boolean;
  onActivate: () => void;
}

export const ReferencesBlock: React.FC<Props> = ({ data, onChange, isActive, onActivate }) => {
  const addItem = () => onChange({ items: [...data.items, ''] });
  const removeItem = (i: number) => onChange({ items: data.items.filter((_, idx) => idx !== i) });
  const updateItem = (i: number, v: string) => {
    const items = [...data.items];
    items[i] = v;
    onChange({ items });
  };

  return (
    <div className={`block ${isActive ? 'block--active' : ''}`} onClick={onActivate}>
      <div className="block__header">
        <h2 className="block__title">📚 Список використаних джерел</h2>
      </div>
      <div className="block__body">
        <div className="task-list">
          {data.items.map((item, i) => (
            <div key={i} className="task-item">
              <span className="task-num">{i + 1}.</span>
              <input
                type="text"
                value={item}
                onChange={e => updateItem(i, e.target.value)}
                placeholder="Назва джерела (автор, назва, рік...)"
                onClick={e => e.stopPropagation()}
              />
              {data.items.length > 1 && (
                <button className="btn-icon" onClick={e => { e.stopPropagation(); removeItem(i); }}>✕</button>
              )}
            </div>
          ))}
          <button className="btn-add" onClick={e => { e.stopPropagation(); addItem(); }}>
            + Додати джерело
          </button>
        </div>
      </div>
    </div>
  );
};
