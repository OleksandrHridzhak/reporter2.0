import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  convertInchesToTwip,
} from 'docx';
import { saveAs } from 'file-saver';
import type { ReportData } from '../types/report';

const FONT = 'Times New Roman';
const FONT_SIZE = 28; // 14pt in half-points
const HEADING_SIZE = 28; // 14pt
const INDENT = convertInchesToTwip(1.25); // DSTU: 1.25cm paragraph indent
const LINE_SPACING = { line: 360, lineRule: 'auto' as const }; // 1.5 line spacing

function makeHeading(text: string, level: 1 | 2 | 3 = 1): Paragraph {
  return new Paragraph({
    text,
    heading: level === 1 ? HeadingLevel.HEADING_1 : level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3,
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 120, ...LINE_SPACING },
    style: `Heading${level}`,
  });
}

function makeBody(text: string, indent = true): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: FONT_SIZE })],
    alignment: AlignmentType.BOTH,
    spacing: { before: 0, after: 0, ...LINE_SPACING },
    indent: indent ? { firstLine: INDENT } : undefined,
  });
}

function makeCentered(text: string, bold = false, size?: number): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: size ?? FONT_SIZE, bold })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 0, ...LINE_SPACING },
  });
}

function makeRight(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: FONT_SIZE })],
    alignment: AlignmentType.RIGHT,
    spacing: { before: 0, after: 0, ...LINE_SPACING },
  });
}

function makeEmpty(): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: '', font: FONT, size: FONT_SIZE })],
    spacing: { before: 0, after: 0, ...LINE_SPACING },
  });
}

export async function exportToDocx(report: ReportData, filename = 'звіт'): Promise<void> {
  const { titlePage, abstract, workProgress, conclusion, references } = report;

  const titleSection = [
    makeEmpty(),
    makeEmpty(),
    makeCentered(titlePage.university, false, 24),
    makeEmpty(),
    makeCentered(titlePage.faculty),
    makeCentered(titlePage.department),
    makeEmpty(),
    makeEmpty(),
    makeEmpty(),
    makeCentered(titlePage.workType, true, 32),
    makeCentered(titlePage.subject),
    makeCentered(`Лабораторна робота ${titlePage.labNumber}`),
    makeCentered(titlePage.topic),
    makeEmpty(),
    makeEmpty(),
    makeEmpty(),
    makeRight(`Виконав: ${titlePage.studentName}`),
    makeRight(`Група: ${titlePage.group}`),
    makeRight(`Перевірив: ${titlePage.teacherName}`),
    makeEmpty(),
    makeEmpty(),
    makeEmpty(),
    makeCentered(`${titlePage.city} – ${titlePage.year}`),
  ];

  const abstractSection = [
    makeHeading('АНОТАЦІЯ'),
    makeBody(`Мета роботи: ${abstract.purpose}`),
    makeBody('Завдання:'),
    ...abstract.tasks.map((t, i) => makeBody(`${i + 1}. ${t}`)),
    makeBody(`Засоби виконання: ${abstract.tools}`),
    makeEmpty(),
  ];

  const progressSection = [
    makeHeading('ХІД РОБОТИ'),
    ...workProgress.steps.flatMap((step, i) => [
      makeHeading(`${i + 1}. ${step.title}`, 2),
      ...step.content.split('\n').filter(Boolean).map(line => makeBody(line)),
      makeEmpty(),
    ]),
  ];

  const conclusionSection = [
    makeHeading('ВИСНОВКИ'),
    ...conclusion.content.split('\n').filter(Boolean).map(line => makeBody(line)),
    makeEmpty(),
  ];

  const referencesSection = [
    makeHeading('СПИСОК ВИКОРИСТАНИХ ДЖЕРЕЛ'),
    ...references.items.filter(Boolean).map((ref, i) => makeBody(`${i + 1}. ${ref}`)),
  ];

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: FONT, size: FONT_SIZE },
          paragraph: { spacing: LINE_SPACING },
        },
      },
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          run: { font: FONT, size: HEADING_SIZE, bold: true },
          paragraph: { alignment: AlignmentType.CENTER, spacing: { before: 240, after: 120 } },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          run: { font: FONT, size: HEADING_SIZE, bold: true },
          paragraph: { alignment: AlignmentType.LEFT, spacing: { before: 240, after: 120 } },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.98),    // 25mm
              right: convertInchesToTwip(0.59),   // 15mm
              bottom: convertInchesToTwip(0.98),  // 25mm
              left: convertInchesToTwip(1.18),    // 30mm
            },
          },
        },
        children: [
          ...titleSection,
          ...abstractSection,
          ...progressSection,
          ...conclusionSection,
          ...referencesSection,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${filename}.docx`);
}
