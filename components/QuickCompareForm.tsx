"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { guessVersusSlug } from "@/lib/utils/slug";

export default function QuickCompareForm() {
  const router = useRouter();
  const [nameA, setNameA] = useState("");
  const [nameB, setNameB] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nameA.trim() || !nameB.trim()) return;
    const slug = guessVersusSlug(nameA.trim(), nameB.trim());
    router.push(`/compare/${slug}`);
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mx-auto mt-6 max-w-md rounded-2xl border border-line bg-panel/40 p-5"
    >
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-mist">
        Adu manual
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={nameA}
          onChange={(e) => setNameA(e.target.value)}
          placeholder="Apple iPhone 16 Pro"
          className="flex-1 rounded-full border border-contender-a/30 bg-void px-4 py-2.5 text-sm text-fog placeholder:text-mist focus:border-contender-a/60 focus:outline-none"
        />
        <span className="mx-auto font-display text-xs font-bold text-mist sm:mx-0">
          vs
        </span>
        <input
          value={nameB}
          onChange={(e) => setNameB(e.target.value)}
          placeholder="Samsung Galaxy S25 Ultra"
          className="flex-1 rounded-full border border-contender-b/30 bg-void px-4 py-2.5 text-sm text-fog placeholder:text-mist focus:border-contender-b/60 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="mt-4 w-full rounded-full bg-fog py-2.5 text-sm font-semibold text-void transition-opacity hover:opacity-90"
      >
        Bandingin
      </button>
      <p className="mt-2 text-center font-mono text-[10px] text-mist">
        Tulis nama lengkap sesuai brand + model, biar makin akurat nyari di Versus.
      </p>
    </motion.form>
  );
}
