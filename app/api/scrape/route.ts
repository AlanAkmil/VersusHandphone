import { NextRequest, NextResponse } from "next/server";
import { debugScrapeVersus } from "@/lib/scrapers/versus";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Kasih parameter ?url= link comparison Versus.com yang mau di-debug." },
      { status: 400 }
    );
  }

  if (!url.startsWith("https://versus.com/")) {
    return NextResponse.json(
      { error: "Cuma boleh URL dari versus.com." },
      { status: 400 }
    );
  }

  try {
    const result = await debugScrapeVersus(url);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal fetch/parse.", detail: String(err) },
      { status: 500 }
    );
  }
}
