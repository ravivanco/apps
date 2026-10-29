// Convierte los manuales Markdown del repo en un único .docx.
// Uso: node md2docx.js <salida.docx> <manual1.md> <manual2.md> ...
const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, AlignmentType, LevelFormat, ExternalHyperlink,
  TableOfContents, PageBreak, Footer, PageNumber, Header,
} = require('docx');

const [out, ...inputs] = process.argv.slice(2);
const FONT = 'Calibri', MONO = 'Consolas';
const C = { primary: '1F4E79', accent: '2E75B6', codeBg: 'F3F4F6', codeBorder: 'D1D5DB',
            inlineBg: 'EEF0F3', headBg: '1F4E79', zebra: 'F5F8FC', noteBg: 'EAF2FB', muted: '6B7280' };
const PAGE_W = 11906, MARGIN = 1134, CONTENT_W = PAGE_W - 2 * MARGIN;
const INDENT = 400; // por nivel de lista

// ---------- inline ----------
function inline(text, base = {}) {
  const runs = [];
  const re = /(\*\*([^*]+)\*\*|`([^`]+)`|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\)|(https?:\/\/[^\s)|]+[^\s)|.,;:]))/g;
  let last = 0, m;
  const plain = (t, o = {}) => t && runs.push(new TextRun({ text: t, font: FONT, ...base, ...o }));
  while ((m = re.exec(text))) {
    plain(text.slice(last, m.index));
    if (m[2]) runs.push(...inline(m[2], { ...base, bold: true }));
    else if (m[3]) runs.push(new TextRun({ text: m[3], font: MONO, size: 19, ...base,
      shading: { type: ShadingType.CLEAR, color: 'auto', fill: C.inlineBg } }));
    else if (m[4]) runs.push(...inline(m[4], { ...base, italics: true }));
    else if (m[5]) plain(m[5]);
    else if (m[7]) runs.push(new ExternalHyperlink({ link: m[7], children: [
      new TextRun({ text: m[7], font: FONT, ...base, color: C.accent, underline: {} })] }));
    last = m.index + m[0].length;
  }
  plain(text.slice(last));
  return runs;
}

// ---------- bloques ----------
function codeBlock(lines, level) {
  const border = { style: BorderStyle.SINGLE, size: 4, color: C.codeBorder, space: 4 };
  const ind = level ? 360 + (level - 1) * INDENT + 80 : 120;
  return lines.map((l, i) => new Paragraph({
    children: [new TextRun({ text: l.length ? l : ' ', font: MONO, size: 18 })],
    shading: { type: ShadingType.CLEAR, color: 'auto', fill: C.codeBg },
    border: { top: border, bottom: border, left: border, right: border },
    indent: { left: ind, right: 120 },
    spacing: { before: i === 0 ? 80 : 0, after: i === lines.length - 1 ? 140 : 0, line: 260 },
    keepLines: true, keepNext: i < lines.length - 1,
  }));
}

function splitRow(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '')
    .split(/(?<!\\)\|/).map(c => c.trim().replace(/\\\|/g, '|'));
}

function table(rows) {
  const header = splitRow(rows[0]);
  const body = rows.slice(2).map(splitRow);
  const n = header.length;
  const len = Array(n).fill(4);
  [header, ...body].forEach(r => r.forEach((c, i) => {
    len[i] = Math.max(len[i], Math.min(c.replace(/[*`]/g, '').length, 60));
  }));
  const total = len.reduce((a, b) => a + b, 0);
  const widths = len.map(l => Math.max(900, Math.round(CONTENT_W * l / total)));
  widths[widths.length - 1] += CONTENT_W - widths.reduce((a, b) => a + b, 0);
  const b = { style: BorderStyle.SINGLE, size: 4, color: 'D9DEE5' };
  const borders = { top: b, bottom: b, left: b, right: b };
  const cell = (txt, i, opts) => new TableCell({
    width: { size: widths[i], type: WidthType.DXA }, borders,
    shading: opts.fill ? { type: ShadingType.CLEAR, color: 'auto', fill: opts.fill } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({ spacing: { before: 0, after: 0 },
      children: inline(txt, opts.head ? { bold: true, color: 'FFFFFF', size: 20 } : { size: 20 }) })],
  });
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: widths,
    rows: [
      new TableRow({ tableHeader: true, cantSplit: true,
        children: header.map((h, i) => cell(h, i, { head: true, fill: C.headBg })) }),
      ...body.map((r, ri) => new TableRow({ cantSplit: true,
        children: header.map((_, i) => cell(r[i] ?? '', i, { fill: ri % 2 ? C.zebra : undefined })) })),
    ],
  });
}

function note(text) {
  return new Paragraph({
    children: inline(text),
    shading: { type: ShadingType.CLEAR, color: 'auto', fill: C.noteBg },
    border: { left: { style: BorderStyle.SINGLE, size: 24, color: C.accent, space: 8 } },
    indent: { left: 200, right: 120 }, spacing: { before: 120, after: 160 },
  });
}

// ---------- parser ----------
let listInstance = 0;
function convert(md, children) {
  const lines = md.replace(/\r/g, '').split('\n');
  let inList = false, skipSection = false, i = 0;
  const endList = () => { inList = false; };

  while (i < lines.length) {
    const raw = lines[i];
    const indent = raw.match(/^ */)[0].length;
    const line = raw.trim();
    const level = Math.min(2, Math.floor(indent / 3));

    let h = raw.match(/^(#{1,3}) (.*)$/);
    if (h) {
      const depth = h[1].length;
      skipSection = depth === 2 && /^Índice/.test(h[2]);
      endList();
      if (!skipSection) {
        if (depth === 1) children.push(new Paragraph({ children: [new PageBreak()] }));
        children.push(new Paragraph({
          heading: [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3][depth - 1],
          children: [new TextRun({ text: h[2].replace(/[*`]/g, '') })] }));
      }
      i++; continue;
    }
    if (skipSection) { i++; continue; }
    if (!line || line === '---') { i++; continue; }

    if (line.startsWith('```')) {
      const block = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        block.push(lines[i].slice(Math.min(indent, lines[i].match(/^ */)[0].length)));
        i++;
      }
      i++;
      children.push(...codeBlock(block, indent ? level : 0));
      continue;
    }
    if (line.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) rows.push(lines[i].trim()), i++;
      endList();
      children.push(table(rows), new Paragraph({ spacing: { after: 80 }, children: [] }));
      continue;
    }
    if (line.startsWith('> ')) { endList(); children.push(note(line.slice(2))); i++; continue; }

    let num = line.match(/^(\d+)\. (.*)$/);
    if (num) {
      if (!inList && indent === 0) { listInstance++; inList = true; }
      children.push(new Paragraph({ numbering: { reference: 'num', level: 0, instance: listInstance },
        spacing: { before: 100, after: 60 }, children: inline(num[2]) }));
      i++; continue;
    }
    let bul = line.match(/^[-*] (.*)$/);
    if (bul) {
      const lv = indent ? Math.max(1, level) : 0;
      children.push(new Paragraph({ numbering: { reference: 'bul', level: lv },
        spacing: { before: 20, after: 40 }, children: inline(bul[1]) }));
      i++; continue;
    }
    // párrafo normal (o continuación dentro de una lista)
    if (indent === 0) endList();
    children.push(new Paragraph({
      indent: indent ? { left: 360 + Math.max(0, level - 1) * INDENT } : undefined,
      spacing: { before: 40, after: 100 }, children: inline(line) }));
    i++;
  }
}

// ---------- documento ----------
const today = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
const children = [
  new Paragraph({ spacing: { before: 3200 }, children: [] }),
  new Paragraph({ alignment: AlignmentType.LEFT, spacing: { after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 18, color: C.accent, space: 12 } },
    children: [new TextRun({ text: 'Manual de desarrollo', font: FONT, size: 64, bold: true, color: C.primary })] }),
  new Paragraph({ spacing: { after: 600 }, children: [new TextRun({
    text: 'Herramientas y frameworks, instalados paso a paso', font: FONT, size: 32, color: C.accent })] }),
  new Paragraph({ spacing: { after: 80 }, children: [new TextRun({
    text: 'Git · GitHub · Node.js · Python · VS Code · Claude Code', font: FONT, size: 22, color: C.muted })] }),
  new Paragraph({ spacing: { after: 80 }, children: [new TextRun({
    text: 'React · Next.js · Vue · Angular · Svelte · Astro · Expo · Flutter · Express · NestJS · FastAPI · Django · Laravel · Spring Boot · Electron · Tauri', font: FONT, size: 22, color: C.muted })] }),
  new Paragraph({ spacing: { before: 1600 }, children: [new TextRun({ text: today, font: FONT, size: 22, color: C.muted })] }),
  new Paragraph({ children: [new PageBreak()] }),
  new Paragraph({ spacing: { after: 240 }, children: [new TextRun({ text: 'Índice', font: FONT, size: 40, bold: true, color: C.primary })] }),
  new TableOfContents('Índice', { hyperlink: true, headingStyleRange: '1-2' }),
  new Paragraph({ spacing: { before: 200 }, children: [new TextRun({
    text: 'Si el índice aparece vacío: clic derecho sobre él → Actualizar campo → Actualizar toda la tabla.',
    font: FONT, size: 18, italics: true, color: C.muted })] }),
];
for (const f of inputs) convert(fs.readFileSync(f, 'utf8'), children);

const bulletLevels = [0, 1, 2].map(l => ({ level: l, format: LevelFormat.BULLET,
  text: ['•', '◦', '▪'][l], alignment: AlignmentType.LEFT,
  style: { paragraph: { indent: { left: 360 + l * 360, hanging: 260 } } } }));

const doc = new Document({
  creator: 'claude-setup', title: 'Manual de desarrollo',
  features: { updateFields: process.env.NO_UPDATE_FIELDS ? false : true },
  styles: {
    default: { document: { run: { font: FONT, size: 22 }, paragraph: { spacing: { line: 288 } } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 40, bold: true, color: C.primary, font: FONT },
        paragraph: { spacing: { before: 240, after: 240 }, keepNext: true, outlineLevel: 0,
          border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: C.accent, space: 6 } } } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 30, bold: true, color: C.primary, font: FONT },
        paragraph: { spacing: { before: 360, after: 140 }, keepNext: true, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 25, bold: true, color: C.accent, font: FONT },
        paragraph: { spacing: { before: 260, after: 100 }, keepNext: true, outlineLevel: 2 } },
    ],
  },
  numbering: { config: [
    { reference: 'num', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
      style: { run: { bold: true, color: C.accent }, paragraph: { indent: { left: 360, hanging: 360 } } } }] },
    { reference: 'bul', levels: bulletLevels },
  ] },
  sections: [{
    properties: { page: { size: { width: PAGE_W, height: 16838 },
      margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } }, titlePage: true },
    headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
      children: [new TextRun({ text: 'Manual de desarrollo', size: 16, color: C.muted, font: FONT })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ children: ['Página ', PageNumber.CURRENT, ' de ', PageNumber.TOTAL_PAGES],
        size: 16, color: C.muted, font: FONT })] })] }) },
    children,
  }],
});

Packer.toBuffer(doc).then(buf => { fs.writeFileSync(out, buf); console.log('OK', out, buf.length, 'bytes'); });
