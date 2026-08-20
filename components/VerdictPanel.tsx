"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Duel } from "@/lib/types/product";

function TermChip({
  term,
  detail,
  accent,
}: {
  term: string;
  detail: string;
  accent: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="underline decoration-dotted decoration-2 underline-offset-4 transition-colors"
        style={{ color: accent }}
      >
        {term}
      </button>
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-1 block overflow-hidden rounded-lg border border-line bg-panel px-3 py-2 font-mono text-xs text-mist"
          >
            {detail}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export default function VerdictPanel({ duel }: { duel: Duel }) {
  const winner = duel.verdict.winner === "a" ? duel.a : duel.b;
  const accent = duel.verdict.winner === "a" ? "#4CC9F0" : "#FF6B35";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-4xl px-6 pb-10"
    >
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-mist">
        Putusan arena
      </p>
      <p className="text-balance font-display text-xl leading-relaxed text-fog sm:text-2xl">
        Menang{" "}
        <span style={{ color: accent }} className="font-semibold">
          {winner.name}
        </span>{" "}
        — unggul di{" "}
        {duel.verdict.strongCategories.map((e, i) => (
          <span key={e.term}>
            <TermChip term={e.term} detail={e.detail} accent={accent} />
            {i < duel.verdict.strongCategories.length - 1 ? ", " : ""}
          </span>
        ))}
        , kecuali kalau{" "}
        {duel.verdict.exceptCategories.map((e, i) => (
          <span key={e.term}>
            <TermChip term={e.term} detail={e.detail} accent="#8B92A6" />
            {i < duel.verdict.exceptCategories.length - 1 ? " atau " : ""}
          </span>
        ))}{" "}
        lebih penting buat lu.
      </p>
      <p className="mt-3 font-mono text-xs text-mist">
        Ketuk kata bergaris putus-putus buat liat buktinya.
      </p>
    </motion.div>
  );
}
