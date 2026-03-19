import sourceJson from '@/soldf_2001_moodle_masterdata.json';
import type { ChapterSummaryData, ContentBlock, Section, SourceData, SourceModule } from '@/lib/types';

const source = sourceJson as SourceData;

const whitespace = /\s+/g;

function normalizeLine(line: string) {
  return line.replace(/\u00ad/g, '').replace(whitespace, ' ').trim();
}

function isMostlyUppercase(value: string) {
  const letters = value.replace(/[^A-Za-zÅÄÖåäö]/g, '');
  return letters.length > 3 && letters === letters.toUpperCase();
}

function isLikelyHeading(line: string) {
  const cleaned = normalizeLine(line);
  if (!cleaned || cleaned.length > 90) return false;
  if (/^\d+$/.test(cleaned)) return false;
  if (/^K A P I T E L$/i.test(cleaned)) return false;
  if (/^[•\-]/.test(cleaned)) return false;
  if (cleaned.includes('©')) return false;
  return /^[A-ZÅÄÖa-zåäö0-9]/.test(cleaned) && (isMostlyUppercase(cleaned) || /^[A-ZÅÄÖ]/.test(cleaned));
}

function parseBlocks(text: string, seed: string): ContentBlock[] {
  const parts = text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.map((part, index) => {
    const lines = part.split('\n').map((line) => normalizeLine(line)).filter(Boolean);
    const bulletLines = lines.filter((line) => /^[•\-*]/.test(line));
    const numberedLines = lines.filter((line) => /^\d+[.)]/.test(line));
    const isRule = lines.length > 0 && lines.length <= 4 && lines.every((line) => line.length < 110) && !bulletLines.length;

    let type: ContentBlock['type'] = 'paragraph';
    if (bulletLines.length >= 2 || numberedLines.length >= 2) {
      type = 'list';
    } else if (isRule) {
      type = 'rule';
    }

    return {
      id: `${seed}-block-${index + 1}`,
      type,
      text: lines.join('\n'),
    };
  });
}

function parseSections(module: SourceModule): Section[] {
  const lines = module.content_raw.split('\n').map((line) => normalizeLine(line));
  const sectionTitles = new Set<string>([
    module.title,
    ...lines.filter((line) => isLikelyHeading(line) && line !== module.title && line.length > 3),
  ]);

  const orderedTitles: string[] = [];
  for (const line of lines) {
    if (sectionTitles.has(line) && !orderedTitles.includes(line)) {
      orderedTitles.push(line);
    }
  }

  if (!orderedTitles.length) orderedTitles.push(module.title);

  const sections: Section[] = [];
  for (let index = 0; index < orderedTitles.length; index += 1) {
    const title = orderedTitles[index];
    const nextTitle = orderedTitles[index + 1];
    const startIndex = lines.findIndex((line, currentIndex) => line === title && (index === 0 || currentIndex > (lines.findIndex((item) => item === orderedTitles[index - 1]) ?? -1)));
    const endIndex = nextTitle ? lines.findIndex((line, currentIndex) => line === nextTitle && currentIndex > startIndex) : lines.length;
    const slice = lines.slice(Math.max(startIndex + 1, 0), endIndex === -1 ? lines.length : endIndex);
    const body = slice.join('\n').trim();
    if (!body) continue;

    sections.push({
      id: `${module.module_id}-section-${sections.length + 1}`,
      title,
      blocks: parseBlocks(body, `${module.module_id}-section-${sections.length + 1}`),
    });
  }

  if (!sections.length) {
    sections.push({
      id: `${module.module_id}-section-1`,
      title: module.title,
      blocks: parseBlocks(module.content_raw, `${module.module_id}-section-1`),
    });
  }

  return sections;
}

const chapters: ChapterSummaryData[] = source.modules.map((module) => {
  const sections = parseSections(module);
  const excerpt = sections[0]?.blocks[0]?.text.slice(0, 240) ?? module.content_raw.slice(0, 240);

  return {
    id: module.module_id,
    chapterNumber: module.chapter_number,
    title: module.title,
    excerpt,
    bookPageRange: `${module.book_page_start}–${module.book_page_end}`,
    pdfPageRange: `${module.pdf_page_start}–${module.pdf_page_end}`,
    sections,
    rawText: module.content_raw,
  };
});

export function getBookMeta() {
  return {
    title: source.document_title,
    shortTitle: source.document_short_title,
    chapterCount: chapters.length,
  };
}

export function getAllChapters() {
  return chapters;
}

export function getChapterById(id: string) {
  return chapters.find((chapter) => chapter.id === id);
}

export function getAdjacentChapter(id: string) {
  const index = chapters.findIndex((chapter) => chapter.id === id);
  return {
    previous: index > 0 ? chapters[index - 1] : null,
    next: index >= 0 && index < chapters.length - 1 ? chapters[index + 1] : null,
  };
}
