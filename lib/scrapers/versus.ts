import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";
import { SpecRow } from "@/lib/types/product";
import { fetchViaZenRows } from "./proxy-fetch";

export type VerdictReason = {
  term: string;
  count: number;
  side: "a" | "b";
  factLabels: string[];
};

export type ParsedVerdict = {
  winnerSide: "a" | "b";
  winnerName: string;
  reasons: VerdictReason[];
};

export type ParsedDuel = {
  a: { name: string; score: number };
  b: { name: string; score: number };
  specs: SpecRow[];
  verdict: ParsedVerdict | null;
};

/**
 * Ambil nilai satu sel <td class="val"> — bisa berupa teks biasa
 * atau ikon boolean <span title="yes"|"no">.
 */
function extractCellValue($cell: cheerio.Cheerio<AnyNode>): string {
  const boolEl = $cell.find('[title="yes"], [title="no"]').first();
  if (boolEl.length) {
    return boolEl.attr("title") === "yes" ? "Ya" : "Tidak";
  }
  const text = $cell.clone().find(".dot").remove().end().text().trim();
  return text || "—";
}

/**
 * Parser produksi buat tabel #ledger di versus.com.
 * Struktur (per 21 Aug 2026):
 *   <tr data-spec="..." data-desc="..." data-pct="..">
 *     <td class="metric">Label</td>
 *     <td class="val">2,600 nits atau <span title="yes|no"></span></td>  ← sisi A
 *     <td class="val">...</td>                                           ← sisi B
 *     <td class="res"><span class="pill w">Nama Pemenang</span></td>
 */
export function parseLedgerTable(html: string): SpecRow[] {
  const $ = cheerio.load(html);
  const rows: SpecRow[] = [];

  $("#ledger table tbody tr").each((_, el) => {
    const $row = $(el);
    const label = $row.find("td.metric").first().text().trim();
    if (!label) return;

    const valCells = $row.find("td.val");
    const aText = extractCellValue(valCells.eq(0));
    const bText = extractCellValue(valCells.eq(1));

    const winnerName = $row.find("td.res .pill").text().trim();
    const aIsWinner = Boolean(winnerName) && aText.includes(winnerName.split(" ").pop() ?? "\u0000");

    rows.push({
      label,
      category: $row.attr("data-spec") ?? "",
      a: { raw: aText },
      b: { raw: bText },
      winnerSide: winnerName ? (aIsWinner ? "a" : "b") : undefined,
    });
  });

  return rows;
}

/**
 * Parser buat section .ruling (paragraf verdict) + .receipt (bukti tiap kategori).
 * Struktur:
 *   <div class="ruling"><p>Get the <span class="win">Nama</span> — it wins
 *     <button class="tok" data-r="performance-0" style="border-color:var(--cobalt)">
 *       Performance<sup>11</sup></button>, ...</p></div>
 *   <div class="receipt" id="r-performance-0">
 *     <div class="rrow"><span class="rlbl">Label fakta</span>...</div>
 *   </div>
 * Warna cobalt = sisi A, magenta = sisi B (konsisten sepanjang halaman).
 */
export function parseRuling(html: string): ParsedVerdict | null {
  const $ = cheerio.load(html);

  const winnerName = $(".ruling .win").first().text().trim();
  if (!winnerName) return null;

  const reasons: VerdictReason[] = [];
  let winnerSide: "a" | "b" = "a";

  $(".ruling button.tok").each((_, el) => {
    const $tok = $(el);
    const term = $tok.clone().find("sup").remove().end().text().trim();
    const count = Number($tok.find("sup").text().trim()) || 0;
    const style = $tok.attr("style") ?? "";
    const side: "a" | "b" = style.includes("cobalt") ? "a" : "b";

    const dataR = $tok.attr("data-r") ?? "";
    const factLabels: string[] = [];
    $(`#r-${dataR} .rrow .rlbl`).each((i, lbl) => {
      if (i < 4) factLabels.push($(lbl).text().trim());
    });

    reasons.push({ term, count, side, factLabels });
  });

  // Pemenang = sisi yang paling banyak nyumbang reasons di awal paragraf.
  if (reasons.length > 0) winnerSide = reasons[0].side;

  return { winnerSide, winnerName, reasons };
}

export async function fetchAndParseDuel(url: string): Promise<ParsedDuel> {
  const { html } = await fetchViaZenRows(url);
  const $ = cheerio.load(html);

  const specs = parseLedgerTable(html);
  const verdict = parseRuling(html);

  const names = $(".duo .side h1, .duo .side .h1")
    .map((_, el) => $(el).text().trim())
    .get();

  const scores = $(".scorering span")
    .map((_, el) => Number($(el).text().trim()))
    .get();

  return {
    a: { name: names[0] ?? "Produk A", score: scores[0] ?? 0 },
    b: { name: names[1] ?? "Produk B", score: scores[1] ?? 0 },
    specs,
    verdict,
  };
}


export type ScrapeDebugResult = {
  sourceUrl: string;
  status: number;
  strategy: "json-ld" | "next-data" | "html-fallback" | "none";
  title: string | null;
  jsonLdBlocks: unknown[];
  nextDataFound: boolean;
  nextDataSample: unknown;
  htmlFallback: {
    headingsFound: string[];
    tableRowsFound: number;
    sampleRows: { label: string; a: string; b: string }[];
  } | null;
  rawLength: number;
  rawHtmlPreview: string;
  reasonsWindow: string | null;
  recordWindow: string | null;
  rulingWindow: string | null;
  booleanRowWindow: string | null;
  scoreRingBlocks: string[];
  parsedPreview: ParsedDuel | { error: string };
};

export async function debugScrapeVersus(url: string): Promise<ScrapeDebugResult> {
  const { html, status } = await fetchViaZenRows(url);

  const $ = cheerio.load(html);

  const title = $("title").first().text() || null;

  // 1. Coba cari JSON-LD (schema.org) — sering dipakai situs comparison buat SEO.
  const jsonLdBlocks: unknown[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    const text = $(el).contents().text();
    try {
      jsonLdBlocks.push(JSON.parse(text));
    } catch {
      // skip block yang gagal di-parse
    }
  });

  // 2. Coba cari __NEXT_DATA__ (kalau situsnya Next.js, semua props ada di sini).
  const nextDataScript = $("#__NEXT_DATA__").contents().text();
  let nextDataFound = false;
  let nextDataSample: unknown = null;
  if (nextDataScript) {
    try {
      const parsed = JSON.parse(nextDataScript);
      nextDataFound = true;
      // Cuma ambil sepotong biar respons debug nggak kegedean.
      nextDataSample = parsed?.props?.pageProps ?? parsed;
    } catch {
      // skip
    }
  }

  // 3. Fallback: coba tebak struktur tabel/baris spek dari HTML biasa.
  const headingsFound: string[] = [];
  $("h1, h2").each((_, el) => {
    const t = $(el).text().trim();
    if (t) headingsFound.push(t);
  });

  const sampleRows: { label: string; a: string; b: string }[] = [];
  $("table tr").each((i, el) => {
    if (i > 15) return;
    const cells = $(el).find("td, th");
    if (cells.length >= 3) {
      sampleRows.push({
        label: $(cells[0]).text().trim(),
        a: $(cells[1]).text().trim(),
        b: $(cells[2]).text().trim(),
      });
    }
  });

  let strategy: ScrapeDebugResult["strategy"] = "none";
  if (sampleRows.length > 0) strategy = "html-fallback";
  else if (jsonLdBlocks.length > 0) strategy = "json-ld";
  else if (nextDataFound) strategy = "next-data";

  // 4. Raw HTML window di sekitar teks tertentu — biar keliatan markup asli tanpa nebak lewat cheerio.
  function rawWindow(needle: string, before = 200, after = 2000): string | null {
    const idx = html.indexOf(needle);
    if (idx === -1) return null;
    return html.slice(Math.max(0, idx - before), idx + after);
  }

  const reasonsWindow = rawWindow("better than");
  const recordWindow = rawWindow("scorering", 300, 2500);
  const rulingWindow = rawWindow('class="ruling"', 100, 2000);
  const booleanRowWindow = rawWindow("multi-user", 300, 900);

  // 5. Semua elemen class scorering, ambil outerHTML penuh (bukan cuma teks).
  const scoreRingBlocks: string[] = [];
  $('[class*="scorering"]').each((i, el) => {
    if (i > 6) return;
    const outer = $.html(el);
    if (outer) scoreRingBlocks.push(outer.slice(0, 500));
  });

  // 6. Coba parser produksi langsung di sini juga, biar sekali buka link
  //    kita liat hasil parse-nya, bukan cuma raw HTML.
  let parsedPreview: ScrapeDebugResult["parsedPreview"];
  try {
    const specs = parseLedgerTable(html);
    const verdict = parseRuling(html);
    const names = $(".duo .side h1, .duo .side .h1")
      .map((_, el) => $(el).text().trim())
      .get();
    const scores = $(".scorering span")
      .map((_, el) => Number($(el).text().trim()))
      .get();
    parsedPreview = {
      a: { name: names[0] ?? "Produk A", score: scores[0] ?? 0 },
      b: { name: names[1] ?? "Produk B", score: scores[1] ?? 0 },
      specs,
      verdict,
    };
  } catch (err) {
    parsedPreview = { error: String(err) };
  }

  return {
    sourceUrl: url,
    status,
    strategy,
    title,
    jsonLdBlocks,
    nextDataFound,
    nextDataSample,
    htmlFallback:
      sampleRows.length > 0 || headingsFound.length > 0
        ? { headingsFound, tableRowsFound: sampleRows.length, sampleRows }
        : null,
    rawLength: html.length,
    rawHtmlPreview: html.slice(0, 1500),
    reasonsWindow,
    recordWindow,
    rulingWindow,
    booleanRowWindow,
    scoreRingBlocks,
    parsedPreview,
  };
}
