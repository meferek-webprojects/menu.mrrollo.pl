"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import menuData from "@/data/menu.json";
import Link from "next/link";

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

// ── Blank image URLs (Polish filenames → percent-encoded) ─────────────────────

const BLANK_URL: Record<string, string> = {
  DESER: "/blanks/DESER.png",
  KANAPKA: "/blanks/KANAPKA.png",
  OBIAD: "/blanks/OBIAD.png",
  SAŁATKA: "/blanks/SA%C5%81ATKA.png",
  SOK: "/blanks/SOK.png",
  ZUPA: "/blanks/ZUPA.png",
};

// ── Diet badge config (brandbook 2026, str. 13) ───────────────────────────────

const DIET: Record<string, { label: string; bg: string; text: string }> = {
  MIĘSNA: { label: "Mięsna", bg: "bg-diet-miesna", text: "text-brand-black" },
  VEGE: { label: "Vege", bg: "bg-diet-vege", text: "text-brand-black" },
  "VEGE+": { label: "Vege+", bg: "bg-diet-vegep", text: "text-brand-black" },
  WEGAN: { label: "Wegan", bg: "bg-diet-wegan", text: "text-white" },
  FIT: { label: "Fit", bg: "bg-diet-fit", text: "text-brand-black" },
  KETO: { label: "Keto", bg: "bg-diet-keto", text: "text-brand-black" },
  LOW_IG: { label: "Low IG", bg: "bg-diet-lowig", text: "text-brand-black" },
};

function DietBadge({ tag }: { tag: string }) {
  const cfg = DIET[tag];
  if (!cfg) return null;
  return (
    <span
      className={`inline-block text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0 ${cfg.bg} ${cfg.text}`}
    >
      {cfg.label}
    </span>
  );
}

// ── Lightbox ──────────────────────────────────────────────────────────────────

function Lightbox({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const photoSrc = item.hasPhoto
    ? `/photos/${item.id}.png`
    : (BLANK_URL[item.blankType] ?? "/blanks/DESER.png");

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll
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
      className="fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] z-50 flex items-end sm:items-center justify-center w-full h-full bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full sm:max-w-sm overflow-hidden shadow-2xl m-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Full image */}
        <div className="relative w-full aspect-square bg-gray-50">
          <Image
            src={photoSrc}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, 384px"
            className="object-cover"
            priority
          />
          {item.new && (
            <span className="absolute top-3 left-3 bg-brand-orange text-white text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full shadow">
              Nowość
            </span>
          )}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors text-sm"
            aria-label="Zamknij"
          >
            ✕
          </button>
        </div>

        {/* Info */}
        <div className="flex flex-col px-5 py-4">
          <p className="text-base font-semibold text-brand-black leading-snug">{item.name}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {item.diet && <DietBadge tag={item.diet} />}
            <span
              className={`text-sm font-bold ${
                item.price !== null ? "text-brand-black" : "text-gray-400 italic font-normal"
              }`}
            >
              {priceText}
            </span>
          </div>
          <Link
            href="https://sklep.mrrollo.pl/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center mt-12 bg-brand-green text-brand-black hover:bg-brand-green/80 text-sm font-bold py-2 px-4 rounded-full transition-colors"
          >
            Przejdź na stronę sklepu
          </Link>
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
      className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
        active
          ? "bg-brand-green text-brand-black font-semibold shadow-sm"
          : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
      }`}
    >
      {name}
      <span className={`ml-1.5 text-[11px] ${active ? "text-brand-black/60" : "text-white/40"}`}>
        {count}
      </span>
    </button>
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
      className="flex items-center gap-3 bg-white rounded-2xl px-3 py-3 shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
      onClick={() => onOpen(item)}
    >
      {/* Thumbnail */}
      <div className="relative shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gray-50">
        <Image
          src={photoSrc}
          alt={item.name}
          fill
          sizes="64px"
          className="object-cover"
          onError={() => setImgError(true)}
        />
        {item.new && (
          <span className="absolute top-0.5 left-0.5 bg-brand-orange text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full leading-none">
            NEW
          </span>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-brand-black leading-snug">{item.name}</p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          {item.diet && <DietBadge tag={item.diet} />}
          <span
            className={`text-[11px] font-semibold ${
              item.price !== null ? "text-brand-black" : "text-gray-400 italic font-normal"
            }`}
          >
            {priceText}
          </span>
        </div>
      </div>

      {/* Chevron hint */}
      <svg
        className="shrink-0 text-gray-300"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
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

// ── Global search results ─────────────────────────────────────────────────────

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
              {category.name}
              <span className="ml-1 text-gray-300">({items.length})</span>
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

// ── Main ──────────────────────────────────────────────────────────────────────

export default function MenuClient() {
  const categories = menuData.categories as MenuCategory[];
  const [activeCatId, setActiveCatId] = useState(categories[0].id);
  const [search, setSearch] = useState("");
  const [lightboxItem, setLightboxItem] = useState<MenuItem | null>(null);

  const activeCategory = categories.find((c) => c.id === activeCatId)!;
  const isSearching = search.trim().length > 0;

  const searchGroups = useMemo<SearchGroup[]>(() => {
    if (!isSearching) return [];
    const q = search.trim().toLowerCase();
    return categories.map((cat) => ({
      category: cat,
      items: cat.items.filter((item) => item.name.toLowerCase().includes(q)),
    }));
  }, [search, isSearching, categories]);

  const totalHits = searchGroups.reduce((n, g) => n + g.items.length, 0);

  const openLightbox = useCallback((item: MenuItem) => setLightboxItem(item), []);
  const closeLightbox = useCallback(() => setLightboxItem(null), []);

  function selectCategory(id: string) {
    setActiveCatId(id);
    setSearch("");
  }

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col">
      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-20 bg-brand-black shadow-lg">
        <div className="mx-auto px-4 pt-4 pb-3 flex items-center gap-3">
          <Image
            src="/mrrollo.png"
            alt="Mr. Rollo"
            width={42}
            height={42}
            className="object-contain shrink-0"
          />

          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
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
              placeholder="Szukaj w całym menu…"
              className="w-full bg-white/10 text-white placeholder-white/30 text-sm rounded-xl pl-9 pr-8 py-2 outline-none focus:bg-white/20 transition-colors"
            />
            {isSearching && (
              <button
                onClick={() => setSearch("")}
                aria-label="Wyczyść"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category tabs */}
        <div className="overflow-x-auto scrollbar-hide px-4 pb-3">
          <div className="flex gap-2 w-max">
            {categories.map((cat) => (
              <CategoryTab
                key={cat.id}
                name={cat.name}
                count={cat.items.length}
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
                Wyniki dla{" "}
                <span className="font-semibold text-brand-black">
                  &ldquo;{search.trim()}&rdquo;
                </span>
              </p>
              <span className="text-xs text-gray-400">{totalHits} pozycji</span>
            </div>
            <SearchResults groups={searchGroups} onOpen={openLightbox} />
          </>
        ) : (
          <>
            <div className="flex items-baseline justify-between mb-3">
              <h1 className="text-lg font-semibold text-brand-black">{activeCategory.name}</h1>
              <span className="text-xs text-gray-400">{activeCategory.items.length} pozycji</span>
            </div>
            <ul className="flex flex-col gap-2">
              {activeCategory.items.map((item) => (
                <ItemCard key={item.id} item={item} onOpen={openLightbox} />
              ))}
            </ul>
          </>
        )}
      </main>

      <footer className="bg-brand-black text-white/25 text-center text-xs py-5">
        &copy; {new Date().getFullYear()} Mr. Rollo
      </footer>

      {/* ── Lightbox ── */}
      {lightboxItem && <Lightbox item={lightboxItem} onClose={closeLightbox} />}
    </div>
  );
}
