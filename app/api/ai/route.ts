import { NextRequest, NextResponse } from 'next/server';
import { generateAiPayload } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mode, chapterTitle, sectionTitle, sourceText } = body as {
      mode: 'summary' | 'explain' | 'quiz' | 'scenario' | 'video';
      chapterTitle: string;
      sectionTitle: string;
      sourceText: string;
    };

    if (!mode || !chapterTitle || !sectionTitle || !sourceText) {
      return NextResponse.json({ error: 'Ogiltig förfrågan.' }, { status: 400 });
    }

    const data = await generateAiPayload(mode, chapterTitle, sectionTitle, sourceText);
    return NextResponse.json(data, { headers: { 'Cache-Control': 's-maxage=86400, stale-while-revalidate=604800' } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Kunde inte generera AI-innehåll.' }, { status: 500 });
  }
}
