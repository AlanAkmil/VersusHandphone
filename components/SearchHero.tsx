"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchSuggestion } from "@/lib/types/product";

export default function SearchHero({
  suggestions,
}: {
  suggestions: SearchSuggestion[];
}) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const filtered = useMemo(() => {
    if (!query.trim()) return suggestions.slice(0, 6);
    return suggestions.filter((s) =>
      s.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, suggestions]);

  return (
    <section className="relative overflow-hidden px-6 pt-20 pb-16 sm:pt-28">
      <div className="pointer-events-none absolute inset-0 bg-seam-glow" />

      <div className="relative mx-auto max-w-2xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-mist"
        >
          Bukan review. Data lawan data.
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-5 font-display text-4xl font-semibold leading-[1.1] text-fog sm:text-6xl"
        >
          Adu dulu, <span className="text-contender-a">baru</span> beli.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-5 max-w-md text-balance text-mist"
        >
          Ketik dua produk, angka menang nyala sendiri — nggak ada yang
          disembunyiin.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative mx-auto mt-8 max-w-md"
        >
          <div className="flex items-center gap-2 rounded-full border border-line bg-panel px-5 py-3.5 transition-colors focus-within:border-contender-a/50">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B92A6" strokeWidth="2" className="shrink-0">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              placeholder="Cari produk buat dibandingin..."
              className="w-full bg-transparent text-sm text-fog placeholder:text-mist focus:outline-none"
            />
          </div>

          <AnimatePresence>
            {focused && (
              <motion.ul
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-x-0 top-full z-20 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-line bg-panel py-2 text-left shadow-xl"
              >
                {filtered.length === 0 && (
                  <li className="px-4 py-3 font-mono text-xs text-mist">
                    Nggak ketemu — coba nama lain.
                  </li>
                )}
                {filtered.map((s) => (
                  <li key={s.name}>
                    <button className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-fog transition-colors hover:bg-void">
                      <span>{s.name}</span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-mist">
                        {s.category}
                      </span>
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
