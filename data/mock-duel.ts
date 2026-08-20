import { Duel, SearchSuggestion } from "@/lib/types/product";

export const mockDuel: Duel = {
  a: {
    slug: "iphone-16-pro",
    name: "iPhone 16 Pro",
    brand: "Apple",
    releaseYear: 2024,
    score: 82,
    priceLabel: "mulai Rp 19,9jt",
  },
  b: {
    slug: "galaxy-s25-ultra",
    name: "Galaxy S25 Ultra",
    brand: "Samsung",
    releaseYear: 2025,
    score: 88,
    priceLabel: "mulai Rp 21,9jt",
  },
  specs: [
    { label: "Layar", category: "Display", a: { raw: "6.3\" OLED, 120Hz" }, b: { raw: "6.9\" OLED, 120Hz" } },
    { label: "Chipset", category: "Performa", a: { raw: "A18 Pro" }, b: { raw: "Snapdragon 8 Elite" } },
    { label: "RAM", category: "Performa", a: { raw: "8 GB", numeric: 8, unit: "GB" }, b: { raw: "12 GB", numeric: 12, unit: "GB" }, higherIsBetter: true },
    { label: "Baterai", category: "Baterai", a: { raw: "3582 mAh", numeric: 3582, unit: "mAh" }, b: { raw: "5000 mAh", numeric: 5000, unit: "mAh" }, higherIsBetter: true },
    { label: "Kamera Utama", category: "Kamera", a: { raw: "48 MP", numeric: 48, unit: "MP" }, b: { raw: "200 MP", numeric: 200, unit: "MP" }, higherIsBetter: true },
    { label: "Harga Rilis", category: "Harga", a: { raw: "Rp 19.999.000", numeric: 19999000 }, b: { raw: "Rp 21.999.000", numeric: 21999000 }, higherIsBetter: false },
  ],
  verdict: {
    winner: "b",
    strongCategories: [
      { term: "Kamera", detail: "200 MP vs 48 MP — beda jauh di resolusi sensor utama." },
      { term: "Baterai", detail: "5000 mAh vs 3582 mAh, sekitar 40% lebih besar." },
    ],
    exceptCategories: [
      { term: "Bobot", detail: "iPhone 16 Pro lebih ringan 26 gram, enak buat genggaman satu tangan." },
      { term: "Ekosistem", detail: "Kalau device lain di rumah semua Apple, iPhone lebih nyambung." },
    ],
  },
  fitA: [
    { label: "Bobot", value: "199 g", compareValue: "vs 225 g", delta: "-26 g" },
    { label: "Ketebalan", value: "8.25 mm", compareValue: "vs 8.2 mm", delta: "+0.05 mm" },
    { label: "Chip neural", value: "16-core NPU", compareValue: "vs 45 TOPS NPU" },
  ],
  fitB: [
    { label: "Kamera utama", value: "200 MP", compareValue: "vs 48 MP", delta: "+152 MP" },
    { label: "Baterai", value: "5000 mAh", compareValue: "vs 3582 mAh", delta: "+1418 mAh" },
    { label: "RAM", value: "12 GB", compareValue: "vs 8 GB", delta: "+4 GB" },
  ],
};

export const mockSuggestions: SearchSuggestion[] = [
  { name: "iPhone 16 Pro", category: "Ponsel" },
  { name: "Galaxy S25 Ultra", category: "Ponsel" },
  { name: "Poco X7 Pro", category: "Ponsel" },
  { name: "RTX 4070 Super", category: "Kartu grafis" },
  { name: "RTX 4080", category: "Kartu grafis" },
  { name: "MacBook Air M3", category: "Laptop" },
  { name: "ThinkPad X1 Carbon", category: "Laptop" },
  { name: "Sony WH-1000XM5", category: "Headphone" },
  { name: "AirPods Pro 2", category: "Earbud wireless" },
];
