import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  const html = readFileSync(
    join(process.cwd(), "scripts", "menu-generator.html"),
    "utf-8"
  );
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "no-store",
    },
  });
}
