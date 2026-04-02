import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  LevelFormat,
  BorderStyle,
  WidthType,
  ShadingType,
  VerticalAlign,
  TabStopType,
  TabStopPosition,
  ExternalHyperlink,
} from 'docx';
import { ResumeData, TemplateType } from '@/context/ResumeContext';

// ─── Dimensions (A4, 0.5" margins) ───────────────────────────────────────────
const PAGE_W = 11906;
const MARGIN = 720;
const CONTENT_W = PAGE_W - MARGIN * 2; // 10466 DXA

// Creative sidebar split ~38 / 62
const CREATIVE_LEFT = Math.round(CONTENT_W * 0.38);  // 3977
const CREATIVE_RIGHT = CONTENT_W - CREATIVE_LEFT;    // 6489

// Modern main/sidebar split ~65 / 35
const MODERN_MAIN = Math.round(CONTENT_W * 0.65);    // 6803
const MODERN_SIDE = CONTENT_W - MODERN_MAIN;          // 3663

// ─── Colours ─────────────────────────────────────────────────────────────────
const C = {
  black: '1a1a1a',
  darkCharcoal: '1f2937',
  midGray: '4b5563',
  lightGray: '9ca3af',
  veryLightGray: 'f3f4f6',
  white: 'ffffff',
  blue: '2563eb',
  lightBlue: 'dbeafe',
  blueDark: '1e3a5f',
} as const;

// ─── Borders ─────────────────────────────────────────────────────────────────
const noBorder = { style: BorderStyle.NONE, size: 0, color: 'auto' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const thinGray = { style: BorderStyle.SINGLE, size: 4, color: 'e5e7eb' };
const boldBlack = { style: BorderStyle.SINGLE, size: 12, color: C.black };
const thinBlue = { style: BorderStyle.SINGLE, size: 8, color: C.blue };

// ─── Bullet numbering config ──────────────────────────────────────────────────
const bulletNumbering = {
  config: [
    {
      reference: 'resumeBullets',
      levels: [
        {
          level: 0,
          format: LevelFormat.BULLET,
          text: '\u2022',
          alignment: AlignmentType.LEFT,
          style: {
            paragraph: { indent: { left: 360, hanging: 180 } },
          },
        },
      ],
    },
  ],
};

// ─── Parse AI-generated description into lines ────────────────────────────────
function descriptionLines(raw: string): string[] {
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

function isBullet(line: string) {
  return line.startsWith('* ') || line.startsWith('- ');
}
function bulletText(line: string) {
  return line.replace(/^[\*\-]\s+/, '');
}

// ─── Shared paragraph builders ────────────────────────────────────────────────

function emptyLine(spacingBefore = 0): Paragraph {
  return new Paragraph({ spacing: { before: spacingBefore } });
}

function sectionDivider(color = C.black): Paragraph {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color, space: 1 } },
    spacing: { before: 0, after: 80 },
  });
}

function descParagraphs(
  raw: string,
  options: { color?: string; size?: number; indent?: boolean } = {}
): Paragraph[] {
  const { color = C.midGray, size = 18, indent = false } = options;
  const lines = descriptionLines(raw);
  if (!lines.length) return [];

  return lines.map((line) => {
    if (isBullet(line)) {
      return new Paragraph({
        numbering: { reference: 'resumeBullets', level: 0 },
        children: [new TextRun({ text: bulletText(line), color, size, font: 'Arial' })],
        spacing: { after: 40 },
        indent: indent ? { left: 180 } : undefined,
      });
    }
    return new Paragraph({
      children: [new TextRun({ text: line, color, size, font: 'Arial' })],
      spacing: { after: 60 },
      indent: indent ? { left: 180 } : undefined,
    });
  });
}

// ─── Page / section properties ────────────────────────────────────────────────
const pageProps = {
  page: {
    size: { width: PAGE_W, height: 16838 },
    margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PROFESSIONAL TEMPLATE
// ═══════════════════════════════════════════════════════════════════════════════
function buildProfessional(data: ReturnType<typeof formatData>): Document {
  const { name, email, phone, location, portfolio, summary, experience, education, skills, projects, certifications, linkedIn, githubUrl } = data;

  const contactParts = [email, phone, location, portfolio].filter(Boolean).join('  •  ');

  function sectionHeader(title: string): Paragraph[] {
    return [
      emptyLine(160),
      new Paragraph({
        children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 20, font: 'Arial', color: C.black, characterSpacing: 80 })],
        spacing: { after: 0 },
      }),
      sectionDivider(),
    ];
  }

  const children: Paragraph[] = [
    // Name
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: name, bold: true, size: 52, font: 'Arial', color: C.black })],
      spacing: { after: 80 },
    }),
    // Contact row
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: contactParts, size: 18, font: 'Arial', color: C.midGray })],
      spacing: { after: 0 },
      border: { bottom: boldBlack },
    }),
    emptyLine(160),
  ];

  // Summary
  if (summary) {
    children.push(
      ...sectionHeader('Professional Summary'),
      new Paragraph({
        children: [new TextRun({ text: summary, size: 19, font: 'Arial', color: C.midGray })],
        spacing: { after: 0 },
      })
    );
  }

  // Experience
  if (experience.length) {
    children.push(...sectionHeader('Professional Experience'));
    for (const exp of experience) {
      children.push(
        new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun({ text: exp.position, bold: true, size: 22, font: 'Arial', color: C.black }),
            new TextRun({ text: `\t${exp.startDate} – ${exp.endDate}`, size: 18, font: 'Arial', color: C.midGray }),
          ],
          spacing: { before: 120, after: 40 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: exp.company, size: 19, font: 'Arial', color: C.black }),
            exp.location ? new TextRun({ text: `  •  ${exp.location}`, size: 19, font: 'Arial', color: C.midGray }) : new TextRun(''),
          ],
          spacing: { after: 60 },
        }),
        ...descParagraphs(exp.description, { indent: true }),
        emptyLine(40),
      );
    }
  }

  // Education
  if (education.length) {
    children.push(...sectionHeader('Education'));
    for (const edu of education) {
      children.push(
        new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun({ text: edu.school, bold: true, size: 22, font: 'Arial', color: C.black }),
            new TextRun({ text: `\t${edu.graduationDate}`, size: 18, font: 'Arial', color: C.midGray }),
          ],
          spacing: { before: 100, after: 40 },
        }),
        new Paragraph({
          children: [new TextRun({ text: `${edu.degree} in ${edu.fieldOfStudy}`, size: 19, font: 'Arial', color: C.midGray })],
          spacing: { after: edu.description ? 40 : 0 },
        }),
        ...(edu.description ? descParagraphs(edu.description, { indent: true }) : []),
      );
    }
  }

  // Skills
  if (skills.length) {
    children.push(...sectionHeader('Technical Skills'));
    // Group into rows of 3
    for (let i = 0; i < skills.length; i += 3) {
      const chunk = skills.slice(i, i + 3).join('   •   ');
      children.push(
        new Paragraph({
          children: [new TextRun({ text: chunk, size: 19, font: 'Arial', color: C.midGray })],
          spacing: { after: 60 },
        })
      );
    }
  }

  // Projects
  if (projects.length) {
    children.push(...sectionHeader('Projects'));
    for (const proj of projects) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: proj.name, bold: true, size: 22, font: 'Arial', color: C.black })],
          spacing: { before: 100, after: 40 },
        }),
        new Paragraph({
          children: [new TextRun({ text: proj.description, size: 19, font: 'Arial', color: C.midGray })],
          spacing: { after: 40 },
        }),
        ...(proj.technologies ? [new Paragraph({ children: [new TextRun({ text: proj.technologies, size: 17, font: 'Arial', color: C.lightGray, italics: true })], spacing: { after: 0 } })] : []),
      );
    }
  }

  // Certifications
  if (certifications.length) {
    children.push(...sectionHeader('Certifications'));
    for (const cert of certifications) {
      children.push(
        new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun({ text: cert.name, bold: true, size: 22, font: 'Arial', color: C.black }),
            new TextRun({ text: `\t${cert.date}`, size: 18, font: 'Arial', color: C.midGray }),
          ],
          spacing: { before: 100, after: 40 },
        }),
        new Paragraph({
          children: [new TextRun({ text: cert.issuer, size: 19, font: 'Arial', color: C.midGray })],
          spacing: { after: 0 },
        }),
      );
    }
  }

  // Links
  if (linkedIn || githubUrl) {
    children.push(emptyLine(120), sectionDivider());
    const linkParts: TextRun[] = [];
    if (linkedIn) linkParts.push(new TextRun({ text: `LinkedIn: ${linkedIn}`, size: 18, font: 'Arial', color: C.blue }));
    if (githubUrl) {
      if (linkParts.length) linkParts.push(new TextRun({ text: '   |   ', size: 18, font: 'Arial', color: C.midGray }));
      linkParts.push(new TextRun({ text: `GitHub: ${githubUrl}`, size: 18, font: 'Arial', color: C.midGray }));
    }
    children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: linkParts, spacing: { before: 80 } }));
  }

  return new Document({
    numbering: bulletNumbering,
    styles: { default: { document: { run: { font: 'Arial', size: 20 } } } },
    sections: [{ properties: pageProps, children }],
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODERN TEMPLATE
// ═══════════════════════════════════════════════════════════════════════════════
function buildModern(data: ReturnType<typeof formatData>): Document {
  const { name, email, phone, location, portfolio, summary, experience, education, skills, projects, certifications, linkedIn, githubUrl } = data;

  // ── Header (name left, contact right) ──
  const headerTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [MODERN_MAIN, MODERN_SIDE],
    borders: { top: noBorder, bottom: thinGray, left: noBorder, right: noBorder, insideH: noBorder, insideV: noBorder },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: noBorders,
            width: { size: MODERN_MAIN, type: WidthType.DXA },
            verticalAlign: VerticalAlign.BOTTOM,
            margins: { bottom: 120 },
            children: [
              new Paragraph({ children: [new TextRun({ text: name, size: 52, font: 'Arial', color: C.black })] }),
              ...(experience.length ? [new Paragraph({ children: [new TextRun({ text: experience[0].position, size: 24, font: 'Arial', color: C.blue })] })] : []),
            ],
          }),
          new TableCell({
            borders: noBorders,
            width: { size: MODERN_SIDE, type: WidthType.DXA },
            verticalAlign: VerticalAlign.BOTTOM,
            margins: { bottom: 120 },
            children: [email, phone, location, portfolio]
              .filter(Boolean)
              .map((val) => new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: val!, size: 18, font: 'Arial', color: C.midGray })], spacing: { after: 40 } })),
          }),
        ],
      }),
    ],
  });

  // ── Summary box ──
  function summaryBox(): Table | null {
    if (!summary) return null;
    return new Table({
      width: { size: CONTENT_W, type: WidthType.DXA },
      columnWidths: [CONTENT_W],
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: CONTENT_W, type: WidthType.DXA },
              shading: { fill: C.lightBlue, type: ShadingType.CLEAR },
              borders: { top: noBorder, bottom: noBorder, left: thinBlue, right: noBorder, insideH: noBorder, insideV: noBorder },
              margins: { top: 120, bottom: 120, left: 240, right: 240 },
              children: [
                new Paragraph({ children: [new TextRun({ text: 'Professional Summary', bold: true, size: 22, font: 'Arial', color: C.blueDark })] }),
                new Paragraph({ children: [new TextRun({ text: summary, size: 19, font: 'Arial', color: C.midGray })], spacing: { before: 60 } }),
              ],
            }),
          ],
        }),
      ],
    });
  }

  // ── Sidebar section header ──
  function sidebarHeader(title: string): Paragraph {
    return new Paragraph({
      children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 18, font: 'Arial', color: C.black, characterSpacing: 60 })],
      border: { bottom: thinGray },
      spacing: { before: 200, after: 80 },
    });
  }

  // ── Main section header ──
  function mainHeader(title: string): Paragraph {
    return new Paragraph({
      children: [new TextRun({ text: title, size: 28, font: 'Arial', color: C.black })],
      border: { bottom: thinBlue },
      spacing: { before: 200, after: 100 },
    });
  }

  // ── Main column content ──
  const mainChildren: Paragraph[] = [];

  if (experience.length) {
    mainChildren.push(mainHeader('Professional Experience'));
    for (const exp of experience) {
      mainChildren.push(
        new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun({ text: exp.position, bold: true, size: 22, font: 'Arial', color: C.black }),
            new TextRun({ text: `\t${exp.startDate} – ${exp.endDate}`, size: 17, font: 'Arial', color: C.midGray }),
          ],
          spacing: { before: 120, after: 40 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: exp.company, size: 19, font: 'Arial', color: C.blue }),
            exp.location ? new TextRun({ text: `  •  ${exp.location}`, size: 19, font: 'Arial', color: C.midGray }) : new TextRun(''),
          ],
          spacing: { after: 60 },
        }),
        ...descParagraphs(exp.description),
      );
    }
  }

  if (projects.length) {
    mainChildren.push(mainHeader('Featured Projects'));
    for (const proj of projects) {
      mainChildren.push(
        new Paragraph({ children: [new TextRun({ text: proj.name, bold: true, size: 22, font: 'Arial', color: C.black })], spacing: { before: 120, after: 40 } }),
        new Paragraph({ children: [new TextRun({ text: proj.description, size: 19, font: 'Arial', color: C.midGray })], spacing: { after: 40 } }),
        ...(proj.technologies ? [new Paragraph({ children: [new TextRun({ text: proj.technologies, size: 17, font: 'Arial', color: C.lightGray, italics: true })], spacing: { after: 0 } })] : []),
      );
    }
  }

  // ── Sidebar content ──
  const sideChildren: Paragraph[] = [];

  if (skills.length) {
    sideChildren.push(sidebarHeader('Technical Skills'));
    for (const skill of skills) {
      sideChildren.push(new Paragraph({ children: [new TextRun({ text: skill, size: 19, font: 'Arial', color: C.midGray })], spacing: { after: 60 }, bullet: undefined as any }));
    }
  }

  if (education.length) {
    sideChildren.push(sidebarHeader('Education'));
    for (const edu of education) {
      sideChildren.push(
        new Paragraph({ children: [new TextRun({ text: edu.school, bold: true, size: 19, font: 'Arial', color: C.black })], spacing: { before: 80, after: 20 } }),
        new Paragraph({ children: [new TextRun({ text: `${edu.degree} in ${edu.fieldOfStudy}`, size: 18, font: 'Arial', color: C.midGray })], spacing: { after: 20 } }),
        new Paragraph({ children: [new TextRun({ text: edu.graduationDate, size: 17, font: 'Arial', color: C.lightGray })], spacing: { after: 0 } }),
      );
    }
  }

  if (certifications.length) {
    sideChildren.push(sidebarHeader('Certifications'));
    for (const cert of certifications) {
      sideChildren.push(
        new Paragraph({ children: [new TextRun({ text: cert.name, bold: true, size: 19, font: 'Arial', color: C.black })], spacing: { before: 80, after: 20 } }),
        new Paragraph({ children: [new TextRun({ text: cert.issuer, size: 18, font: 'Arial', color: C.midGray })], spacing: { after: 0 } }),
        new Paragraph({ children: [new TextRun({ text: cert.date, size: 17, font: 'Arial', color: C.lightGray })], spacing: { after: 0 } }),
      );
    }
  }

  if (linkedIn || githubUrl) {
    sideChildren.push(sidebarHeader('Connect'));
    if (linkedIn) sideChildren.push(new Paragraph({ children: [new TextRun({ text: linkedIn, size: 18, font: 'Arial', color: C.blue })], spacing: { after: 40 } }));
    if (githubUrl) sideChildren.push(new Paragraph({ children: [new TextRun({ text: githubUrl, size: 18, font: 'Arial', color: C.midGray })], spacing: { after: 0 } }));
  }

  // ── Main two-column table ──
  const bodyTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [MODERN_MAIN, MODERN_SIDE],
    borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideH: noBorder, insideV: thinGray },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: noBorders,
            width: { size: MODERN_MAIN, type: WidthType.DXA },
            margins: { right: 360 },
            children: mainChildren,
          }),
          new TableCell({
            borders: noBorders,
            width: { size: MODERN_SIDE, type: WidthType.DXA },
            margins: { left: 360 },
            children: sideChildren,
          }),
        ],
      }),
    ],
  });

  const sBox = summaryBox();
  const sectionChildren = [headerTable, emptyLine(120)];
  if (sBox) sectionChildren.push(sBox, emptyLine(80) as any);
  sectionChildren.push(bodyTable as any);

  return new Document({
    numbering: bulletNumbering,
    styles: { default: { document: { run: { font: 'Arial', size: 20 } } } },
    sections: [{ properties: pageProps, children: sectionChildren }],
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// MINIMAL TEMPLATE
// ═══════════════════════════════════════════════════════════════════════════════
function buildMinimal(data: ReturnType<typeof formatData>): Document {
  const { name, email, phone, location, portfolio, summary, experience, education, skills, projects, certifications, linkedIn, githubUrl } = data;

  const children: Paragraph[] = [];

  // Name
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: name, size: 52, font: 'Arial', color: C.black })],
    spacing: { after: 80 },
  }));

  // Contact
  const contactParts = [email, phone, location, portfolio].filter(Boolean).join('   •   ');
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: contactParts, size: 18, font: 'Arial', color: C.midGray })],
    spacing: { after: 0 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.midGray, space: 1 } },
  }));
  children.push(emptyLine(120));

  // Summary (italicised, centered)
  if (summary) {
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: `"${summary}"`, size: 20, font: 'Arial', color: C.midGray, italics: true })],
      spacing: { after: 160 },
    }));
  }

  function minimalSection(title: string): Paragraph {
    return new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: title.toUpperCase(), size: 18, font: 'Arial', color: C.black, bold: true, characterSpacing: 120 })],
      spacing: { before: 200, after: 80 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: C.lightGray, space: 1 } },
    });
  }

  // Experience
  if (experience.length) {
    children.push(minimalSection('Experience'));
    for (const exp of experience) {
      children.push(
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: exp.position, bold: true, size: 22, font: 'Arial', color: C.black })], spacing: { before: 120, after: 40 } }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${exp.company}${exp.location ? '  •  ' + exp.location : ''}`, size: 19, font: 'Arial', color: C.midGray })], spacing: { after: 40 } }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${exp.startDate} — ${exp.endDate}`, size: 17, font: 'Arial', color: C.lightGray })], spacing: { after: 60 } }),
        ...descParagraphs(exp.description),
        emptyLine(60),
      );
    }
  }

  // Projects
  if (projects.length) {
    children.push(minimalSection('Projects'));
    for (const proj of projects) {
      children.push(
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: proj.name, bold: true, size: 22, font: 'Arial', color: C.black })], spacing: { before: 120, after: 40 } }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: proj.description, size: 19, font: 'Arial', color: C.midGray })], spacing: { after: 40 } }),
        ...(proj.technologies ? [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: proj.technologies, size: 17, font: 'Arial', color: C.lightGray, italics: true })], spacing: { after: 0 } })] : []),
      );
    }
  }

  // Education
  if (education.length) {
    children.push(minimalSection('Education'));
    for (const edu of education) {
      children.push(
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: edu.school, bold: true, size: 22, font: 'Arial', color: C.black })], spacing: { before: 120, after: 40 } }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${edu.degree} in ${edu.fieldOfStudy}`, size: 19, font: 'Arial', color: C.midGray })], spacing: { after: 40 } }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: edu.graduationDate, size: 17, font: 'Arial', color: C.lightGray })], spacing: { after: 0 } }),
      );
    }
  }

  // Certifications
  if (certifications.length) {
    children.push(minimalSection('Certifications'));
    for (const cert of certifications) {
      children.push(
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: cert.name, bold: true, size: 22, font: 'Arial', color: C.black })], spacing: { before: 120, after: 40 } }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${cert.issuer}  •  ${cert.date}`, size: 18, font: 'Arial', color: C.midGray })], spacing: { after: 0 } }),
      );
    }
  }

  // Skills — dot-separated inline
  if (skills.length) {
    children.push(minimalSection('Skills'));
    const skillLine = skills.join('   •   ');
    children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: skillLine, size: 18, font: 'Arial', color: C.midGray })], spacing: { after: 0 } }));
  }

  // Links
  if (linkedIn || githubUrl) {
    children.push(emptyLine(160), sectionDivider(C.lightGray));
    const parts = [linkedIn, githubUrl].filter(Boolean).join('   |   ');
    children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: parts, size: 18, font: 'Arial', color: C.midGray })], spacing: { before: 80 } }));
  }

  return new Document({
    numbering: bulletNumbering,
    styles: { default: { document: { run: { font: 'Arial', size: 20 } } } },
    sections: [{ properties: pageProps, children }],
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// CREATIVE TEMPLATE (dark sidebar + white content)
// ═══════════════════════════════════════════════════════════════════════════════
function buildCreative(data: ReturnType<typeof formatData>): Document {
  const { name, email, phone, location, portfolio, summary, experience, education, skills, projects, certifications, linkedIn, githubUrl } = data;

  // ── Helpers for white text on dark sidebar ──
  function darkPara(text: string, opts: { bold?: boolean; size?: number; color?: string; align?: typeof AlignmentType[keyof typeof AlignmentType]; spacingAfter?: number; spacingBefore?: number } = {}): Paragraph {
    return new Paragraph({
      alignment: opts.align,
      children: [new TextRun({ text, bold: opts.bold, size: opts.size ?? 19, font: 'Arial', color: opts.color ?? C.veryLightGray })],
      spacing: { before: opts.spacingBefore ?? 0, after: opts.spacingAfter ?? 40 },
    });
  }

  function darkHeader(title: string): Paragraph {
    return new Paragraph({
      children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 18, font: 'Arial', color: 'a3b4c8', characterSpacing: 60 })],
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '3d5166', space: 1 } },
      spacing: { before: 240, after: 100 },
    });
  }

  // ── Left (sidebar) children ──
  const leftChildren: Paragraph[] = [
    darkPara(name, { bold: true, size: 30, color: C.white, spacingAfter: 40 }),
    ...[email, phone, location, portfolio].filter(Boolean).map((v) => darkPara(v!, { size: 17, color: 'cbd5e1', spacingAfter: 30 })),
  ];

  if (skills.length) {
    leftChildren.push(darkHeader('Skills'));
    for (const skill of skills) {
      leftChildren.push(darkPara(skill, { size: 18, color: C.veryLightGray, spacingAfter: 50 }));
    }
  }

  if (education.length) {
    leftChildren.push(darkHeader('Education'));
    for (const edu of education) {
      leftChildren.push(
        darkPara(edu.school, { bold: true, size: 19, color: C.white, spacingAfter: 20, spacingBefore: 80 }),
        darkPara(`${edu.degree} in ${edu.fieldOfStudy}`, { size: 17, color: 'cbd5e1', spacingAfter: 20 }),
        darkPara(edu.graduationDate, { size: 16, color: '8b9db0', spacingAfter: 0 }),
      );
    }
  }

  if (certifications.length) {
    leftChildren.push(darkHeader('Certifications'));
    for (const cert of certifications) {
      leftChildren.push(
        darkPara(cert.name, { bold: true, size: 19, color: C.white, spacingAfter: 20, spacingBefore: 80 }),
        darkPara(cert.issuer, { size: 17, color: 'cbd5e1', spacingAfter: 0 }),
        darkPara(cert.date, { size: 16, color: '8b9db0', spacingAfter: 0 }),
      );
    }
  }

  if (linkedIn || githubUrl) {
    leftChildren.push(darkHeader('Connect'));
    if (linkedIn) leftChildren.push(darkPara(linkedIn, { size: 17, color: '93c5fd', spacingAfter: 30 }));
    if (githubUrl) leftChildren.push(darkPara(githubUrl, { size: 17, color: '93c5fd', spacingAfter: 0 }));
  }

  // ── Right (content) children ──
  const rightChildren: Paragraph[] = [];

  function rightHeader(title: string): Paragraph {
    return new Paragraph({
      children: [new TextRun({ text: title, size: 26, font: 'Arial', color: C.black })],
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.blue, space: 1 } },
      spacing: { before: 200, after: 100 },
    });
  }

  if (summary) {
    rightChildren.push(new Paragraph({
      children: [new TextRun({ text: 'About Me', bold: true, size: 22, font: 'Arial', color: C.blueDark })],
      spacing: { after: 60 },
    }));
    rightChildren.push(new Paragraph({
      children: [new TextRun({ text: summary, size: 19, font: 'Arial', color: C.midGray })],
      spacing: { after: 0 },
    }));
  }

  if (experience.length) {
    rightChildren.push(rightHeader('Professional Experience'));
    for (const exp of experience) {
      rightChildren.push(
        new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun({ text: exp.position, bold: true, size: 22, font: 'Arial', color: C.black }),
            new TextRun({ text: `\t${exp.startDate} – ${exp.endDate}`, size: 17, font: 'Arial', color: C.midGray }),
          ],
          spacing: { before: 120, after: 40 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: exp.company, size: 19, font: 'Arial', color: C.blue }),
            exp.location ? new TextRun({ text: `  •  ${exp.location}`, size: 19, font: 'Arial', color: C.midGray }) : new TextRun(''),
          ],
          spacing: { after: 60 },
        }),
        ...descParagraphs(exp.description),
        emptyLine(40),
      );
    }
  }

  if (projects.length) {
    rightChildren.push(rightHeader('Featured Projects'));
    for (const proj of projects) {
      rightChildren.push(
        new Paragraph({ children: [new TextRun({ text: proj.name, bold: true, size: 22, font: 'Arial', color: C.black })], spacing: { before: 100, after: 40 } }),
        new Paragraph({ children: [new TextRun({ text: proj.description, size: 19, font: 'Arial', color: C.midGray })], spacing: { after: 40 } }),
        ...(proj.technologies ? [new Paragraph({ children: [new TextRun({ text: proj.technologies, size: 17, font: 'Arial', color: C.lightGray, italics: true })], spacing: { after: 0 } })] : []),
      );
    }
  }

  // ── Assemble two-column table ──
  const bodyTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CREATIVE_LEFT, CREATIVE_RIGHT],
    borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideH: noBorder, insideV: noBorder },
    rows: [
      new TableRow({
        children: [
          // Dark sidebar
          new TableCell({
            width: { size: CREATIVE_LEFT, type: WidthType.DXA },
            shading: { fill: C.darkCharcoal, type: ShadingType.CLEAR },
            borders: noBorders,
            margins: { top: 280, bottom: 280, left: 240, right: 240 },
            verticalAlign: VerticalAlign.TOP,
            children: leftChildren,
          }),
          // White content
          new TableCell({
            width: { size: CREATIVE_RIGHT, type: WidthType.DXA },
            borders: noBorders,
            margins: { top: 280, bottom: 280, left: 360, right: 120 },
            verticalAlign: VerticalAlign.TOP,
            children: rightChildren,
          }),
        ],
      }),
    ],
  });

  return new Document({
    numbering: bulletNumbering,
    styles: { default: { document: { run: { font: 'Arial', size: 20 } } } },
    sections: [{ properties: pageProps, children: [bodyTable] }],
  });
}

// ─── Data formatter (normalises ResumeData → flat shape) ─────────────────────
function formatData(resumeData: ResumeData) {
  const pi = resumeData.personalInfo ?? {};
  return {
    name: `${pi.firstName ?? ''} ${pi.lastName ?? ''}`.trim() || 'Your Name',
    email: pi.email ?? '',
    phone: pi.phone ?? '',
    location: pi.location ?? '',
    portfolio: pi.portfolio ?? '',
    summary: pi.summary ?? '',
    experience: (resumeData.workExperience ?? []).map((exp) => ({
      position: exp.position,
      company: exp.company,
      location: exp.location ?? '',
      startDate: exp.startDate,
      endDate: exp.endDate ?? 'Present',
      description: exp.description,
    })),
    education: (resumeData.education ?? []).map((edu) => ({
      school: edu.school,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      graduationDate: edu.graduationDate,
      description: edu.description ?? '',
      gpa: edu.gpa,
    })),
    skills: (resumeData.skills ?? []).map((s) => s.name),
    projects: (resumeData.projects ?? []).map((p) => ({
      name: p.name,
      description: p.description,
      technologies: p.technologies ?? '',
      url: p.url ?? '',
    })),
    certifications: (resumeData.certifications ?? []).map((c) => ({
      name: c.name,
      issuer: c.issuer,
      date: c.date,
      description: c.description ?? '',
    })),
    linkedIn: resumeData.linkedIn ?? '',
    githubUrl: resumeData.githubUrl ?? '',
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────
export async function generateDocx(resumeData: ResumeData, template: TemplateType): Promise<void> {
  const data = formatData(resumeData);

  let doc: Document;
  switch (template) {
    case 'modern':
      doc = buildModern(data);
      break;
    case 'minimal':
      doc = buildMinimal(data);
      break;
    case 'creative':
      doc = buildCreative(data);
      break;
    default:
      doc = buildProfessional(data);
  }

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const firstName = data.name.split(' ')[0] || 'Resume';
  const lastName = data.name.split(' ').slice(1).join('-') || '';
  link.download = `${firstName}${lastName ? '-' + lastName : ''}-Resume.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
