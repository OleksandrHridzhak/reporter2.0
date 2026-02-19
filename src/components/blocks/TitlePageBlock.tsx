import React, { useState } from 'react';
import type { GlobalSettings, Space, LabReport } from '../../types/report';

interface Props {
  global: GlobalSettings;
  space: Space;
  report: LabReport;
  onReportChange: (r: LabReport) => void;
  isActive: boolean;
  onActivate: () => void;
}

export const TitlePageBlock: React.FC<Props> = ({
  global, space, report, onReportChange, isActive, onActivate,
}) => {
  const year = new Date().getFullYear();
  const [detailsOpen, setDetailsOpen]       = useState(false);
  const [methodicalOpen, setMethodicalOpen] = useState(false);

  return (
    <div className={`block ${isActive ? 'block--active' : ''}`} onClick={onActivate}>
      <div className="block__header">
        <h2 className="block__title">📄 Титульна сторінка</h2>
      </div>
      <div className="block__body">

        {/* Editable per-report fields */}
        <div className="field-row field-row--inline">
          <label>ЛАБОРАТОРНА РОБОТА №</label>
          <input
            type="text"
            value={report.labNumber}
            onChange={e => onReportChange({ ...report, labNumber: e.target.value })}
            placeholder="1"
            className="input--short"
            onClick={e => e.stopPropagation()}
          />
        </div>

        <div className="field-row">
          <label>Тема</label>
          <input
            type="text"
            value={report.topic}
            onChange={e => onReportChange({ ...report, topic: e.target.value })}
            placeholder="Назва теми"
            onClick={e => e.stopPropagation()}
          />
        </div>

        {/* Collapsible: read-only info from settings */}
        <div className="collapse-section" onClick={e => e.stopPropagation()}>
          <div
            className="collapse-section__header"
            onClick={() => setDetailsOpen(v => !v)}
          >
            <span className="collapse-section__title">
              📋 Деталі (факультет, викладач, студент…)
            </span>
            <span className="collapse-section__chevron">{detailsOpen ? '▲' : '▼'}</span>
          </div>
          {detailsOpen && (
            <div className="collapse-section__body">
              <div className="title-preview">
                <div className="title-preview__static">Міністерство освіти і науки України</div>
                <div className="title-preview__static">Львівський національний університет імені Івана Франка</div>
                <div className="title-preview__static title-preview__static--highlight">{global.faculty || '—'}</div>
              </div>
              <div className="title-divider" />
              <div className="title-readonly-section">
                <div className="title-readonly-row">
                  <span className="title-readonly-label">з курсу:</span>
                  <span className="title-readonly-value">{space.courseName || '—'}</span>
                </div>
              </div>
              <div className="title-divider" />
              <div className="title-readonly-section">
                <div className="title-preview__label">Виконав:</div>
                <div className="title-readonly-row">
                  <span className="title-readonly-label">Група:</span>
                  <span className="title-readonly-value">{global.studentGroup || '—'}</span>
                </div>
                <div className="title-readonly-row">
                  <span className="title-readonly-label">Студент:</span>
                  <span className="title-readonly-value">{global.studentName || '—'}</span>
                </div>
                <div className="title-preview__label" style={{ marginTop: 8 }}>Перевірив:</div>
                <div className="title-readonly-row">
                  <span className="title-readonly-label">Викладач:</span>
                  <span className="title-readonly-value">{space.teacherTitle} {space.teacherName || '—'}</span>
                </div>
              </div>
              <div className="title-divider" />
              <div className="title-readonly-section">
                <div className="title-readonly-row">
                  <span className="title-readonly-label">Рік:</span>
                  <span className="title-readonly-value">{year}</span>
                </div>
              </div>
              <p className="title-hint">
                💡 Факультет, студент і група — у <strong>Глобальних налаштуваннях</strong>.
                Курс і викладач — у налаштуваннях <strong>Предмету</strong>.
              </p>
            </div>
          )}
        </div>

        {/* Collapsible: methodical text for AI context */}
        <div className="collapse-section" onClick={e => e.stopPropagation()}>
          <div
            className="collapse-section__header"
            onClick={() => setMethodicalOpen(v => !v)}
          >
            <span className="collapse-section__title">📝 Методичка (контекст для AI)</span>
            <span className="collapse-section__chevron">{methodicalOpen ? '▲' : '▼'}</span>
          </div>
          {methodicalOpen && (
            <div className="collapse-section__body">
              <textarea
                value={report.methodicalText ?? ''}
                onChange={e => onReportChange({ ...report, methodicalText: e.target.value })}
                rows={6}
                placeholder="Вставте текст методичних вказівок до лабораторної роботи. AI використовуватиме його для генерації контенту…"
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
