"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import menuData from "@/data/menu.json";

// ── Types ─────────────────────────────────────────────────────────────────────

interface MenuItem {
  id: string;
  name: string;
  diet: string | null;
  hasPhoto: boolean;
  blankType: string;
  price: number | null;
  new: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

type Schedule = Record<string, Record<string, string[]>>;

// ── Blank image URLs ──────────────────────────────────────────────────────────

const BLANK_URL: Record<string, string> = {
  DESER:    "/blanks/DESER.png",
  KANAPKA:  "/blanks/KANAPKA.png",
  OBIAD:    "/blanks/OBIAD.png",
  "SAŁATKA":"/blanks/SA%C5%81ATKA.png",
  SOK:      "/blanks/SOK.png",
  ZUPA:     "/blanks/ZUPA.png",
};

// ── Diet badges (brandbook 2026) ──────────────────────────────────────────────

const DIET: Record<string, { label: string; bg: string; text: string }> = {
  MIĘSNA:  { label: "Mięsna",  bg: "bg-diet-miesna", text: "text-brand-black" },
  VEGE:    { label: "Vege",    bg: "bg-diet-vege",   text: "text-brand-black" },
  "VEGE+": { label: "Vege+",   bg: "bg-diet-vegep",  text: "text-brand-black" },
  WEGAN:   { label: "Wegan",   bg: "bg-diet-wegan",  text: "text-white" },
  FIT:     { label: "Fit",     bg: "bg-diet-fit",    text: "text-brand-black" },
  KETO:    { label: "Keto",    bg: "bg-diet-keto",   text: "text-brand-black" },
  LOW_IG:  { label: "Low IG",  bg: "bg-diet-lowig",  text: "text-brand-black" },
};

function DietBadge({ tag }: { tag: string }) {
  const cfg = DIET[tag];
  if (!cfg) return null;
  return (
    <span className={`inline-block text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0 ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  );
}

// ── Date / week helpers ───────────────────────────────────────────────────────

const PL_DAYS_SHORT  = ["Pon", "Wt",  "Śr",  "Cz",  "Pt"];
const PL_MONTHS_SHORT = ["sty","lut","mar","kwi","maj","cze","lip","sie","wrz","paź","lis","gru"];

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

/** Returns Monday–Friday of the week containing `ref`. */
function getWeekDays(ref = new Date()): Date[] {
  const d = new Date(ref);
  const dow = d.getDay(); // 0=Sun
  d.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1)); // rewind to Monday
  return Array.from({ length: 5 }, (_, i) => {
    const dd = new Date(d);
    dd.setDate(d.getDate() + i);
    return dd;
  });
}

function formatDateShort(d: Date) {
  return `${d.getDate()} ${PL_MONTHS_SHORT[d.getMonth()]}`;
}

function formatDateLong(d: Date) {
  const dow = d.getDay(); // 1=Mon…5=Fri
  const dayName = PL_DAYS_SHORT[dow === 0 ? 6 : dow - 1] ?? "";
  return `${dayName}, ${d.getDate()} ${PL_MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

// ── Lightbox ──────────────────────────────────────────────────────────────────

function Lightbox({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const photoSrc = item.hasPhoto
    ? `/photos/${item.id}.png`
    : (BLANK_URL[item.blankType] ?? "/blanks/DESER.png");

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const priceText = item.price !== null
    ? item.price.toLocaleString("pl-PL", { minimumFractionDigits: 2 }) + "\u00a0zł"
    : "zapytaj";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-sm overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full aspect-square bg-gray-50">
          <Image src={photoSrc} alt={item.name} fill sizes="(max-width:640px) 100vw,384px" className="object-cover" priority />
          {item.new && (
            <span className="absolute top-3 left-3 bg-brand-orange text-white text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full shadow">
              Nowość
            </span>
          )}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors text-sm"
            aria-label="Zamknij"
          >✕</button>
        </div>
        <div className="flex flex-col px-5 py-4">
          <p className="text-base font-semibold text-brand-black leading-snug">{item.name}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {item.diet && <DietBadge tag={item.diet} />}
            <span className={`text-sm font-bold ${item.price !== null ? "text-brand-black" : "text-gray-400 italic font-normal"}`}>
              {priceText}
            </span>
          </div>
          <Link
            href="https://sklep.mrrollo.pl/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center mt-6 bg-brand-green text-brand-black hover:bg-brand-green/80 text-sm font-bold py-2 px-4 rounded-full transition-colors"
          >
            Przejdź na stronę sklepu
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Category tab ──────────────────────────────────────────────────────────────

function CategoryTab({ name, count, active, onClick }: {
  name: string; count: number; active: boolean; onClick: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (active && ref.current)
      ref.current.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
        active
          ? "bg-brand-green text-brand-black font-semibold shadow-sm"
          : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
      }`}
    >
      {name}
      <span className={`ml-1.5 text-[11px] ${active ? "text-brand-black/60" : "text-white/40"}`}>{count}</span>
    </button>
  );
}

// ── Week day picker ───────────────────────────────────────────────────────────

function WeekPicker({
  weekDays,
  selectedDate,
  schedule,
  onSelect,
  onClear,
}: {
  weekDays: Date[];
  selectedDate: string | null;
  schedule: Schedule;
  onSelect: (iso: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="px-4 pb-3 border-t border-white/10 pt-3">
      <div className="flex gap-2 items-center">
        {/* "Wszystko" pill */}
        <button
          onClick={onClear}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            selectedDate === null
              ? "bg-white/20 text-white font-semibold"
              : "bg-white/10 text-white/50 hover:bg-white/20 hover:text-white"
          }`}
        >
          Wszystko
        </button>

        {/* Mon–Fri pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
          {weekDays.map((d, i) => {
            const iso   = toISODate(d);
            const isAct = selectedDate === iso;
            const hasSch = !!schedule[iso];
            const isToday = iso === toISODate(new Date());

            return (
              <button
                key={iso}
                onClick={() => onSelect(iso)}
                className={`shrink-0 flex flex-col items-center px-3 pt-1.5 pb-1.5 rounded-xl text-xs transition-all relative ${
                  isAct
                    ? "bg-brand-green text-brand-black font-semibold"
                    : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                }`}
              >
                <span className="font-semibold text-[11px] uppercase tracking-wide">{PL_DAYS_SHORT[i]}</span>
                <span className="text-base font-bold leading-none mt-0.5">{d.getDate()}</span>
                {/* dot: has schedule */}
                <span className={`mt-1 w-1.5 h-1.5 rounded-full ${hasSch ? (isAct ? "bg-brand-black/40" : "bg-brand-green") : "bg-white/20"}`} />
                {/* today ring */}
                {isToday && !isAct && (
                  <span className="absolute inset-0 rounded-xl ring-1 ring-brand-green/60 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Item card ─────────────────────────────────────────────────────────────────

function ItemCard({ item, onOpen }: { item: MenuItem; onOpen: (item: MenuItem) => void }) {
  const [imgError, setImgError] = useState(false);
  const photoSrc = item.hasPhoto && !imgError
    ? `/photos/${item.id}.png`
    : (BLANK_URL[item.blankType] ?? "/blanks/DESER.png");
  const priceText = item.price !== null
    ? item.price.toLocaleString("pl-PL", { minimumFractionDigits: 2 }) + "\u00a0zł"
    : "zapytaj";

  return (
    <li
      className="flex items-center gap-3 bg-white rounded-2xl px-3 py-3 shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
      onClick={() => onOpen(item)}
    >
      <div className="relative shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gray-50">
        <Image src={photoSrc} alt={item.name} fill sizes="64px" className="object-cover" onError={() => setImgError(true)} />
        {item.new && (
          <span className="absolute top-0.5 left-0.5 bg-brand-orange text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full leading-none">NEW</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-brand-black leading-snug">{item.name}</p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          {item.diet && <DietBadge tag={item.diet} />}
          <span className={`text-[11px] font-semibold ${item.price !== null ? "text-brand-black" : "text-gray-400 italic font-normal"}`}>
            {priceText}
          </span>
        </div>
      </div>
      <svg className="shrink-0 text-gray-300" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </li>
  );
}

// ── Global search results ─────────────────────────────────────────────────────

interface SearchGroup { category: MenuCategory; items: MenuItem[] }

function SearchResults({ groups, onOpen }: { groups: SearchGroup[]; onOpen: (item: MenuItem) => void }) {
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  if (total === 0)
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="font-medium">Brak wyników</p>
        <p className="text-sm mt-1">Spróbuj innego hasła</p>
      </div>
    );
  return (
    <div className="flex flex-col gap-6">
      {groups.map(({ category, items }) =>
        items.length === 0 ? null : (
          <section key={category.id}>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 px-1">
              {category.name} <span className="text-gray-300">({items.length})</span>
            </h2>
            <ul className="flex flex-col gap-2">
              {items.map((item) => (
                <ItemCard key={`${category.id}-${item.id}`} item={item} onOpen={onOpen} />
              ))}
            </ul>
          </section>
        )
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MenuClient() {
  const categories = menuData.categories as MenuCategory[];
  const schedule   = (menuData as { schedule?: Schedule }).schedule ?? {};

  const [activeCatId,   setActiveCatId]   = useState(categories[0].id);
  const [search,        setSearch]        = useState("");
  const [lightboxItem,  setLightboxItem]  = useState<MenuItem | null>(null);
  const [selectedDate,  setSelectedDate]  = useState<string | null>(null);
  const [weekPickerOpen,setWeekPickerOpen]= useState(false);

  const weekDays = useMemo(() => getWeekDays(), []);
  const today    = useMemo(() => toISODate(new Date()), []);
  const isSearching = search.trim().length > 0;

  // Items for the active category, optionally filtered by selected day
  const categoryItems = useMemo(() => {
    const base = categories.find((c) => c.id === activeCatId)?.items ?? [];
    if (!selectedDate) return base;
    const ids = schedule[selectedDate]?.[activeCatId];
    if (!ids) return [];
    const set = new Set(ids);
    return base.filter((it) => set.has(it.id));
  }, [activeCatId, selectedDate, schedule, categories]);

  // Global search — across ALL categories, respecting day filter
  const searchGroups = useMemo<SearchGroup[]>(() => {
    if (!isSearching) return [];
    const q = search.trim().toLowerCase();
    return categories.map((cat) => {
      let pool = cat.items;
      if (selectedDate) {
        const ids = schedule[selectedDate]?.[cat.id];
        if (!ids) pool = [];
        else { const set = new Set(ids); pool = pool.filter((it) => set.has(it.id)); }
      }
      return { category: cat, items: pool.filter((it) => it.name.toLowerCase().includes(q)) };
    });
  }, [search, isSearching, selectedDate, schedule, categories]);

  const totalHits = searchGroups.reduce((n, g) => n + g.items.length, 0);

  const openLightbox  = useCallback((item: MenuItem) => setLightboxItem(item), []);
  const closeLightbox = useCallback(() => setLightboxItem(null), []);

  function selectCategory(id: string) { setActiveCatId(id); setSearch(""); }
  function selectDay(iso: string) { setSelectedDate(iso); setWeekPickerOpen(false); }
  function clearDay() { setSelectedDate(null); setWeekPickerOpen(false); }

  // Count items per category for the tab badge (respects day filter)
  function catCount(cat: MenuCategory) {
    if (!selectedDate) return cat.items.length;
    const ids = schedule[selectedDate]?.[cat.id];
    return ids ? ids.length : 0;
  }

  const activeCategory = categories.find((c) => c.id === activeCatId)!;

  // Format the date button label
  const dateBtnLabel = selectedDate
    ? formatDateLong(new Date(selectedDate + "T00:00:00"))
    : formatDateLong(new Date());

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col">

      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-20 bg-brand-black shadow-lg">

        {/* Row 1: logo | search | date button */}
        <div className="mx-auto px-4 pt-4 pb-3 flex items-center gap-2">
          <Image src="/mrrollo.png" alt="Mr. Rollo" width={42} height={42} className="object-contain shrink-0" />

          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Szukaj w całym menu…"
              className="w-full bg-white/10 text-white placeholder-white/30 text-sm rounded-xl pl-9 pr-8 py-2 outline-none focus:bg-white/20 transition-colors"
            />
            {isSearching && (
              <button onClick={() => setSearch("")} aria-label="Wyczyść" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80">✕</button>
            )}
          </div>

          {/* Date pill — opens week picker */}
          <button
            onClick={() => setWeekPickerOpen((o) => !o)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              weekPickerOpen || selectedDate
                ? "bg-brand-green text-brand-black"
                : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
            }`}
          >
            {/* Calendar icon */}
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" className="shrink-0">
              <rect x="1" y="2" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.3" />
              <path d="M1 6h12" stroke="currentColor" strokeWidth="1.3" />
              <path d="M4 1v2M10 1v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <span className="whitespace-nowrap">{dateBtnLabel}</span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`transition-transform ${weekPickerOpen ? "rotate-180" : ""}`}>
              <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Row 2: Week picker (collapsible) */}
        {weekPickerOpen && (
          <WeekPicker
            weekDays={weekDays}
            selectedDate={selectedDate}
            schedule={schedule}
            onSelect={selectDay}
            onClear={clearDay}
          />
        )}

        {/* Day banner when filter is active but picker is closed */}
        {selectedDate && !weekPickerOpen && (
          <div className="px-4 pb-2 flex items-center gap-2">
            <span className="text-xs text-brand-green font-medium">
              Menu na: {formatDateLong(new Date(selectedDate + "T00:00:00"))}
            </span>
            <button onClick={clearDay} className="text-white/40 hover:text-white/80 text-xs">✕ pokaż wszystko</button>
          </div>
        )}

        {/* Row 3: Category tabs */}
        <div className="overflow-x-auto scrollbar-hide px-4 pb-3">
          <div className="flex gap-2 w-max">
            {categories.map((cat) => (
              <CategoryTab
                key={cat.id}
                name={cat.name}
                count={catCount(cat)}
                active={cat.id === activeCatId && !isSearching}
                onClick={() => selectCategory(cat.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-4 pb-12">
        {isSearching ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-brand-black/70">
                Wyniki dla <span className="font-semibold text-brand-black">&ldquo;{search.trim()}&rdquo;</span>
                {selectedDate && <span className="text-gray-400"> · {formatDateShort(new Date(selectedDate + "T00:00:00"))}</span>}
              </p>
              <span className="text-xs text-gray-400">{totalHits} pozycji</span>
            </div>
            <SearchResults groups={searchGroups} onOpen={openLightbox} />
          </>
        ) : (
          <>
            <div className="flex items-baseline justify-between mb-3">
              <h1 className="text-lg font-semibold text-brand-black">{activeCategory.name}</h1>
              <span className="text-xs text-gray-400">{categoryItems.length} pozycji</span>
            </div>

            {categoryItems.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="font-medium">Brak pozycji w tym dniu</p>
                <p className="text-sm mt-1">Wybierz inny dzień lub kliknij &ldquo;Wszystko&rdquo;</p>
              </div>
            ) : (
              <ul className="flex flex-col gap-2">
                {categoryItems.map((item) => (
                  <ItemCard key={item.id} item={item} onOpen={openLightbox} />
                ))}
              </ul>
            )}
          </>
        )}
      </main>

      <footer className="bg-brand-black text-white/25 text-center text-xs py-5">
        &copy; {new Date().getFullYear()} Mr. Rollo
      </footer>

      {lightboxItem && <Lightbox item={lightboxItem} onClose={closeLightbox} />}
    </div>
  );
}
