import React from 'react';
import type { TitlePageData } from '../../types/report';

interface Props {
  data: TitlePageData;
  onChange: (data: TitlePageData) => void;
  isActive: boolean;
  onActivate: () => void;
}

const field = (label: string, value: string, key: keyof TitlePageData, onChange: (k: keyof TitlePageData, v: string) => void) => (
  <div className="field-row" key={key}>
    <label>{label}</label>
    <input
      type="text"
      value={value}
      onChange={e => onChange(key, e.target.value)}
      placeholder={label}
    />
  </div>
);

export const TitlePageBlock: React.FC<Props> = ({ data, onChange, isActive, onActivate }) => {
  const handleChange = (key: keyof TitlePageData, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className={`block ${isActive ? 'block--active' : ''}`} onClick={onActivate}>
      <div className="block__header">
        <h2 className="block__title">📄 Титульна сторінка</h2>
      </div>
      <div className="block__body">
        {field('Університет', data.university, 'university', handleChange)}
        {field('Факультет', data.faculty, 'faculty', handleChange)}
        {field('Кафедра', data.department, 'department', handleChange)}
        {field('Тип роботи', data.workType, 'workType', handleChange)}
        {field('Дисципліна', data.subject, 'subject', handleChange)}
        {field('Номер лабораторної', data.labNumber, 'labNumber', handleChange)}
        {field('Тема', data.topic, 'topic', handleChange)}
        {field("Ім'я студента", data.studentName, 'studentName', handleChange)}
        {field('Група', data.group, 'group', handleChange)}
        {field('Викладач', data.teacherName, 'teacherName', handleChange)}
        {field('Місто', data.city, 'city', handleChange)}
        {field('Рік', data.year, 'year', handleChange)}
      </div>
    </div>
  );
};
