export type SpecValue = {
  raw: string;
  numeric?: number;
  unit?: string;
};

export type SpecRow = {
  label: string;
  category: string;
  a: SpecValue;
  b: SpecValue;
  higherIsBetter?: boolean;
  /** Dipakai kalau sumber data (mis. Versus) udah nentuin pemenang langsung,
   *  tanpa kita perlu itung dari `numeric`. */
  winnerSide?: "a" | "b";
};

export type Product = {
  slug: string;
  name: string;
  brand?: string;
  image?: string;
  releaseYear?: number;
  score: number;
  priceLabel?: string;
};

export type Evidence = {
  term: string;
  detail: string;
};

export type Verdict = {
  winner: "a" | "b";
  strongCategories: Evidence[];
  exceptCategories: Evidence[];
};

export type FitPoint = {
  label: string;
  value: string;
  compareValue: string;
  delta?: string;
};

export type Duel = {
  a: Product;
  b: Product;
  specs: SpecRow[];
  verdict: Verdict;
  fitA: FitPoint[];
  fitB: FitPoint[];
};

export type SearchSuggestion = {
  name: string;
  category: string;
};
