import * as cheerio from "cheerio";
import { SpecRow } from "@/lib/types/product";

export type ParsedDuel = {
  a: { name: string; score: number };
  b: { name: string; score: number };
  specs: SpecRow[];
};

/**
 * Parser produksi buat tabel #ledger di versus.com.
 * Struktur (per 20 Aug 2026):
 *   <tr data-spec="..." data-desc="..." data-pct="..">
 *     <td class="metric">Label</td>
 *     <td class="val"><span class="dot" style="background:var(--cobalt)">2,600 nits</td>  ← sisi A
 *     <td class="val">...</td>                                                             ← sisi B
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
    const aCell = valCells.eq(0);
    const bCell = valCells.eq(1);

    // Buang <span class="dot"> biar sisa teksnya bersih.
    const aText = aCell.clone().find(".dot").remove().end().text().trim();
    const bText = bCell.clone().find(".dot").remove().end().text().trim();

    const winnerName = $row.find("td.res .pill").text().trim();
    // Versus udah nentuin pemenang tiap baris langsung lewat winnerName,
    // jadi kita tinggal cocokin ke nama produk A/B — bukan bandingin angka manual.
    const aIsWinner = Boolean(winnerName) && aText.includes(winnerName.split(" ").pop() ?? "\u0000");

    rows.push({
      label,
      category: $row.attr("data-spec") ?? "",
      a: { raw: aText || "—" },
      b: { raw: bText || "—" },
      winnerSide: winnerName ? (aIsWinner ? "a" : "b") : undefined,
    });
  });

  return rows;
}

export async function fetchAndParseDuel(url: string): Promise<ParsedDuel> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });
  const html = await res.text();
  const $ = cheerio.load(html);

  const specs = parseLedgerTable(html);

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
};

export async function debugScrapeVersus(url: string): Promise<ScrapeDebugResult> {
  const res = await fetch(url, {
    headers: {
      // Header lebih lengkap biar keliatan kayak browser asli, bukan bot.
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Upgrade-Insecure-Requests": "1",
    },
  });

  const html = await res.text();
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

  return {
    sourceUrl: url,
    status: res.status,
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
  };
}
