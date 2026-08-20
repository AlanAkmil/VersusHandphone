"use client";

import { motion } from "framer-motion";
import { Product } from "@/lib/types/product";
import ScoreRing from "./ScoreRing";

export default function ProductPanel({
  product,
  side,
}: {
  product: Product;
  side: "a" | "b";
}) {
  const accent = side === "a" ? "text-contender-a" : "text-contender-b";
  const border = side === "a" ? "border-contender-a/30" : "border-contender-b/30";
  const fromLeft = side === "a";

  return (
    <motion.div
      initial={{ opacity: 0, x: fromLeft ? -24 : 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`flex flex-1 items-center justify-between gap-4 rounded-2xl border ${border} bg-panel/60 p-6 backdrop-blur-sm`}
    >
      <div>
        {(product.brand || product.releaseYear) && (
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-mist">
            {[product.brand, product.releaseYear].filter(Boolean).join(" · ")}
          </p>
        )}
        <h2 className={`mt-2 font-display text-2xl font-semibold ${accent}`}>
          {product.name}
        </h2>
        {product.priceLabel && (
          <p className="mt-1 font-mono text-xs text-mist">{product.priceLabel}</p>
        )}
      </div>
      <ScoreRing score={product.score} side={side} />
    </motion.div>
  );
}
