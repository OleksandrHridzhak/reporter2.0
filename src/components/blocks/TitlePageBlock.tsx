import React from 'react';
import type { TitlePageData } from '../../types/report';

interface Props {
  data: TitlePageData;
  onChange: (data: TitlePageData) => void;
  isActive: boolean;
  onActivate: () => void;
}

export const TitlePageBlock: React.FC<Props> = ({ data, onChange, isActive, onActivate }) => {
  const set = (key: keyof TitlePageData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...data, [key]: e.target.value });

  return (
    <div className={`block ${isActive ? 'block--active' : ''}`} onClick={onActivate}>
      <div className="block__header">
        <h2 className="block__title">📄 Титульна сторінка</h2>
      </div>
      <div className="block__body">

        {/* Static info preview */}
        <div className="title-preview">
          <div className="title-preview__static">Міністерство освіти і науки України</div>
          <div className="title-preview__static">Львівський національний університет імені Івана Франка</div>
        </div>

        <div className="field-row">
          <label>Факультет</label>
          <input type="text" value={data.faculty} onChange={set('faculty')}
            placeholder="Факультет електроніки та комп'ютерних технологій" />
        </div>

        <div className="field-group">
          <div className="field-row field-row--inline">
            <label>ЛАБОРАТОРНА РОБОТА №</label>
            <input type="text" value={data.labNumber} onChange={set('labNumber')}
              placeholder="6" className="input--short" />
          </div>
        </div>

        <div className="field-row">
          <label>з курсу</label>
          <input type="text" value={data.course} onChange={set('course')}
            placeholder="Цифрова обробка інформації" />
        </div>

        <div className="field-row">
          <label>Тема</label>
          <input type="text" value={data.topic} onChange={set('topic')}
            placeholder="Кількісна оцінка інформації" />
        </div>

        <div className="title-divider" />

        <div className="title-preview__label">Виконав:</div>
        <div className="field-row">
          <label>Група</label>
          <input type="text" value={data.studentGroup} onChange={set('studentGroup')}
            placeholder="ФЕІ-33" />
        </div>
        <div className="field-row">
          <label>Студент</label>
          <input type="text" value={data.studentName} onChange={set('studentName')}
            placeholder="Прізвище Ім'я" />
        </div>

        <div className="title-preview__label">Перевірив:</div>
        <div className="field-group field-group--row">
          <div className="field-row" style={{ flex: '0 0 110px' }}>
            <label>Звання</label>
            <input type="text" value={data.teacherTitle} onChange={set('teacherTitle')}
              placeholder="Асист." />
          </div>
          <div className="field-row" style={{ flex: 1 }}>
            <label>Викладач</label>
            <input type="text" value={data.teacherName} onChange={set('teacherName')}
              placeholder="Прізвище Ім'я" />
          </div>
        </div>

        <div className="field-group field-group--row">
          <div className="field-preview-static">Львів</div>
          <div className="field-row" style={{ flex: '0 0 80px' }}>
            <label>Рік</label>
            <input type="text" value={data.year} onChange={set('year')}
              placeholder="2025" />
          </div>
        </div>

      </div>
    </div>
  );
};
