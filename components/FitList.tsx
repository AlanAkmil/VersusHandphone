"use client";

import { motion } from "framer-motion";
import { FitPoint, Product } from "@/lib/types/product";

function FitCard({
  product,
  side,
  points,
}: {
  product: Product;
  side: "a" | "b";
  points: FitPoint[];
}) {
  const accent = side === "a" ? "text-contender-a" : "text-contender-b";
  const border = side === "a" ? "border-contender-a/25" : "border-contender-b/25";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className={`flex-1 rounded-2xl border ${border} bg-panel/40 p-6`}
    >
      <p className={`font-mono text-xs uppercase tracking-[0.2em] ${accent}`}>
        {product.name} menang kalau lu peduli
      </p>

      <div className="mt-4 space-y-4">
        {points.map((p) => (
          <div key={p.label} className="border-b border-line pb-3 last:border-0">
            <p className="text-sm text-mist">{p.label}</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-lg font-semibold text-fog">
                {p.value}
              </span>
              {p.delta && (
                <span className={`font-mono text-xs ${accent}`}>{p.delta}</span>
              )}
            </div>
            <p className="font-mono text-[11px] text-mist">{p.compareValue}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function FitList({
  a,
  b,
  fitA,
  fitB,
}: {
  a: Product;
  b: Product;
  fitA: FitPoint[];
  fitB: FitPoint[];
}) {
  return (
    <section className="mx-auto max-w-4xl px-6 pb-24">
      <h2 className="mb-6 font-display text-2xl font-semibold text-fog">
        Mana yang cocok buat lu?
      </h2>
      <div className="flex flex-col gap-4 sm:flex-row">
        <FitCard product={a} side="a" points={fitA} />
        <FitCard product={b} side="b" points={fitB} />
      </div>
    </section>
  );
}
