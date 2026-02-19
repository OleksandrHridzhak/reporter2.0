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
const LINE_SPACING = { line: 360, lineRule: 'auto' as const }; // 1.5 line spacing
const INDENT = convertInchesToTwip(0.49); // 1.25cm first-line indent

function makeHeading(text: string, level: 1 | 2 = 1): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: FONT_SIZE, bold: true })],
    heading: level === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
    alignment: level === 1 ? AlignmentType.CENTER : AlignmentType.LEFT,
    spacing: { before: 240, after: 120, ...LINE_SPACING },
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

function makeRight(text: string, bold = false): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: FONT_SIZE, bold })],
    alignment: AlignmentType.RIGHT,
    spacing: { before: 0, after: 0, ...LINE_SPACING },
  });
}

function makeMonospace(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, font: 'Courier New', size: 24 })],
    alignment: AlignmentType.LEFT,
    spacing: { before: 0, after: 0, line: 240, lineRule: 'auto' },
  });
}

function makeEmpty(): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: '', font: FONT, size: FONT_SIZE })],
    spacing: { before: 0, after: 0, ...LINE_SPACING },
  });
}

export async function exportToDocx(report: ReportData, filename = 'звіт'): Promise<void> {
  const { titlePage, enabledBlocks, abstract, workProgress, conclusion, appendix, references } = report;

  // Title page matching the exact LNU format
  const titleSection: Paragraph[] = [
    makeCentered('Міністерство освіти і науки України'),
    makeCentered('Львівський національний університет імені Івана Франка'),
    makeCentered(titlePage.faculty),
    makeEmpty(),
    makeEmpty(),
    makeCentered(`ЛАБОРАТОРНА РОБОТА № ${titlePage.labNumber}`, true),
    ...(titlePage.course ? [makeCentered(`з курсу "${titlePage.course}"`)] : []),
    ...(titlePage.topic ? [makeCentered(`"${titlePage.topic}"`)] : []),
    makeEmpty(),
    makeEmpty(),
    makeRight('Виконав:', true),
    makeRight(`Ст. ${titlePage.studentGroup}`),
    makeRight(titlePage.studentName),
    makeRight('Перевірив:', true),
    makeRight(`${titlePage.teacherTitle} ${titlePage.teacherName}`),
    makeEmpty(),
    makeEmpty(),
    makeCentered(`Львів ${titlePage.year}`),
  ];

  const children: Paragraph[] = [...titleSection];

  if (enabledBlocks.includes('abstract') && abstract.content.trim()) {
    children.push(makeEmpty());
    children.push(makeBody(`Мета роботи: ${abstract.content}`));
    children.push(makeEmpty());
  }

  if (enabledBlocks.includes('workProgress') && workProgress.steps.length > 0) {
    children.push(makeHeading('Хід роботи'));
    workProgress.steps.forEach((step, i) => {
      const stepLabel = step.title.trim() ? `${i + 1}. ${step.title}` : `${i + 1}.`;
      if (step.title.trim()) {
        children.push(makeBody(stepLabel, false));
      }
      step.content.split('\n').filter(Boolean).forEach(line => {
        children.push(makeBody(line));
      });
    });
    children.push(makeEmpty());
  }

  if (enabledBlocks.includes('conclusion') && conclusion.content.trim()) {
    children.push(makeHeading('Висновки'));
    conclusion.content.split('\n').filter(Boolean).forEach(line => {
      children.push(makeBody(line));
    });
    children.push(makeEmpty());
  }

  if (enabledBlocks.includes('appendix')) {
    children.push(makeHeading('Додаток'));
    if (appendix.title.trim()) {
      children.push(makeBody(appendix.title + ':'));
    }
    appendix.code.split('\n').forEach(line => {
      children.push(makeMonospace(line));
    });
    children.push(makeEmpty());
  }

  if (enabledBlocks.includes('references') && references.items.filter(Boolean).length > 0) {
    children.push(makeHeading('Список використаних джерел'));
    references.items.filter(Boolean).forEach((ref, i) => {
      children.push(makeBody(`${i + 1}. ${ref}`));
    });
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: FONT, size: FONT_SIZE },
          paragraph: { spacing: LINE_SPACING },
        },
      },
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
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${filename}.docx`);
}
