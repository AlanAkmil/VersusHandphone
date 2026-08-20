export async function fetchViaZenRows(
  targetUrl: string
): Promise<{ html: string; status: number }> {
  const apiKey = process.env.ZENROWS_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ZENROWS_API_KEY belum di-set. Tambahin di Environment Variables project (Vercel/Netlify), terus redeploy."
    );
  }

  const endpoint = new URL("https://api.zenrows.com/v1/");
  endpoint.searchParams.set("apikey", apiKey);
  endpoint.searchParams.set("url", targetUrl);
  endpoint.searchParams.set("js_render", "true");
  endpoint.searchParams.set("premium_proxy", "true");

  const res = await fetch(endpoint.toString());
  const html = await res.text();

  return { html, status: res.status };
}
