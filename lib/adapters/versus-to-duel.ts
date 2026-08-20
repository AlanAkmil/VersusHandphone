import { Duel, Evidence, FitPoint } from "@/lib/types/product";
import type { ParsedDuel } from "@/lib/scrapers/versus";
import { slugifyName } from "@/lib/utils/slug";

export function toDuel(parsed: ParsedDuel): Duel {
  const winnerSide = parsed.verdict?.winnerSide ?? "a";

  const strongCategories: Evidence[] =
    parsed.verdict?.reasons
      .filter((r) => r.side === winnerSide)
      .map((r) => ({
        term: r.term,
        detail: `${r.count} fakta: ${r.factLabels.join(", ")}${r.count > r.factLabels.length ? ", dst." : "."}`,
      })) ?? [];

  const exceptCategories: Evidence[] =
    parsed.verdict?.reasons
      .filter((r) => r.side !== winnerSide)
      .map((r) => ({
        term: r.term,
        detail: `${r.count} fakta: ${r.factLabels.join(", ")}${r.count > r.factLabels.length ? ", dst." : "."}`,
      })) ?? [];

  const fitA: FitPoint[] = parsed.specs
    .filter((s) => s.winnerSide === "a")
    .slice(0, 6)
    .map((s) => ({
      label: s.label,
      value: s.a.raw,
      compareValue: `vs ${s.b.raw}`,
    }));

  const fitB: FitPoint[] = parsed.specs
    .filter((s) => s.winnerSide === "b")
    .slice(0, 6)
    .map((s) => ({
      label: s.label,
      value: s.b.raw,
      compareValue: `vs ${s.a.raw}`,
    }));

  return {
    a: {
      slug: slugifyName(parsed.a.name),
      name: parsed.a.name,
      score: parsed.a.score,
    },
    b: {
      slug: slugifyName(parsed.b.name),
      name: parsed.b.name,
      score: parsed.b.score,
    },
    specs: parsed.specs,
    verdict: {
      winner: winnerSide,
      strongCategories,
      exceptCategories,
    },
    fitA,
    fitB,
  };
}
