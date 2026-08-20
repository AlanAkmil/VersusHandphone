import Header from "@/components/Header";
import CompareArena from "@/components/CompareArena";
import VerdictPanel from "@/components/VerdictPanel";
import FitList from "@/components/FitList";
import { mockDuel } from "@/data/mock-duel";

export default function ComparePage() {
  // NOTE: slug diabaikan dulu, masih pakai mock-duel.
  // Nanti tinggal fetch data asli by slug di sini.
  const duel = mockDuel;

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
