import { read, utils } from "xlsx";
import { NextRequest, NextResponse } from "next/server";

type Row = (string | number | boolean)[];

const CAT_MAP: Record<string, { id: string; name: string }> = {
  Soki:    { id: "soki",    name: "Soki"    },
  Kanapki: { id: "kanapki", name: "Kanapki" },
  Desery:  { id: "desery",  name: "Desery"  },
  Obiady:  { id: "obiady",  name: "Obiady"  },
  "Sałatki": { id: "salatki", name: "Sałatki" },
  Zupy:    { id: "zupy",    name: "Zupy"    },
  Sushi:   { id: "sushi",   name: "Sushi"   },
};

const OLD_CAT_MAP: Record<string, { id: string; name: string }> = {
  "Sałatki":       { id: "salatki", name: "Sałatki" },
  Kanapki:         { id: "kanapki", name: "Kanapki" },
  Zupy:            { id: "zupy",    name: "Zupy"    },
  Obiady:          { id: "obiady",  name: "Obiady"  },
  Desery:          { id: "desery",  name: "Desery"  },
  "soki i napoje": { id: "soki",    name: "Soki"    },
  Sushi:           { id: "sushi",   name: "Sushi"   },
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
}

function cleanId(sym: string) {
  return sym.endsWith(".0") ? sym.slice(0, -2) : sym;
}

function isNew(id: string) {
  try { return parseFloat(id.replace(/[A-Za-z]/g, "")) >= 1900; } catch { return false; }
}

function findHeader(rows: Row[]): { idx: number; cols: Record<string, number> } {
  for (let i = 0; i < Math.min(rows.length, 10); i++) {
    const vals = rows[i].map((v) => String(v).trim());
    if (vals.includes("Symbol") && vals.includes("Nazwa")) {
      const cols: Record<string, number> = {};
      vals.forEach((v, j) => { cols[v] = j; });
      return { idx: i, cols };
    }
  }
  return { idx: -1, cols: {} };
}

function colIdx(cols: Record<string, number>, keys: string[]) {
  for (const k of keys) {
    if (k in cols) return cols[k];
    const m = Object.keys(cols).find((c) => c.toUpperCase().includes(k.toUpperCase()));
    if (m) return cols[m];
  }
  return -1;
}

interface MenuItem {
  id: string;
  category: string;
  name: string;
  diet: string | null;
  hasPhoto: boolean;
  price: number | null;
  new: boolean;
  _cat?: string;
}

function parseNew(wb: ReturnType<typeof read>): MenuItem[] {
  const sheetName = wb.SheetNames.find((n) => n === "Menu") ?? wb.SheetNames.find((n) => n !== "Helpers") ?? wb.SheetNames[0];
  const rows = utils.sheet_to_json<Row>(wb.Sheets[sheetName], { header: 1, defval: "" });
  const { idx, cols } = findHeader(rows);
  if (idx === -1) return [];

  const out: MenuItem[] = [];
  for (let i = idx + 1; i < rows.length; i++) {
    const r = rows[i];
    const cat  = String(r[cols["Kategoria"]] ?? "").trim();
    const sym  = String(r[cols["Symbol"]]    ?? "").trim();
    const name = String(r[cols["Nazwa"]]     ?? "").trim();
    if (!sym || !name || !cat || sym === "nan") continue;

    const id       = cleanId(sym);
    const catInfo  = CAT_MAP[cat] ?? { id: slugify(cat), name: cat };
    const photoRaw = r[cols["Zdjęcie"]];
    const hasPhoto = photoRaw === true || String(photoRaw).toLowerCase() === "true";
    const dietRaw  = String(r[cols["Dieta"]] ?? "").trim();
    const diet     = dietRaw && dietRaw !== "nan" && dietRaw !== "N/D" ? dietRaw : null;
    const priceRaw = r[cols["Cena"]];
    const price    = priceRaw != null && priceRaw !== "" && !isNaN(Number(priceRaw)) ? parseInt(String(priceRaw), 10) : null;

    out.push({ id, category: catInfo.id, name, diet, hasPhoto, price, new: isNew(id), _cat: catInfo.name });
  }
  return out;
}

function parseOld(wb: ReturnType<typeof read>): MenuItem[] {
  const out: MenuItem[] = [];
  for (const sheetName of wb.SheetNames.filter((n) => n !== "Katalog")) {
    const rows = utils.sheet_to_json<Row>(wb.Sheets[sheetName], { header: 1, defval: "" });
    const { idx, cols } = findHeader(rows);
    if (idx === -1) continue;

    const catInfo = OLD_CAT_MAP[sheetName] ?? { id: slugify(sheetName), name: sheetName };
    const symI   = colIdx(cols, ["Symbol"]);
    const nameI  = colIdx(cols, ["Nazwa"]);
    const photoI = colIdx(cols, ["ZDJĘCIA", "Zdjęcie", "Zdjecia"]);
    const priceI = colIdx(cols, ["Cena", "CENA"]);
    const dietI  = colIdx(cols, ["Dieta"]);

    for (let i = idx + 1; i < rows.length; i++) {
      const r   = rows[i];
      const sym = String(r[symI] ?? "").trim();
      if (!sym || sym === "nan") continue;
      const name = String(r[nameI] ?? "").trim();
      if (!name || name === "nan") continue;
      if (r.map((v) => String(v).toUpperCase()).some((v) => v === "ARCHIWUM")) continue;

      const id       = cleanId(sym);
      const photoRaw = String(r[photoI] ?? "").trim();
      const hasPhoto = photoRaw.includes("✅") || photoRaw.toLowerCase() === "true";
      const dietRaw  = dietI !== -1 ? String(r[dietI] ?? "").trim() : "";
      const diet     = dietRaw && dietRaw !== "nan" && dietRaw !== "N/D" ? dietRaw : null;
      const priceRaw = r[priceI];
      const price    = priceRaw != null && priceRaw !== "" && !isNaN(Number(priceRaw)) ? parseInt(String(priceRaw), 10) : null;

      out.push({ id, category: catInfo.id, name, diet, hasPhoto, price, new: isNew(id), _cat: catInfo.name });
    }
  }
  return out;
}

interface MenuJson {
  categories: { id: string; name: string; blankType?: string }[];
  items: Omit<MenuItem, "_cat">[];
}

function build(items: MenuItem[], existing: MenuJson | null) {
  if (!existing) {
    const seen = new Set<string>();
    const cats: MenuJson["categories"] = [];
    const catOrder = Object.values(CAT_MAP).map((c) => c.id);
    for (const id of catOrder) {
      const it = items.find((i) => i.category === id);
      if (it) { cats.push({ id, name: it._cat! }); seen.add(id); }
    }
    for (const it of items) {
      if (!seen.has(it.category)) { cats.push({ id: it.category, name: it._cat! }); seen.add(it.category); }
    }
    return { categories: cats, items: items.map(({ _cat, ...i }) => i) };
  }

  // Merge
  const byId = new Map(existing.items.map((i) => [i.id, i]));
  const merged = existing.items.map((item) => {
    const x = items.find((i) => i.id === item.id);
    if (!x) return item;
    const { _cat, ...xData } = x;
    return { ...item, ...xData };
  });
  for (const x of items) {
    if (!byId.has(x.id)) {
      const { _cat, ...xData } = x;
      merged.push(xData);
    }
  }

  const existingCatIds = new Set(existing.categories.map((c) => c.id));
  const cats = [...existing.categories];
  for (const x of items) {
    if (!existingCatIds.has(x.category)) {
      cats.push({ id: x.category, name: x._cat! });
      existingCatIds.add(x.category);
    }
  }
  return { categories: cats, items: merged };
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const xlsxFile = form.get("file") as File | null;
  if (!xlsxFile) return NextResponse.json({ error: "Brak pliku (pole: file)" }, { status: 400 });

  const buf = await xlsxFile.arrayBuffer();
  const wb  = read(buf, { type: "array" });

  // Detect format by checking first sheet header
  const firstRows = utils.sheet_to_json<Row>(wb.Sheets[wb.SheetNames[0]], { header: 1, defval: "" });
  const isNewFmt = firstRows.slice(0, 5).some((r) => r.map((v) => String(v).trim()).includes("Kategoria"));

  const items = isNewFmt ? parseNew(wb) : parseOld(wb);

  let existing: MenuJson | null = null;
  const menuFile = form.get("menu") as File | null;
  if (menuFile) {
    try { existing = JSON.parse(await menuFile.text()) as MenuJson; } catch {}
  }

  const result = build(items, existing);
  return NextResponse.json(result, {
    headers: { "X-Robots-Tag": "noindex, nofollow" },
  });
}
