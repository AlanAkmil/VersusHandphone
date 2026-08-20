export function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Nebak slug URL versus.com dari nama dua produk.
 * Formatnya "brand-model-vs-brand-model", contoh:
 * "apple-iphone-16-pro-vs-samsung-galaxy-s25-ultra".
 * Ini tebakan kasar — kalau nggak nemu, Versus bakal balikin 404
 * dan user perlu masukin slug yang lebih tepat.
 */
export function guessVersusSlug(nameA: string, nameB: string): string {
  return `${slugifyName(nameA)}-vs-${slugifyName(nameB)}`;
}
