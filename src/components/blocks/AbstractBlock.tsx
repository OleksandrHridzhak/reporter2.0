import React from 'react';
import type { AbstractData } from '../../types/report';

interface Props {
  data: AbstractData;
  onChange: (data: AbstractData) => void;
  isActive: boolean;
  onActivate: () => void;
}

export const AbstractBlock: React.FC<Props> = ({ data, onChange, isActive, onActivate }) => {
  const addTask = () => onChange({ ...data, tasks: [...data.tasks, ''] });
  const removeTask = (i: number) => onChange({ ...data, tasks: data.tasks.filter((_, idx) => idx !== i) });
  const updateTask = (i: number, v: string) => {
    const tasks = [...data.tasks];
    tasks[i] = v;
    onChange({ ...data, tasks });
  };

  return (
    <div className={`block ${isActive ? 'block--active' : ''}`} onClick={onActivate}>
      <div className="block__header">
        <h2 className="block__title">📋 Анотація / Мета</h2>
      </div>
      <div className="block__body">
        <div className="field-row">
          <label>Мета роботи</label>
          <textarea
            value={data.purpose}
            onChange={e => onChange({ ...data, purpose: e.target.value })}
            rows={3}
            placeholder="Опишіть мету роботи..."
          />
        </div>

        <div className="field-row">
          <label>Завдання</label>
          <div className="task-list">
            {data.tasks.map((task, i) => (
              <div key={i} className="task-item">
                <span className="task-num">{i + 1}.</span>
                <input
                  type="text"
                  value={task}
                  onChange={e => updateTask(i, e.target.value)}
                  placeholder={`Завдання ${i + 1}`}
                />
                {data.tasks.length > 1 && (
                  <button className="btn-icon" onClick={e => { e.stopPropagation(); removeTask(i); }}>✕</button>
                )}
              </div>
            ))}
            <button className="btn-add" onClick={e => { e.stopPropagation(); addTask(); }}>+ Додати завдання</button>
          </div>
        </div>

        <div className="field-row">
          <label>Засоби виконання</label>
          <input
            type="text"
            value={data.tools}
            onChange={e => onChange({ ...data, tools: e.target.value })}
            placeholder="Мова програмування, IDE, бібліотеки..."
          />
        </div>
      </div>
    </div>
  );
};
