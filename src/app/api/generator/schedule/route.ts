import { read, utils } from "xlsx";
import { NextRequest, NextResponse } from "next/server";

const DATE_RE = /(\d{2})\.(\d{2})\.(\d{4})/;

function parseISODate(name: string): string | null {
  const m = name.match(DATE_RE);
  if (!m) return null;
  return `${m[3]}-${m[2]}-${m[1]}`;
}

async function extractIds(file: File): Promise<string[]> {
  const buf  = await file.arrayBuffer();
  const wb   = read(buf, { type: "array" });
  const rows = utils.sheet_to_json<(string | number)[]>(wb.Sheets[wb.SheetNames[0]], { header: 1, defval: "" });
  return rows.map((r) => String(r[0]).trim()).filter(Boolean);
}

export async function POST(req: NextRequest) {
  const form  = await req.formData();
  const files = form.getAll("files") as File[];
  if (!files.length) return NextResponse.json({ error: "Brak plików (pole: files[])" }, { status: 400 });

  const entries = await Promise.all(
    files.slice(0, 14).map(async (file) => {
      const iso = parseISODate(file.name);
      if (!iso) return null;
      const ids = await extractIds(file);
      return [iso, ids] as [string, string[]];
    })
  );

  const result = Object.fromEntries(
    (entries.filter(Boolean) as [string, string[]][]).sort(([a], [b]) => a.localeCompare(b))
  );

  return NextResponse.json(result, {
    headers: { "X-Robots-Tag": "noindex, nofollow" },
  });
}
