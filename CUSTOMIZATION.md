# Reporter 2.0 – Кастомізація шаблону

Цей документ пояснює, як змінити форматування DOCX-документу та зовнішній вигляд застосунку.

---

## 1. Форматування DOCX-документу

Весь шаблон документу знаходиться у файлі [`src/utils/docxExport.ts`](src/utils/docxExport.ts).

### 1.1 Шрифт і розмір тексту

```ts
// src/utils/docxExport.ts, рядки 14–17

const FONT      = 'Times New Roman'; // Шрифт основного тексту (ДСТУ)
const FONT_SIZE = 28;                // 14 pt (в half-points: pt × 2)
const CODE_FONT = 'Courier New';     // Шрифт для коду (Додаток)
const CODE_SIZE = 24;                // 12 pt
```

Щоб змінити шрифт на **Arial** розміром **12 pt**:

```ts
const FONT      = 'Arial';
const FONT_SIZE = 24; // 12 × 2
```

> ℹ️ Розміри шрифтів у `docx` вказуються в **half-points** (подвійних пунктах).
> Формула: `розмір_у_pt × 2`. Наприклад, 14 pt → 28.

---

### 1.2 Міжрядковий інтервал

```ts
const LINE_SPACING = { line: 360, lineRule: 'auto' as const }; // 1.5 інтервал (ДСТУ)
```

| Значення `line` | Інтервал |
|-----------------|----------|
| `240`           | 1.0 (одинарний) |
| `276`           | 1.15 |
| `360`           | 1.5 (ДСТУ, **поточне**) |
| `480`           | 2.0 (подвійний) |

---

### 1.3 Поля сторінки

```ts
// Поля за ДСТУ (у функції convertInchesToTwip)
const MARGIN_LEFT   = convertInchesToTwip(1.18);  // 30 мм (ліве)
const MARGIN_RIGHT  = convertInchesToTwip(0.59);  // 15 мм (праве)
const MARGIN_TOP    = convertInchesToTwip(0.98);  // 25 мм (верхнє)
const MARGIN_BOTTOM = convertInchesToTwip(0.98);  // 25 мм (нижнє)
```

Щоб змінити поле, замініть числа (в дюймах):
- `1 дюйм ≈ 25.4 мм`
- Формула: мм ÷ 25.4 = дюйми

Наприклад, **40 мм** ліве поле: `convertInchesToTwip(1.575)`

---

### 1.4 Відступ першого рядка (абзацний відступ)

```ts
const INDENT = convertInchesToTwip(0.492); // ≈ 1.25 см
```

Щоб змінити відступ на **1.5 см**: `convertInchesToTwip(0.591)`

---

### 1.5 Заголовки (Хід роботи, Висновки…)

Заголовки рівня 1 — центровані та жирні. Заголовки рівня 2 — ліворуч.

```ts
// Відступ до/після заголовку (в twips, 1 pt = 20 twips)
const HEADING_BEFORE = 240; // 12 pt перед заголовком
const HEADING_AFTER  = 120; // 6 pt після заголовку
```

Щоб зробити заголовок **курсивом**, знайдіть функцію `makeHeading` і додайте `italics: true`:

```ts
function makeHeading(text: string, level: 1 | 2 = 1): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: FONT_SIZE, bold: true, italics: true })],
    // ...
  });
}
```

---

### 1.6 Титульна сторінка

Структура титулки задається масивом `titleSection` у функції `exportToDocx`.

Щоб змінити текст "Міністерство освіти і науки України":

```ts
// Знайдіть у exportToDocx:
makeCentered('Міністерство освіти і науки України'),
// Замініть на свій текст:
makeCentered('Міністерство освіти і науки України'),
```

Щоб **прибрати рядок** (наприклад, назву міністерства) — просто видаліть відповідний рядок з масиву.

Щоб **додати рядок** після факультету:

```ts
makeCentered(global.faculty),
makeCentered('Кафедра програмування'), // ← новий рядок
```

---

### 1.7 Формат "Хід роботи"

Поточний формат — нумерований список без пустих рядків між пунктами:

```ts
workProgress.items.forEach((item, i) => {
  if (item.text.trim()) {
    children.push(makeBody(`${i + 1}. ${item.text}`, false));
  }
});
```

Щоб додати **пустий рядок між пунктами**:

```ts
workProgress.items.forEach((item, i) => {
  if (item.text.trim()) {
    children.push(makeBody(`${i + 1}. ${item.text}`, false));
    children.push(makeEmpty()); // ← пустий рядок
  }
});
```

---

## 2. Стилі застосунку (UI)

Весь CSS знаходиться у [`src/App.css`](src/App.css).

### 2.1 CSS-змінні (кольори, розміри)

На початку файлу є блок `:root { ... }` з усіма кольорами:

```css
:root {
  --primary:       #1a56db;  /* Основний синій колір (кнопки, акценти) */
  --primary-hover: #1e429f;  /* Синій при hover */
  --bg:            #f8fafc;  /* Фон сторінки */
  --bg-white:      #ffffff;  /* Фон блоків */
  --bg-panel:      #1e293b;  /* Фон лівої панелі (чат) */
  --text:          #1e293b;  /* Основний текст */
  --text-light:    #64748b;  /* Сірий текст */
  --border:        #e2e8f0;  /* Колір рамок */
  --border-active: #1a56db;  /* Колір рамки активного блоку */
  --accent:        #0ea5e9;  /* Блакитний акцент */
  --error:         #ef4444;  /* Червоний для помилок */
  --radius:        8px;      /* Скруглення кутів */
  --chat-width:    360px;    /* Ширина панелі чату */
}
```

Наприклад, щоб змінити акцентний колір на **зелений**:

```css
--primary:       #059669;
--primary-hover: #047857;
--border-active: #059669;
```

### 2.2 Ширина панелі чату

```css
--chat-width: 360px; /* Змініть на бажану ширину */
```

### 2.3 Шрифт інтерфейсу

```css
:root {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
```

Замініть на будь-який системний або Google Font.

### 2.4 Код-редактор (Додаток)

```css
.code-textarea {
  font-family: 'Courier New', 'Consolas', monospace !important;
  font-size: 13px !important;
  background: #1e1e1e !important;  /* Темний фон (VS Code style) */
  color: #d4d4d4 !important;       /* Колір тексту */
}
```

Щоб зробити світлий код-редактор:

```css
.code-textarea {
  background: #f8f9fa !important;
  color: #212529 !important;
  border-color: #dee2e6 !important;
}
```

---

## 3. Структура файлів

```
src/
├── types/report.ts          # Типи даних (GlobalSettings, Space, LabReport, ...)
├── utils/
│   ├── defaults.ts          # Значення за замовчуванням
│   └── docxExport.ts        # ← ШАБЛОН DOCX (шрифти, поля, форматування)
├── components/
│   ├── HomeScreen.tsx        # Головне меню (список предметів)
│   ├── GlobalSettingsModal.tsx  # Налаштування студента
│   ├── ChatPanel.tsx         # AI-чат (Gemini)
│   ├── ReportEditor.tsx      # Редактор звіту
│   └── blocks/
│       ├── TitlePageBlock.tsx
│       ├── AbstractBlock.tsx
│       ├── WorkProgressBlock.tsx
│       ├── ConclusionBlock.tsx
│       ├── AppendixBlock.tsx
│       └── ReferencesBlock.tsx
└── App.css                   # ← СТИЛІ UI
```

---

## 4. Часті зміни

| Що змінити | Де змінити |
|------------|-----------|
| Шрифт у DOCX | `docxExport.ts` → `const FONT` |
| Поля сторінки у DOCX | `docxExport.ts` → `MARGIN_*` |
| Міжрядковий інтервал | `docxExport.ts` → `LINE_SPACING` |
| Колір кнопок в UI | `App.css` → `--primary` |
| Ширина чат-панелі | `App.css` → `--chat-width` |
| Факультет за замовчуванням | `defaults.ts` → `defaultGlobalSettings.faculty` |
| Заголовок "Виконав:" → "Виконала:" | `docxExport.ts` → `makeRight('Виконала:', true)` |
