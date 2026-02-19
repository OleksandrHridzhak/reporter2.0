import React from 'react';
import type { WorkProgressData, WorkProgressStep } from '../../types/report';

interface Props {
  data: WorkProgressData;
  onChange: (data: WorkProgressData) => void;
  isActive: boolean;
  onActivate: () => void;
}

export const WorkProgressBlock: React.FC<Props> = ({ data, onChange, isActive, onActivate }) => {
  const addStep = () => {
    const id = (Date.now()).toString();
    onChange({ steps: [...data.steps, { id, title: `Крок ${data.steps.length + 1}`, content: '' }] });
  };

  const removeStep = (id: string) => {
    onChange({ steps: data.steps.filter(s => s.id !== id) });
  };

  const updateStep = (id: string, patch: Partial<WorkProgressStep>) => {
    onChange({ steps: data.steps.map(s => s.id === id ? { ...s, ...patch } : s) });
  };

  return (
    <div className={`block ${isActive ? 'block--active' : ''}`} onClick={onActivate}>
      <div className="block__header">
        <h2 className="block__title">🔧 Хід роботи</h2>
      </div>
      <div className="block__body">
        {data.steps.map((step, i) => (
          <div key={step.id} className="step-card">
            <div className="step-header">
              <span className="step-num">{i + 1}.</span>
              <input
                type="text"
                className="step-title-input"
                value={step.title}
                onChange={e => updateStep(step.id, { title: e.target.value })}
                placeholder="Назва кроку"
                onClick={e => e.stopPropagation()}
              />
              {data.steps.length > 1 && (
                <button
                  className="btn-icon"
                  onClick={e => { e.stopPropagation(); removeStep(step.id); }}
                  title="Видалити крок"
                >✕</button>
              )}
            </div>
            <textarea
              className="step-content"
              value={step.content}
              onChange={e => updateStep(step.id, { content: e.target.value })}
              rows={5}
              placeholder="Опис кроку, код, результати..."
              onClick={e => e.stopPropagation()}
            />
          </div>
        ))}
        <button className="btn-add" onClick={e => { e.stopPropagation(); addStep(); }}>
          + Додати крок
        </button>
      </div>
    </div>
  );
};
