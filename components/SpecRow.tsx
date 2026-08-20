"use client";

import { motion } from "framer-motion";
import { SpecRow as SpecRowType } from "@/lib/types/product";

function getWinner(row: SpecRowType): "a" | "b" | null {
  if (row.higherIsBetter === undefined) return null;
  if (row.a.numeric === undefined || row.b.numeric === undefined) return null;
  if (row.a.numeric === row.b.numeric) return null;
  const aWins = row.higherIsBetter
    ? row.a.numeric > row.b.numeric
    : row.a.numeric < row.b.numeric;
  return aWins ? "a" : "b";
}

export default function SpecRow({ row, index }: { row: SpecRowType; index: number }) {
  const winner = getWinner(row);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
      className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-line py-4 last:border-0"
    >
      <span
        className={`text-right font-mono text-sm sm:text-base ${
          winner === "a"
            ? "font-semibold text-contender-a animate-pulseWin"
            : "text-fog"
        }`}
      >
        {row.a.raw}
      </span>

      <span className="whitespace-nowrap px-2 text-center text-[11px] uppercase tracking-wider text-mist">
        {row.label}
      </span>

      <span
        className={`text-left font-mono text-sm sm:text-base ${
          winner === "b"
            ? "font-semibold text-contender-b animate-pulseWin"
            : "text-fog"
        }`}
      >
        {row.b.raw}
      </span>
    </motion.div>
  );
}
