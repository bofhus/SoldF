import { notFound } from 'next/navigation';
import { ReaderView } from '@/components/reader-view';
import { getChapterById } from '@/lib/data';

export default async function ReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chapter = getChapterById(id);
  if (!chapter) notFound();

  return <ReaderView chapter={chapter} />;
}
