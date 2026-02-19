import React from 'react';
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

  return (
    <div className={`block ${isActive ? 'block--active' : ''}`} onClick={onActivate}>
      <div className="block__header">
        <h2 className="block__title">📄 Титульна сторінка</h2>
      </div>
      <div className="block__body">

        {/* Static header preview */}
        <div className="title-preview">
          <div className="title-preview__static">Міністерство освіти і науки України</div>
          <div className="title-preview__static">Львівський національний університет імені Івана Франка</div>
          <div className="title-preview__static title-preview__static--highlight">{global.faculty || '—'}</div>
        </div>

        {/* Per-report fields */}
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

        {/* Space (read-only) */}
        <div className="title-divider" />
        <div className="title-readonly-section">
          <div className="title-readonly-row">
            <span className="title-readonly-label">з курсу:</span>
            <span className="title-readonly-value">{space.courseName || '—'}</span>
          </div>
        </div>

        {/* Global (read-only) */}
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
    </div>
  );
};
