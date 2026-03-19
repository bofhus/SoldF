import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="rounded-[2rem] border border-white/10 bg-[color:var(--surface)] p-8 text-center">
      <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--muted)]">404</p>
      <h2 className="mt-3 text-3xl font-semibold">Kapitlet kunde inte hittas</h2>
      <p className="mt-3 text-sm text-[color:var(--muted)]">Kontrollera länken eller gå tillbaka till kapitelöversikten.</p>
      <Link href="/" className="mt-6 inline-flex rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-[#0a1206]">Till startsidan</Link>
    </main>
  );
}
