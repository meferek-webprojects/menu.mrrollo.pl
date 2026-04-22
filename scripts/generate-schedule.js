// Usage: node scripts/generate-schedule.js <file1.xlsx> [file2.xlsx ...]
// File name must contain a date in format DD.MM.YYYY, e.g. "22.04.2026.xlsx"
// Reads column A (first sheet, all rows) and extracts IDs as strings.
// Merges with existing src/data/schedule.json and writes it back.

const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const SCHEDULE_PATH = path.join(__dirname, "../src/data/schedule.json");
const DATE_RE = /(\d{2})\.(\d{2})\.(\d{4})/;

function parseISODate(filename) {
  const m = path.basename(filename).match(DATE_RE);
  if (!m) throw new Error(`Brak daty w nazwie pliku: ${filename}`);
  const [, dd, mm, yyyy] = m;
  return `${yyyy}-${mm}-${dd}`;
}

function extractIDs(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

  const ids = [];
  for (const row of rows) {
    const raw = row[0];
    if (raw === "" || raw === null || raw === undefined) continue;
    const id = String(raw).trim();
    if (id) ids.push(id);
  }
  return ids;
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("Podaj co najmniej jeden plik .xlsx jako argument.");
  process.exit(1);
}

const existing = fs.existsSync(SCHEDULE_PATH)
  ? JSON.parse(fs.readFileSync(SCHEDULE_PATH, "utf8"))
  : {};

let changed = 0;
for (const file of files) {
  const abs = path.resolve(file);
  if (!fs.existsSync(abs)) {
    console.error(`Plik nie istnieje: ${abs}`);
    continue;
  }

  let iso;
  try {
    iso = parseISODate(abs);
  } catch (e) {
    console.error(e.message);
    continue;
  }

  const ids = extractIDs(abs);
  existing[iso] = ids;
  changed++;
  console.log(`✓ ${iso}  →  ${ids.length} pozycji`);
}

if (changed > 0) {
  const sorted = Object.fromEntries(Object.entries(existing).sort());
  fs.writeFileSync(SCHEDULE_PATH, JSON.stringify(sorted, null, 2) + "\n", "utf8");
  console.log(`\nZapisano: ${SCHEDULE_PATH}`);
} else {
  console.log("Brak zmian.");
}
