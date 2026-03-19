export type BlockType = 'paragraph' | 'rule' | 'list';

export interface SourceModule {
  module_id: string;
  chapter_number: number;
  title: string;
  pdf_page_start: number;
  pdf_page_end: number;
  book_page_start: number;
  book_page_end: number;
  content_raw: string;
}

export interface SourcePage {
  pdf_page: number;
  is_blank: boolean;
  text_raw: string;
  book_page?: number;
}

export interface SourceData {
  source_file: string;
  document_title: string;
  document_short_title: string;
  language: string;
  extraction_note: string;
  moodle_ready: boolean;
  table_of_contents: Array<{
    chapter_number: number;
    title: string;
    book_page_start: number;
    pdf_page_start: number;
    pdf_page_end: number;
    book_page_end: number;
    content_raw: string;
  }>;
  modules: SourceModule[];
  pages: SourcePage[];
}

export interface ContentBlock {
  id: string;
  type: BlockType;
  text: string;
}

export interface Section {
  id: string;
  title: string;
  blocks: ContentBlock[];
}

export interface ChapterSummaryData {
  id: string;
  chapterNumber: number;
  title: string;
  excerpt: string;
  bookPageRange: string;
  pdfPageRange: string;
  sections: Section[];
  rawText: string;
}
