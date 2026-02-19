import React, { useState } from 'react';
import type { Space, GlobalSettings } from '../types/report';
import { createDefaultSpace, createDefaultReport } from '../utils/defaults';

interface Props {
  spaces: Space[];
  globalSettings: GlobalSettings;
  onOpenReport: (spaceId: string, reportId: string) => void;
  onSpacesChange: (spaces: Space[]) => void;
  onOpenSettings: () => void;
}

export const HomeScreen: React.FC<Props> = ({
  spaces,
  globalSettings,
  onOpenReport,
  onSpacesChange,
  onOpenSettings,
}) => {
  const [showNewSpace, setShowNewSpace] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [newTeacherTitle, setNewTeacherTitle] = useState('Асист.');
  const [newTeacherName, setNewTeacherName] = useState('');
  const [expandedSpaceId, setExpandedSpaceId] = useState<string | null>(null);

  const handleCreateSpace = () => {
    if (!newCourseName.trim()) return;
    const space = createDefaultSpace(newCourseName.trim(), newTeacherTitle.trim(), newTeacherName.trim());
    onSpacesChange([...spaces, space]);
    setShowNewSpace(false);
    setNewCourseName('');
    setNewTeacherTitle('Асист.');
    setNewTeacherName('');
    setExpandedSpaceId(space.id);
  };

  const handleDeleteSpace = (spaceId: string) => {
    if (!window.confirm('Видалити предмет і всі його звіти?')) return;
    onSpacesChange(spaces.filter(s => s.id !== spaceId));
  };

  const handleAddReport = (spaceId: string) => {
    const space = spaces.find(s => s.id === spaceId);
    if (!space) return;
    const nextNum = (space.reports.length + 1).toString();
    const report = createDefaultReport(nextNum);
    const updated = spaces.map(s =>
      s.id === spaceId ? { ...s, reports: [...s.reports, report] } : s
    );
    onSpacesChange(updated);
    onOpenReport(spaceId, report.id);
  };

  const handleDeleteReport = (spaceId: string, reportId: string) => {
    if (!window.confirm('Видалити цей звіт?')) return;
    const updated = spaces.map(s =>
      s.id === spaceId ? { ...s, reports: s.reports.filter(r => r.id !== reportId) } : s
    );
    onSpacesChange(updated);
  };

  const handleToggleReportDone = (spaceId: string, reportId: string) => {
    const updated = spaces.map(s =>
      s.id === spaceId
        ? { ...s, reports: s.reports.map(r => r.id === reportId ? { ...r, isDone: !r.isDone } : r) }
        : s
    );
    onSpacesChange(updated);
  };

  return (
    <div className="home-screen">
      {/* Header */}
      <div className="home-header">
        <div className="home-header__left">
          <h1 className="home-title">📝 Reporter 2.0</h1>
          <span className="home-subtitle">ДСТУ + ЛНУ ім. Івана Франка</span>
        </div>
        <div className="home-header__right">
          <div className="home-student-badge">
            <span className="home-student-badge__text">
              {globalSettings.studentName || 'Студент'}
              {globalSettings.studentGroup ? ` · ${globalSettings.studentGroup}` : ''}
            </span>
          </div>
          <button className="btn btn--secondary" onClick={onOpenSettings}>
            ⚙️ Налаштування
          </button>
        </div>
      </div>

      {/* Spaces */}
      <div className="home-content">
        <div className="home-section-header">
          <h2 className="home-section-title">Предмети</h2>
          <button className="btn btn--primary" onClick={() => setShowNewSpace(true)}>
            + Додати предмет
          </button>
        </div>

        {spaces.length === 0 && (
          <div className="home-empty">
            <div className="home-empty__icon">📚</div>
            <p>Поки що немає жодного предмету.</p>
            <p>Натисніть «+ Додати предмет» щоб почати.</p>
          </div>
        )}

        <div className="spaces-grid">
          {spaces.map(space => (
            <div key={space.id} className={`space-card ${expandedSpaceId === space.id ? 'space-card--expanded' : ''}`}>
              <div className="space-card__header" onClick={() =>
                setExpandedSpaceId(expandedSpaceId === space.id ? null : space.id)
              }>
                <div className="space-card__info">
                  <h3 className="space-card__name">{space.courseName}</h3>
                  <p className="space-card__teacher">
                    {space.teacherTitle} {space.teacherName}
                  </p>
                  <p className="space-card__count">
                    {space.reports.length} {pluralReports(space.reports.length)}
                  </p>
                </div>
                <div className="space-card__actions">
                  <button
                    className="btn-icon"
                    onClick={e => { e.stopPropagation(); handleDeleteSpace(space.id); }}
                    title="Видалити предмет"
                  >🗑️</button>
                  <span className="space-card__chevron">
                    {expandedSpaceId === space.id ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {expandedSpaceId === space.id && (
                <div className="space-card__reports">
                  {space.reports.map(report => (
                    <div
                      key={report.id}
                      className={`report-item${report.isDone ? ' report-item--done' : ''}`}
                      onClick={() => onOpenReport(space.id, report.id)}
                    >
                      <span className="report-item__num">Лаб. #{report.labNumber}</span>
                      <span className="report-item__topic">
                        {report.topic || <em>без теми</em>}
                      </span>
                      <button
                        className={`btn-icon${report.isDone ? ' btn-icon--done' : ''}`}
                        onClick={e => { e.stopPropagation(); handleToggleReportDone(space.id, report.id); }}
                        title={report.isDone ? 'Позначити як невиконаний' : 'Позначити як виконаний'}
                      >{report.isDone ? '✅' : '☐'}</button>
                      <button
                        className="btn-icon"
                        onClick={e => { e.stopPropagation(); handleDeleteReport(space.id, report.id); }}
                        title="Видалити звіт"
                      >✕</button>
                    </div>
                  ))}
                  <button
                    className="btn-add"
                    onClick={e => { e.stopPropagation(); handleAddReport(space.id); }}
                  >
                    + Новий звіт
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* New Space Modal */}
      {showNewSpace && (
        <div className="modal-overlay" onClick={() => setShowNewSpace(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal__title">Новий предмет</h2>

            <div className="modal__body">
              <div className="field-row">
                <label>Назва курсу *</label>
                <input
                  type="text"
                  value={newCourseName}
                  onChange={e => setNewCourseName(e.target.value)}
                  placeholder="Цифрова обробка інформації"
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && handleCreateSpace()}
                />
              </div>
              <div className="field-group field-group--row">
                <div className="field-row" style={{ flex: '0 0 110px' }}>
                  <label>Звання</label>
                  <input
                    type="text"
                    value={newTeacherTitle}
                    onChange={e => setNewTeacherTitle(e.target.value)}
                    placeholder="Асист."
                  />
                </div>
                <div className="field-row" style={{ flex: 1 }}>
                  <label>Викладач *</label>
                  <input
                    type="text"
                    value={newTeacherName}
                    onChange={e => setNewTeacherName(e.target.value)}
                    placeholder="Прізвище Ім'я"
                    onKeyDown={e => e.key === 'Enter' && handleCreateSpace()}
                  />
                </div>
              </div>
            </div>

            <div className="modal__footer">
              <button className="btn btn--secondary" onClick={() => setShowNewSpace(false)}>
                Скасувати
              </button>
              <button
                className="btn btn--primary"
                onClick={handleCreateSpace}
                disabled={!newCourseName.trim()}
              >
                Створити
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function pluralReports(n: number): string {
  if (n % 10 === 1 && n % 100 !== 11) return 'звіт';
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'звіти';
  return 'звітів';
}
