import { notFound } from 'next/navigation';
import { QuizView } from '@/components/quiz-view';
import { getChapterById } from '@/lib/data';

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chapter = getChapterById(id);
  if (!chapter) notFound();

  return <QuizView chapter={chapter} />;
}
