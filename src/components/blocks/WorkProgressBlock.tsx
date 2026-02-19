import React, { useRef } from 'react';
import type { WorkProgressData, WorkProgressItem, LabReport } from '../../types/report';
import { AiBlockButton } from '../AiBlockButton';

interface Props {
  data: WorkProgressData;
  onChange: (data: WorkProgressData) => void;
  isActive: boolean;
  onActivate: () => void;
  apiKey: string;
  report: LabReport;
}

type AttachType = 'code' | 'image';

export const WorkProgressBlock: React.FC<Props> = ({ data, onChange, isActive, onActivate, apiKey, report }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingItemIdRef = useRef<string | null>(null);

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

  const toggleAttach = (item: WorkProgressItem, type: AttachType) => {
    if (type === 'code') {
      // toggle code snippet: if present remove, if absent add empty
      updateItem(item.id, { itemCode: item.itemCode !== undefined ? undefined : '' });
    } else {
      // toggle image: if present remove, if absent open file picker
      if (item.imageBase64 !== undefined) {
        updateItem(item.id, { imageBase64: undefined });
      } else {
        pendingItemIdRef.current = item.id;
        fileInputRef.current?.click();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const id   = pendingItemIdRef.current;
    if (!file || !id) return;

    // Validate MIME type
    if (!file.type.startsWith('image/')) {
      alert('Будь ласка, оберіть файл зображення (PNG, JPEG, GIF тощо).');
      e.target.value = '';
      pendingItemIdRef.current = null;
      return;
    }
    // Validate file size (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Зображення завелике. Максимальний розмір — 5 МБ.');
      e.target.value = '';
      pendingItemIdRef.current = null;
      return;
    }

    const reader = new FileReader();
    reader.onload = ev => {
      updateItem(id, { imageBase64: ev.target?.result as string });
    };
    reader.onerror = () => {
      alert('Не вдалося прочитати файл. Спробуйте інший.');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
    pendingItemIdRef.current = null;
  };

  return (
    <div className={`block ${isActive ? 'block--active' : ''}`} onClick={onActivate}>
      <div className="block__header">
        <h2 className="block__title">🔧 Хід роботи</h2>
        <AiBlockButton
          blockType="workProgress"
          report={report}
          apiKey={apiKey}
          onApply={text => {
            const lines = text.split('\n').filter(Boolean);
            onChange({
              items: lines.map((line, i) => ({
                id: (Date.now() + i).toString(),
                text: line.replace(/^\d+\.\s*/, ''),
              })),
            });
          }}
        />
      </div>
      <div className="block__body">
        <div className="progress-list">
          {data.items.map((item, i) => (
            <div key={item.id} className="progress-item-wrap">
              {/* Main row */}
              <div className="progress-item">
                <span className="progress-num">{i + 1}.</span>
                <input
                  type="text"
                  className="progress-text-input"
                  value={item.text}
                  onChange={e => updateItem(item.id, { text: e.target.value })}
                  placeholder="Текст пункту..."
                  onClick={e => e.stopPropagation()}
                />
                {/* Attachment toggles */}
                <button
                  className={`btn-attach ${item.itemCode !== undefined ? 'btn-attach--active' : ''}`}
                  title={item.itemCode !== undefined ? 'Прибрати код' : 'Додати код'}
                  onClick={e => { e.stopPropagation(); toggleAttach(item, 'code'); }}
                >{'{}'}</button>
                <button
                  className={`btn-attach ${item.imageBase64 !== undefined ? 'btn-attach--active' : ''}`}
                  title={item.imageBase64 !== undefined ? 'Прибрати фото' : 'Додати фото'}
                  onClick={e => { e.stopPropagation(); toggleAttach(item, 'image'); }}
                >🖼</button>
                {data.items.length > 1 && (
                  <button
                    className="btn-icon"
                    onClick={e => { e.stopPropagation(); removeItem(item.id); }}
                    title="Видалити пункт"
                  >✕</button>
                )}
              </div>

              {/* Optional code */}
              {item.itemCode !== undefined && (
                <textarea
                  className="progress-code-input code-textarea"
                  value={item.itemCode}
                  rows={4}
                  placeholder="// код..."
                  onChange={e => updateItem(item.id, { itemCode: e.target.value })}
                  onClick={e => e.stopPropagation()}
                />
              )}

              {/* Optional image */}
              {item.imageBase64 !== undefined && (
                <div className="progress-image-wrap">
                  <img
                    src={item.imageBase64}
                    alt={`Рис. до пункту ${i + 1}`}
                    className="progress-image"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <button className="btn-add" onClick={e => { e.stopPropagation(); addItem(); }}>
          + Додати пункт
        </button>

        {/* Hidden file input for image upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};
