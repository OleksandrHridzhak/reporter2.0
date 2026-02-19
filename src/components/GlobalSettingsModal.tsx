import React, { useState } from 'react';
import type { GlobalSettings } from '../types/report';

interface Props {
  settings: GlobalSettings;
  apiKey: string;
  onSave: (settings: GlobalSettings, apiKey: string) => void;
  onClose: () => void;
}

export const GlobalSettingsModal: React.FC<Props> = ({ settings, apiKey, onSave, onClose }) => {
  const [faculty, setFaculty] = useState(settings.faculty);
  const [studentName, setStudentName] = useState(settings.studentName);
  const [studentGroup, setStudentGroup] = useState(settings.studentGroup);
  const [key, setKey] = useState(apiKey);
  const [useOldReportsAsExamples, setUseOldReportsAsExamples] = useState(settings.useOldReportsAsExamples ?? false);
  const [customPrompt, setCustomPrompt] = useState(settings.customPrompt ?? '');

  const handleSave = () => {
    onSave({ faculty, studentName, studentGroup, useOldReportsAsExamples, customPrompt }, key);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--wide" onClick={e => e.stopPropagation()}>
        <h2 className="modal__title">⚙️ Глобальні налаштування</h2>
        <p className="modal__desc">Ці дані спільні для всіх предметів і звітів.</p>

        <div className="modal__body">
          <div className="field-row">
            <label>Факультет</label>
            <input
              type="text"
              value={faculty}
              onChange={e => setFaculty(e.target.value)}
              placeholder="Факультет електроніки та комп'ютерних технологій"
            />
          </div>
          <div className="field-group field-group--row">
            <div className="field-row" style={{ flex: '0 0 120px' }}>
              <label>Група</label>
              <input
                type="text"
                value={studentGroup}
                onChange={e => setStudentGroup(e.target.value)}
                placeholder="ФЕІ-33"
              />
            </div>
            <div className="field-row" style={{ flex: 1 }}>
              <label>Ім'я студента</label>
              <input
                type="text"
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                placeholder="Прізвище Ім'я"
              />
            </div>
          </div>

          <div className="settings-divider" />

          <div className="field-row">
            <label>Gemini API ключ</label>
            <input
              type="password"
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="Вставте ваш Gemini API ключ..."
            />
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="api-key-link"
              style={{ color: 'var(--primary)' }}
            >
              Отримати безкоштовний API ключ →
            </a>
          </div>

          <div className="settings-divider" />

          <div className="field-row field-row--checkbox">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={useOldReportsAsExamples}
                onChange={e => setUseOldReportsAsExamples(e.target.checked)}
              />
              <span>Використовувати виконані звіти як приклад для AI</span>
            </label>
            <p className="field-hint">
              Якщо увімкнено, AI отримує виконані звіти цього предмету як зразок стилю та структури.
            </p>
          </div>

          <div className="field-row">
            <label htmlFor="settings-custom-prompt">
              Додаткові правила для AI{' '}
              <span className="field-label-optional" aria-label="необов'язкове поле">(необов'язково)</span>
            </label>
            <textarea
              id="settings-custom-prompt"
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
              rows={3}
              aria-describedby="settings-custom-prompt-hint"
              placeholder="Наприклад: завжди використовуй пасивний стан, уникай слова 'даний', пиши висновки від першої особи множини..."
            />
            <p id="settings-custom-prompt-hint" className="field-hint">
              Ці правила будуть додані до кожного AI-запиту під час генерації тексту.
            </p>
          </div>
        </div>

        <div className="modal__footer">
          <button className="btn btn--secondary" onClick={onClose}>Скасувати</button>
          <button className="btn btn--primary" onClick={handleSave}>Зберегти</button>
        </div>
      </div>
    </div>
  );
};
