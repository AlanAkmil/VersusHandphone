"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Header({ stackCount = 0 }: { stackCount?: number }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-void/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg font-bold tracking-tight text-fog">
          duel<span className="text-contender-a">.</span>
        </Link>

        <div className="flex items-center gap-3">
          {stackCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5 rounded-full border border-line bg-panel px-3 py-1.5 font-mono text-xs text-mist"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-contender-a" />
              <span className="h-1.5 w-1.5 rounded-full bg-contender-b" />
              <span className="ml-0.5">{stackCount} arena</span>
            </motion.div>
          )}
          <button
            aria-label="Cari produk"
            className="rounded-full border border-line p-2 text-mist transition-colors hover:border-contender-a/50 hover:text-fog"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
