"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import menuData from "@/data/menu.json";
import scheduleData from "@/data/schedule.json";

// ── Types ─────────────────────────────────────────────────────────────────────

interface MenuItem {
  id: string;
  category: string;
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
}

type Schedule = Record<string, string[]>;

// ── Blank image URLs ──────────────────────────────────────────────────────────

const BLANK_URL: Record<string, string> = {
  DESER: "/blanks/DESER.png",
  KANAPKA: "/blanks/KANAPKA.png",
  OBIAD: "/blanks/OBIAD.png",
  SAŁATKA: "/blanks/SA%C5%81ATKA.png",
  SOK: "/blanks/SOK.png",
  ZUPA: "/blanks/ZUPA.png",
  SUSHI: "/blanks/OBIAD.png",
};

// ── Diet config — brandbook 2026 ──────────────────────────────────────────────

const DIET: Record<string, { label: string; bg: string; text: string }> = {
  MIĘSNA: { label: "Mięsna", bg: "bg-diet-miesna", text: "text-brand-black" },
  VEGE: { label: "Vege", bg: "bg-diet-vege", text: "text-brand-black" },
  "VEGE+": { label: "Vege+", bg: "bg-diet-vegep", text: "text-brand-black" },
  WEGAN: { label: "Wegan", bg: "bg-diet-wegan", text: "text-brand-black" },
  FIT: { label: "Fit", bg: "bg-diet-fit", text: "text-brand-black" },
  KETO: { label: "Keto", bg: "bg-diet-keto", text: "text-brand-black" },
  LOW_IG: { label: "Low IG", bg: "bg-diet-lowig", text: "text-brand-black" },
};

function DietBadge({ tag }: { tag: string }) {
  const cfg = DIET[tag];
  if (!cfg) return null;
  return (
    <span
      className={`inline-block text-[10px] font-semibold uppercase tracking-[0.08em] px-2 py-0.5 rounded-full shrink-0 ${cfg.bg} ${cfg.text}`}
      style={{ fontFamily: "var(--font-display)" }}
    >
      {cfg.label}
    </span>
  );
}

// ── Date / week helpers ───────────────────────────────────────────────────────

const PL_DAYS_SHORT = ["Pon", "Wt", "Śr", "Cz", "Pt", "Sob", "Nd"];
const PL_MONTHS_SHORT = [
  "sty",
  "lut",
  "mar",
  "kwi",
  "maj",
  "cze",
  "lip",
  "sie",
  "wrz",
  "paź",
  "lis",
  "gru",
];

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function getWeekDays(ref = new Date()): Date[] {
  const d = new Date(ref);
  const dow = d.getDay();
  // Sunday (0) → jump to next week's Monday (+1)
  // Monday–Saturday → rewind to this week's Monday
  d.setDate(d.getDate() + (dow === 0 ? 1 : 1 - dow));
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
  const dow = d.getDay();
  const dayName = PL_DAYS_SHORT[dow === 0 ? 6 : dow - 1] ?? "";
  return `${dayName}, ${d.getDate()} ${PL_MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

// ── Lightbox ──────────────────────────────────────────────────────────────────

function Lightbox({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const photoSrc = item.hasPhoto
    ? `/photos/${item.id}.png`
    : (BLANK_URL[item.blankType] ?? "/blanks/DESER.png");

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const priceText =
    item.price !== null
      ? item.price.toLocaleString("pl-PL", { minimumFractionDigits: 2 }) + "\u00a0zł"
      : "zapytaj";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(35,31,32,0.72)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-[28px] sm:rounded-[28px] w-full sm:max-w-sm overflow-hidden"
        style={{ boxShadow: "0 28px 80px rgba(35,31,32,0.22)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Photo */}
        <div className="relative w-full aspect-square bg-neutral-50">
          <Image
            src={photoSrc}
            alt={item.name}
            fill
            sizes="(max-width:640px) 100vw,384px"
            className="object-cover"
            priority
          />
          {item.new && (
            <span
              className="absolute top-3 left-3 text-white text-[10px] font-semibold uppercase tracking-[0.08em] px-3 py-1 rounded-full"
              style={{ background: "var(--color-brand-orange)", fontFamily: "var(--font-display)" }}
            >
              Nowość
            </span>
          )}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm transition-colors"
            style={{ background: "rgba(35,31,32,0.45)" }}
            aria-label="Zamknij"
          >
            ×
          </button>
        </div>

        {/* Info */}
        <div className="px-5 py-5 flex flex-col gap-3">
          <p
            className="text-base font-semibold leading-snug"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-brand-black)" }}
          >
            {item.name}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {item.diet && <DietBadge tag={item.diet} />}
            <span
              className="text-sm font-semibold"
              style={{
                fontFamily: "var(--font-display)",
                color:
                  item.price !== null ? "var(--color-brand-black)" : "var(--color-neutral-400)",
                fontStyle: item.price !== null ? "normal" : "italic",
                fontWeight: item.price !== null ? 600 : 400,
              }}
            >
              {priceText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Category tab ──────────────────────────────────────────────────────────────

function CategoryTab({
  name,
  count,
  active,
  onClick,
}: {
  name: string;
  count: number;
  active: boolean;
  onClick: () => void;
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
      className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all"
      style={{
        fontFamily: "var(--font-display)",
        background: active ? "var(--color-brand-green)" : "rgba(255,255,255,0.10)",
        color: active ? "var(--color-brand-black)" : "rgba(255,255,255,0.65)",
        transitionDuration: "200ms",
        transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {name}
      <span className="ml-1.5 text-[11px]" style={{ opacity: active ? 0.5 : 0.35 }}>
        {count}
      </span>
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
    <div className="px-4 pb-3 border-t pt-3" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
        <button
          onClick={onClear}
          className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
          style={{
            fontFamily: "var(--font-display)",
            background: selectedDate === null ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)",
            color: selectedDate === null ? "#fff" : "rgba(255,255,255,0.45)",
          }}
        >
          Wszystko
        </button>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
          {weekDays.map((d, i) => {
            const iso = toISODate(d);
            const isAct = selectedDate === iso;
            const hasSch = !!schedule[iso];
            const isToday = iso === toISODate(new Date());

            return (
              <button
                key={iso}
                onClick={() => onSelect(iso)}
                className="shrink-0 flex flex-col items-center px-3 pt-1.5 pb-1.5 rounded-xl text-xs transition-all relative"
                style={{
                  fontFamily: "var(--font-display)",
                  background: isAct ? "var(--color-brand-green)" : "rgba(255,255,255,0.08)",
                  color: isAct ? "var(--color-brand-black)" : "rgba(255,255,255,0.65)",
                  outline: isToday && !isAct ? "1px solid rgba(198,211,89,0.5)" : "none",
                  outlineOffset: "-1px",
                }}
              >
                <span className="font-semibold text-[11px] uppercase tracking-[0.06em]">
                  {PL_DAYS_SHORT[i]}
                </span>
                <span className="text-base font-bold leading-none mt-0.5">{d.getDate()}</span>
                <span
                  className="mt-1 w-1.5 h-1.5 rounded-full"
                  style={{
                    background: hasSch
                      ? isAct
                        ? "rgba(35,31,32,0.35)"
                        : "var(--color-brand-green)"
                      : "rgba(255,255,255,0.15)",
                  }}
                />
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
  const photoSrc =
    item.hasPhoto && !imgError
      ? `/photos/${item.id}.png`
      : (BLANK_URL[item.blankType] ?? "/blanks/DESER.png");
  const priceText =
    item.price !== null
      ? item.price.toLocaleString("pl-PL", { minimumFractionDigits: 2 }) + "\u00a0zł"
      : "zapytaj";

  return (
    <li
      className="flex items-center gap-3 bg-white rounded-[20px] px-3 py-3 cursor-pointer active:scale-[0.98] transition-transform select-none"
      style={{ boxShadow: "0 2px 6px rgba(35,31,32,0.07)", transitionDuration: "120ms" }}
      onClick={() => onOpen(item)}
    >
      {/* Thumbnail */}
      <div className="relative shrink-0 w-17 h-17 rounded-xl overflow-hidden bg-neutral-50">
        <Image
          src={photoSrc}
          alt={item.name}
          fill
          sizes="68px"
          className="object-cover"
          onError={() => setImgError(true)}
        />
        {item.new && (
          <span
            className="absolute top-1 left-1 text-white text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full leading-none tracking-wide"
            style={{ background: "var(--color-brand-orange)", fontFamily: "var(--font-display)" }}
          >
            NEW
          </span>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium leading-snug"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-brand-black)" }}
        >
          {item.name}
        </p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          {item.diet && <DietBadge tag={item.diet} />}
          <span
            className="text-[11px] font-semibold"
            style={{
              fontFamily: "var(--font-display)",
              color: item.price !== null ? "var(--color-neutral-600)" : "var(--color-neutral-400)",
              fontStyle: item.price !== null ? "normal" : "italic",
              fontWeight: item.price !== null ? 600 : 400,
            }}
          >
            {priceText}
          </span>
        </div>
      </div>

      {/* Chevron */}
      <svg
        className="shrink-0"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        style={{ color: "var(--color-neutral-300)" }}
      >
        <path
          d="M6 4l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </li>
  );
}

// ── Search results ────────────────────────────────────────────────────────────

interface SearchGroup {
  category: MenuCategory;
  items: MenuItem[];
}

function SearchResults({
  groups,
  onOpen,
}: {
  groups: SearchGroup[];
  onOpen: (item: MenuItem) => void;
}) {
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  if (total === 0)
    return (
      <div className="text-center py-16" style={{ color: "var(--color-neutral-400)" }}>
        <p className="font-medium" style={{ fontFamily: "var(--font-display)" }}>
          Brak wyników
        </p>
        <p className="text-sm mt-1" style={{ fontFamily: "var(--font-body)" }}>
          Spróbuj innego hasła
        </p>
      </div>
    );
  return (
    <div className="flex flex-col gap-6">
      {groups.map(({ category, items }) =>
        items.length === 0 ? null : (
          <section key={category.id}>
            <h2
              className="text-[11px] font-semibold uppercase tracking-[0.1em] mb-2 px-1"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-neutral-500)" }}
            >
              {category.name}{" "}
              <span style={{ color: "var(--color-neutral-300)" }}>({items.length})</span>
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
  const allItems = menuData.items as MenuItem[];
  const schedule = scheduleData as Schedule;

  const [activeCatId, setActiveCatId] = useState(categories[0].id);
  const [search, setSearch] = useState("");
  const [lightboxItem, setLightboxItem] = useState<MenuItem | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(() => toISODate(new Date()));
  const [weekPickerOpen, setWeekPickerOpen] = useState(false);

  const weekDays = useMemo(() => getWeekDays(), []);
  const isSearching = search.trim().length > 0;

  const scheduledSet = useMemo(
    () => (selectedDate ? new Set(schedule[selectedDate] ?? []) : null),
    [selectedDate, schedule]
  );

  const categoryItems = useMemo(() => {
    const base = allItems.filter((it) => it.category === activeCatId);
    if (!scheduledSet) return base;
    return base.filter((it) => scheduledSet.has(it.id));
  }, [activeCatId, scheduledSet, allItems]);

  const searchGroups = useMemo<SearchGroup[]>(() => {
    if (!isSearching) return [];
    const q = search.trim().toLowerCase();
    return categories.map((cat) => {
      let pool = allItems.filter((it) => it.category === cat.id);
      if (scheduledSet) pool = pool.filter((it) => scheduledSet.has(it.id));
      return { category: cat, items: pool.filter((it) => it.name.toLowerCase().includes(q)) };
    });
  }, [search, isSearching, scheduledSet, allItems, categories]);

  const totalHits = searchGroups.reduce((n, g) => n + g.items.length, 0);

  const openLightbox = useCallback((item: MenuItem) => setLightboxItem(item), []);
  const closeLightbox = useCallback(() => setLightboxItem(null), []);

  function selectCategory(id: string) {
    setActiveCatId(id);
    setSearch("");
  }
  function selectDay(iso: string) {
    setSelectedDate(iso);
    setWeekPickerOpen(false);
  }
  function clearDay() {
    setSelectedDate(null);
    setWeekPickerOpen(false);
  }

  function catCount(cat: MenuCategory) {
    const base = allItems.filter((it) => it.category === cat.id);
    if (!scheduledSet) return base.length;
    return base.filter((it) => scheduledSet.has(it.id)).length;
  }

  const activeCategory = categories.find((c) => c.id === activeCatId)!;
  const dateBtnLabel = selectedDate
    ? formatDateLong(new Date(selectedDate + "T00:00:00"))
    : formatDateLong(new Date());

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-brand-cream)" }}>
      {/* ── Sticky header ── */}
      <div
        className="sticky top-0 z-20"
        style={{
          background: "var(--color-brand-black)",
          boxShadow: "0 4px 20px rgba(35,31,32,0.22)",
        }}
      >
        {/* Row 1: logo | search | date */}
        <div className="mx-auto px-4 pt-4 pb-3 flex items-center gap-3">
          {/* Logo */}
          <Image
            src="/mrrollo.png"
            alt="Mr. Rollo"
            width={42}
            height={42}
            className="object-contain shrink-0"
            style={{ borderRadius: "50%" }}
          />

          {/* Search input */}
          <div className="relative flex-1 min-w-0">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              style={{ color: "rgba(255,255,255,0.30)" }}
            >
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M11 11L14 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Szukaj…"
              className="w-full text-sm rounded-xl pl-9 pr-8 py-2 outline-none transition-colors"
              style={{
                fontFamily: "var(--font-display)",
                background: "rgba(255,255,255,0.10)",
                color: "#fff",
                caretColor: "var(--color-brand-green)",
              }}
              onFocus={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.16)")}
              onBlur={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.10)")}
            />
            {isSearching && (
              <button
                onClick={() => setSearch("")}
                aria-label="Wyczyść"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                style={{ color: "rgba(255,255,255,0.40)" }}
              >
                ×
              </button>
            )}
          </div>

          {/* Date pill */}
          <button
            onClick={() => setWeekPickerOpen((o) => !o)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all"
            style={{
              fontFamily: "var(--font-display)",
              background:
                weekPickerOpen || selectedDate
                  ? "var(--color-brand-green)"
                  : "rgba(255,255,255,0.10)",
              color:
                weekPickerOpen || selectedDate
                  ? "var(--color-brand-black)"
                  : "rgba(255,255,255,0.65)",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" className="shrink-0">
              <rect
                x="1"
                y="2"
                width="12"
                height="11"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <path d="M1 6h12" stroke="currentColor" strokeWidth="1.3" />
              <path
                d="M4 1v2M10 1v2"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            <span className="whitespace-nowrap">{dateBtnLabel}</span>
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              className="transition-transform"
              style={{ transform: weekPickerOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <path
                d="M2 3.5l3 3 3-3"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Row 2: Week picker */}
        {weekPickerOpen && (
          <WeekPicker
            weekDays={weekDays}
            selectedDate={selectedDate}
            schedule={schedule}
            onSelect={selectDay}
            onClear={clearDay}
          />
        )}

        {/* Day filter banner */}
        {selectedDate && !weekPickerOpen && (
          <div className="px-4 pb-2 flex items-center gap-2">
            <span
              className="text-xs font-medium"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-brand-green)" }}
            >
              Menu na: {formatDateLong(new Date(selectedDate + "T00:00:00"))}
            </span>
            <button
              onClick={clearDay}
              className="text-xs transition-colors"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              × pokaż wszystko
            </button>
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
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-5 pb-12">
        {isSearching ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <p
                className="text-sm"
                style={{ fontFamily: "var(--font-body)", color: "var(--color-neutral-600)" }}
              >
                Wyniki dla{" "}
                <span className="font-semibold" style={{ color: "var(--color-brand-black)" }}>
                  &ldquo;{search.trim()}&rdquo;
                </span>
                {selectedDate && (
                  <span style={{ color: "var(--color-neutral-400)" }}>
                    {" · "}
                    {formatDateShort(new Date(selectedDate + "T00:00:00"))}
                  </span>
                )}
              </p>
              <span
                className="text-xs"
                style={{ color: "var(--color-neutral-400)", fontFamily: "var(--font-display)" }}
              >
                {totalHits} pozycji
              </span>
            </div>
            <SearchResults groups={searchGroups} onOpen={openLightbox} />
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-6 border font-semibold border-green-600 text-green-600 bg-white">
              <span className="text-base shrink-0" aria-hidden="true">
                i
              </span>
              <p className="text-sm font-medium leading-snug">
                Oferta dostępna stacjonarnie u handlowców.
              </p>
            </div>
            <div className="flex items-baseline justify-between mb-4">
              <h1
                className="text-lg font-semibold"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-brand-black)" }}
              >
                {activeCategory.name}
              </h1>
              <span
                className="text-xs"
                style={{ color: "var(--color-neutral-400)", fontFamily: "var(--font-display)" }}
              >
                {categoryItems.length} pozycji
              </span>
            </div>

            {categoryItems.length === 0 ? (
              <div className="text-center py-16" style={{ color: "var(--color-neutral-400)" }}>
                <p className="font-medium" style={{ fontFamily: "var(--font-display)" }}>
                  Brak pozycji w tym dniu
                </p>
                <p className="text-sm mt-1" style={{ fontFamily: "var(--font-body)" }}>
                  Wybierz inny dzień lub kliknij &ldquo;Wszystko&rdquo;
                </p>
              </div>
            ) : (
              <ul className="flex flex-col gap-2.5">
                {categoryItems.map((item) => (
                  <ItemCard key={item.id} item={item} onOpen={openLightbox} />
                ))}
              </ul>
            )}
          </>
        )}
      </main>

      {/* ── Footer ── */}
      <footer
        className="text-center text-xs py-5"
        style={{
          background: "var(--color-brand-black)",
          color: "rgba(255,255,255,0.22)",
          fontFamily: "var(--font-display)",
        }}
      >
        &copy; {new Date().getFullYear()} Mr. Rollo · Catering dietetyczny
      </footer>

      {lightboxItem && <Lightbox item={lightboxItem} onClose={closeLightbox} />}
    </div>
  );
}
