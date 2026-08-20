import Header from "@/components/Header";
import CompareArena from "@/components/CompareArena";
import VerdictPanel from "@/components/VerdictPanel";
import FitList from "@/components/FitList";
import { fetchAndParseDuel } from "@/lib/scrapers/versus";
import { toDuel } from "@/lib/adapters/versus-to-duel";

export const dynamic = "force-dynamic";

export default async function ComparePage({
  params,
}: {
  params: { slug: string };
}) {
  const versusUrl = `https://versus.com/en/${params.slug}`;

  let errorMessage: string | null = null;
  let duel = null;

  try {
    const parsed = await fetchAndParseDuel(versusUrl);
    if (parsed.specs.length === 0) {
      errorMessage =
        "Nemu halamannya tapi datanya kosong — kemungkinan slug-nya salah atau Versus ganti struktur lagi.";
    } else {
      duel = toDuel(parsed);
    }
  } catch (err) {
    errorMessage = String(err instanceof Error ? err.message : err);
  }

  if (errorMessage || !duel) {
    return (
      <main className="min-h-screen bg-void">
        <Header />
        <div className="mx-auto max-w-md px-6 pt-24 text-center">
          <p className="font-display text-xl text-fog">Gagal narik data</p>
          <p className="mt-3 font-mono text-xs text-mist">{errorMessage}</p>
          <p className="mt-6 text-sm text-mist">
            Coba cek slug-nya persis kayak URL di versus.com, contoh:
            <br />
            <span className="text-contender-a">
              apple-iphone-16-pro-vs-samsung-galaxy-s25-ultra
            </span>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-void">
      <Header stackCount={2} />
      <div className="px-6 pt-10">
        <p className="mx-auto max-w-4xl font-mono text-xs uppercase tracking-[0.3em] text-mist">
          Diputuskan
        </p>
      </div>
      <CompareArena duel={duel} />
      <VerdictPanel duel={duel} />
      <FitList a={duel.a} b={duel.b} fitA={duel.fitA} fitB={duel.fitB} />
    </main>
  );
}
