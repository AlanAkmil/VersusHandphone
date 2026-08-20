# Scrapers

`versus.ts` — debug scraper buat versus.com. Coba 3 strategi berurutan:
1. JSON-LD (schema.org script tag)
2. __NEXT_DATA__ (kalau Versus pake Next.js)
3. Fallback: tebak tabel HTML biasa

Cara pakai:
GET /api/scrape?url=https://versus.com/en/<path-comparison>

Hasilnya JSON berisi strategy mana yang ketemu + sample data,
biar keliatan Versus render datanya dari mana. Dari situ baru
kita tulis parser yang bener sesuai strategi yang cocok.
