"use client";

import { motion } from "framer-motion";
import { Duel } from "@/lib/types/product";
import ProductPanel from "./ProductPanel";
import SpecRow from "./SpecRow";

export default function CompareArena({ duel }: { duel: Duel }) {
  return (
    <section className="relative mx-auto max-w-4xl px-6 pb-24">
      <div className="relative flex flex-col gap-4 sm:flex-row">
        <ProductPanel product={duel.a} side="a" />

        <div className="relative flex items-center justify-center sm:w-16">
          <div className="seam-line absolute top-0 h-full w-px sm:left-1/2" />
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4, type: "spring" }}
            className="relative z-10 rounded-full border border-line bg-void px-3 py-1 font-display text-xs font-bold tracking-widest text-mist"
          >
            VS
          </motion.span>
        </div>

        <ProductPanel product={duel.b} side="b" />
      </div>

      <div className="relative mt-10 overflow-hidden rounded-2xl border border-line bg-panel/40 px-5 sm:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-contender-a/40 to-transparent">
          <div className="h-24 w-full bg-gradient-to-b from-contender-a/10 to-transparent animate-scan" />
        </div>

        <div className="relative py-2">
          {duel.specs.map((row, i) => (
            <SpecRow key={row.label} row={row} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
