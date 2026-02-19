/**
 * docxExport.ts – DOCX export for Reporter 2.0
 *
 * To customize the document template, see CUSTOMIZATION.md at the repo root.
 * Key style constants live at the top of this file.
 */
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  convertInchesToTwip,
  ImageRun,
} from 'docx';
import { saveAs } from 'file-saver';
import type { GlobalSettings, Space, LabReport } from '../types/report';

// ─── Typography ──────────────────────────────────────────────────────────────
const FONT       = 'Times New Roman'; // Main body font (DSTU)
const FONT_SIZE  = 28;                // 14 pt (in half-points)
const CODE_FONT  = 'Courier New';     // Font for code blocks (Appendix)
const CODE_SIZE  = 24;                // 12 pt

// ─── Spacing ─────────────────────────────────────────────────────────────────
const LINE_SPACING = { line: 360, lineRule: 'auto' as const }; // 1.5 line spacing (DSTU)
const INDENT       = convertInchesToTwip(0.492);               // 1.25 cm paragraph indent

// ─── Page margins (DSTU) ─────────────────────────────────────────────────────
const MARGIN_LEFT   = convertInchesToTwip(1.18);  // 30 mm
const MARGIN_RIGHT  = convertInchesToTwip(0.59);  // 15 mm
const MARGIN_TOP    = convertInchesToTwip(0.98);  // 25 mm
const MARGIN_BOTTOM = convertInchesToTwip(0.98);  // 25 mm

// ─── Heading spacing ─────────────────────────────────────────────────────────
const HEADING_BEFORE = 240; // twips before heading paragraph
const HEADING_AFTER  = 120; // twips after heading paragraph

// ─── Paragraph helpers ───────────────────────────────────────────────────────
function makeHeading(text: string, level: 1 | 2 = 1): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: FONT_SIZE, bold: true,color: '000000' })],
    heading: level === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
    alignment: level === 1 ? AlignmentType.CENTER : AlignmentType.LEFT,
    spacing: { before: HEADING_BEFORE, after: HEADING_AFTER, ...LINE_SPACING },
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
    children: [new TextRun({ text, font: CODE_FONT, size: CODE_SIZE })],
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

/** Converts a base64 data URL to a DOCX image paragraph, preserving aspect ratio (max width 530pt). */
function makeImageParagraph(dataUrl: string): Paragraph | null {
  try {
    const [header, base64] = dataUrl.split(',');
    if (!base64) return null;
    const mimeMatch = header.match(/data:([^;]+);/);
    const mimeType  = (mimeMatch?.[1] ?? 'image/png') as 'image/png' | 'image/jpeg' | 'image/gif';
    const binary    = atob(base64);
    const bytes     = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

    // Use fixed-ratio: max 530pt wide × proportional height (default 16:9 safe estimate).
    // Exact dimensions are not available synchronously in DOCX export; the exported image
    // will be embedded at these dimensions. Users can resize in Word if needed.
    const MAX_WIDTH  = 530;
    const MAX_HEIGHT = 400;

    return new Paragraph({
      children: [
        new ImageRun({
          data: bytes.buffer,
          transformation: { width: MAX_WIDTH, height: MAX_HEIGHT },
          type: mimeType === 'image/jpeg' ? 'jpg' : 'png',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 120 },
    });
  } catch {
    return null;
  }
}

// ─── Main export function ─────────────────────────────────────────────────────
export async function exportToDocx(
  global: GlobalSettings,
  space: Space,
  report: LabReport,
  filename = 'звіт'
): Promise<void> {
  const { abstract, workProgress, conclusion, appendix, enabledBlocks } = report;
  const year = new Date().getFullYear().toString();

  // ── Title page ──────────────────────────────────────────────────────────────
  const titleSection: Paragraph[] = [
    makeCentered('Міністерство освіти і науки України'),
    makeCentered('Львівський національний університет імені Івана Франка'),
    makeCentered(global.faculty),
    makeEmpty(),
    makeEmpty(),
    makeEmpty(),
        makeEmpty(),
    makeEmpty(),
        makeEmpty(),
    makeEmpty(),
    makeCentered(`ЛАБОРАТОРНА РОБОТА № ${report.labNumber}`, false),
    ...(space.courseName ? [makeCentered(`з курсу "${space.courseName}"`)] : []),
    ...(report.topic     ? [makeCentered(`"${report.topic}"`)]            : []),
    makeEmpty(),
    makeEmpty(),
    makeEmpty(),
        makeEmpty(),
    makeEmpty(),
        makeEmpty(),
    makeEmpty(),
    makeRight('Виконав:', false),
    makeRight(`Ст. ${global.studentGroup}`),
    makeRight(global.studentName),
    makeRight('Перевірив:', false),
    makeRight(`${space.teacherTitle} ${space.teacherName}`),
    makeEmpty(),
    makeEmpty(),
    makeCentered(`Львів ${year}`),
  ];

  const children: Paragraph[] = [...titleSection];

  // ── Мета роботи ────────────────────────────────────────────────────────────
  if (enabledBlocks.includes('abstract') && abstract.content.trim()) {
    children.push(makeEmpty());
    children.push(new Paragraph({
      children: [
        new TextRun({ text: 'Мета роботи: ', font: FONT, size: FONT_SIZE, bold: true }),
        new TextRun({ text: abstract.content, font: FONT, size: FONT_SIZE })
      ],
      alignment: AlignmentType.BOTH,
      spacing: { before: 0, after: 0, ...LINE_SPACING },
      indent: { firstLine: INDENT },
    }));
    children.push(makeEmpty());
  }

  // ── Хід роботи ─────────────────────────────────────────────────────────────
  // Format: "1. text" — one paragraph per item, no empty lines between items
  if (enabledBlocks.includes('workProgress') && workProgress.items.length > 0) {
    children.push(makeHeading('Хід роботи'));
    for (const [i, item] of workProgress.items.entries()) {
      if (item.text.trim()) {
        children.push(makeBody(`${i + 1}. ${item.text}`, false));
      }
      // Optional code snippet under the item
      if (item.itemCode !== undefined && item.itemCode.trim()) {
        item.itemCode.split('\n').forEach(line => {
          children.push(makeMonospace(line));
        });
      }
      // Optional image under the item
      if (item.imageBase64) {
        try {
          const imgPara = makeImageParagraph(item.imageBase64);
          if (imgPara) children.push(imgPara);
        } catch {
          // skip if image cannot be embedded
        }
      }
    }
    children.push(makeEmpty());
  }

  // ── Висновок ───────────────────────────────────────────────────────────────
  // Inline format like "Мета роботи:", not a standalone centered heading
  if (enabledBlocks.includes('conclusion') && conclusion.content.trim()) {
    children.push(makeEmpty());
    children.push(new Paragraph({
      children: [
        new TextRun({ text: 'Висновок: ', font: FONT, size: FONT_SIZE, bold: true }),
        new TextRun({ text: conclusion.content, font: FONT, size: FONT_SIZE })
      ],
      alignment: AlignmentType.BOTH,
      spacing: { before: 0, after: 0, ...LINE_SPACING },
      indent: { firstLine: INDENT },
    }));
    children.push(makeEmpty());
  }

  // ── Додаток ────────────────────────────────────────────────────────────────
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

  // ── Build document ─────────────────────────────────────────────────────────
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
              top:    MARGIN_TOP,
              right:  MARGIN_RIGHT,
              bottom: MARGIN_BOTTOM,
              left:   MARGIN_LEFT,
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
