import OpenAI from 'openai';

const memoryCache = new Map<string, unknown>();

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

function buildCacheKey(payload: unknown) {
  return JSON.stringify(payload);
}

type AiMode = 'summary' | 'explain' | 'quiz' | 'scenario' | 'video';

export async function generateAiPayload(mode: AiMode, chapterTitle: string, sectionTitle: string, sourceText: string) {
  const cacheKey = buildCacheKey({ mode, chapterTitle, sectionTitle, sourceText });
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }

  const client = getOpenAIClient();
  if (!client) {
    const fallback = buildFallback(mode, chapterTitle, sectionTitle, sourceText);
    memoryCache.set(cacheKey, fallback);
    return fallback;
  }

  const instructions: Record<AiMode, string> = {
    summary: 'Skapa en kort svensk sammanfattning av kapitlet i 3-4 meningar. Referera inte till att du är en AI. Originaltexten får inte återges ordagrant längre stycken.',
    explain: 'Förklara innehållet på enkel svenska i punktform. Behåll sakligheten men skilj tydligt på förklaringen och originaltexten.',
    quiz: 'Skapa 4 flervalsfrågor på svenska med exakt 4 svarsalternativ vardera och markera rätt svar. Returnera JSON med nyckeln questions.',
    scenario: 'Skapa 3 realistiska övningsscenarier på svenska baserat på innehållet. Varje scenario ska ha title, setup och focus.',
    video: 'Skapa 4 idéer för korta instruktionsvideor på svenska. Returnera JSON med nyckeln ideas och fälten title, prompt och outcome.',
  };

  const wantsJson = mode === 'quiz' || mode === 'scenario' || mode === 'video';

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL ?? 'gpt-4.1-mini',
    input: [
      {
        role: 'system',
        content: [{ type: 'input_text', text: instructions[mode] }],
      },
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: `Kapitel: ${chapterTitle}\nSektion: ${sectionTitle}\n\nKälltext:\n${sourceText}`,
          },
        ],
      },
    ],
    ...(wantsJson ? { text: { format: { type: 'json_object' } } } : {}),
  });

  const output = response.output_text;
  const parsed = wantsJson ? JSON.parse(output) : { content: output };
  memoryCache.set(cacheKey, parsed);
  return parsed;
}

function buildFallback(mode: AiMode, chapterTitle: string, sectionTitle: string, sourceText: string) {
  const sentences = sourceText
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);

  switch (mode) {
    case 'summary':
      return {
        content: `Kapitel ${chapterTitle} fokuserar på ${sectionTitle.toLowerCase()}. ${sentences.slice(0, 3).join(' ')}`,
        fallback: true,
      };
    case 'explain':
      return {
        content: [
          `Det här avsnittet hör till ${chapterTitle}.`,
          `Kärnan i avsnittet ${sectionTitle} är att förstå och tillämpa innehållet steg för steg.`,
          `Läs originaltexten bredvid för exakt formulering och använd denna förklaring som stöd.`,
        ],
        fallback: true,
      };
    case 'quiz':
      return {
        questions: Array.from({ length: 3 }).map((_, index) => ({
          id: `${sectionTitle}-fallback-${index + 1}`,
          question: `Vilket påstående stämmer bäst med avsnittet "${sectionTitle}"?`,
          options: [
            sentences[index] ?? sourceText.slice(0, 90),
            'Detta alternativ är en distraktor.',
            'Avsnittet handlar inte om ämnet.',
            'Det saknas relevans för kapitlet.',
          ],
          correctIndex: 0,
          explanation: 'Rätt svar bygger på originaltexten i avsnittet.',
        })),
        fallback: true,
      };
    case 'scenario':
      return {
        scenarios: Array.from({ length: 3 }).map((_, index) => ({
          title: `Scenario ${index + 1}: ${sectionTitle}`,
          setup: `Utgå från kapitlet ${chapterTitle} och planera en övning där innehållet i ${sectionTitle.toLowerCase()} används i praktiken.`,
          focus: 'Beslutsfattande, kommunikation och tillämpning av grundprinciper.',
        })),
        fallback: true,
      };
    case 'video':
      return {
        ideas: Array.from({ length: 4 }).map((_, index) => ({
          title: `Övningsvideo ${index + 1}`,
          prompt: `Visa ett kort utbildningsmoment för ${sectionTitle.toLowerCase()} med tydliga steg och säkerhetsfokus.`,
          outcome: 'Stöd för repetition inför praktisk träning.',
        })),
        fallback: true,
      };
  }
}
