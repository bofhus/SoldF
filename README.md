# SoldF Utbildningsplattform

En produktionsinriktad Next.js-applikation som visualiserar `soldf_2001_moodle_masterdata.json` som en mobil-först utbildningsplattform med AI-kompletterande funktioner, quiz, scenario-träning, mörkt/ljust läge och offline-stöd.

## Funktioner

- Kapitelöversikt som kort/grid.
- Kapitelvy och dedikerat läsläge med progressindikator.
- "Fortsätt där du var" via `localStorage`/Zustand.
- AI-funktioner via Next.js API route:
  - Sammanfattning
  - Förklara enklare
  - Quiz
  - Scenario-träning
  - Videoidéer för rekommenderade övningar
- Mock/fallback-data när `OPENAI_API_KEY` saknas.
- PWA-manifest och enkel service worker för offline-cache av textinnehåll.

## Teknikstack

- Next.js App Router
- React + TypeScript
- Tailwind CSS v4
- Zustand för klientstate
- OpenAI Node SDK

## Kom igång

```bash
npm install
npm run dev
```

Öppna sedan `http://localhost:3000`.

## Miljövariabler

Skapa en `.env.local`:

```bash
OPENAI_API_KEY=din_nyckel
OPENAI_MODEL=gpt-4.1-mini
```

Om `OPENAI_API_KEY` saknas används automatiskt mock/fallback-svar för alla AI-funktioner.

## Exempel på OpenAI API-anrop

Frontend anropar `POST /api/ai` med JSON:

```json
{
  "mode": "quiz",
  "chapterTitle": "Elden",
  "sectionTitle": "Våra vapen",
  "sourceText": "Originaltext från sektionen"
}
```

Svar för quiz returneras som JSON med `questions[]`. För `summary` och `explain` returneras textbaserat kompletterande material.

## Projektstruktur

- `app/` – sidor, layout, API-route och PWA-manifest.
- `components/` – återanvändbara UI-komponenter.
- `lib/` – dataladdning, parsing och AI-hjälpfunktioner.
- `store/` – Zustand-store för tema och läsprogress.
- `public/sw.js` – offline-cache.

## Viktiga designprinciper

- Originaltexten från JSON ändras aldrig i UI-lagret.
- AI-genererat innehåll visas som kompletterande material separat från källtexten.
- Kapiteldata indexeras lokalt till kapitel → sektion → block.
