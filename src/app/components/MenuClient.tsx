"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import menuData from "@/data/menu.json";

// ── Types ─────────────────────────────────────────────────────────────────────

type DietTag = "MIĘSNA" | "VEGE" | "VEGE+" | "WEGAN" | "FIT" | "KETO" | "LOW_IG";

interface MenuItem {
  id: string;
  name: string;
  diet: string | null;
  hasPhoto: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

// ── Diet badge config ──────────────────────────────────────────────────────────

const DIET: Record<string, { label: string; bg: string; text: string }> = {
  MIĘSNA: { label: "Mięsna",  bg: "bg-diet-miesna", text: "text-brand-black" },
  VEGE:   { label: "Vege",    bg: "bg-diet-vege",   text: "text-brand-black" },
  "VEGE+":{ label: "Vege+",   bg: "bg-diet-vegep",  text: "text-brand-black" },
  WEGAN:  { label: "Wegan",   bg: "bg-diet-wegan",  text: "text-white" },
  FIT:    { label: "Fit",     bg: "bg-diet-fit",    text: "text-brand-black" },
  KETO:   { label: "Keto",    bg: "bg-diet-keto",   text: "text-brand-black" },
  LOW_IG: { label: "Low IG",  bg: "bg-diet-lowig",  text: "text-brand-black" },
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
    if (active && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [active]);

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`
        shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap
        ${
          active
            ? "bg-brand-green text-brand-black font-semibold shadow-sm"
            : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
        }
      `}
    >
      {name}
      <span
        className={`ml-1.5 text-[11px] ${active ? "text-brand-black/60" : "text-white/40"}`}
      >
        {count}
      </span>
    </button>
  );
}

// ── Item card ─────────────────────────────────────────────────────────────────

function ItemCard({ item }: { item: MenuItem }) {
  const [imgError, setImgError] = useState(false);
  const showImage = item.hasPhoto && !imgError;

  return (
    <li className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm">
      {showImage && (
        <div className="relative shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gray-50">
          <Image
            src={`/photos/${item.id}.png`}
            alt={item.name}
            fill
            sizes="64px"
            className="object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-brand-black leading-snug">{item.name}</p>
        {item.diet && (
          <div className="mt-1.5">
            <DietBadge tag={item.diet} />
          </div>
        )}
      </div>
    </li>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MenuClient() {
  const categories = menuData.categories as MenuCategory[];
  const [activeCatId, setActiveCatId] = useState(categories[0].id);
  const [search, setSearch] = useState("");

  const activeCategory = categories.find((c) => c.id === activeCatId)!;

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return activeCategory.items;
    return activeCategory.items.filter((item) =>
      item.name.toLowerCase().includes(q)
    );
  }, [activeCategory, search]);

  function selectCategory(id: string) {
    setActiveCatId(id);
    setSearch("");
  }

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col">

      {/* ── Sticky header + category bar ── */}
      <div className="sticky top-0 z-20 bg-brand-black shadow-lg">

        {/* Header */}
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-3 flex items-center justify-between">
          <div>
            <div className="text-brand-green font-bold text-2xl tracking-tight leading-none" style={{ fontFamily: "var(--font-jost)" }}>
              Mr. Rollo
            </div>
            <div className="text-white/40 text-[11px] mt-0.5 tracking-widest uppercase font-light">
              Naturalnie dla Ciebie
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
              width="14" height="14" viewBox="0 0 16 16" fill="none"
            >
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Szukaj…"
              className="bg-white/10 text-white placeholder-white/30 text-sm rounded-xl pl-9 pr-3 py-2 outline-none focus:bg-white/20 transition-colors w-36"
            />
          </div>
        </div>

        {/* Category tabs — horizontal scroll, hidden scrollbar */}
        <div className="overflow-x-auto scrollbar-hide px-4 pb-3">
          <div className="flex gap-2 w-max">
            {categories.map((cat) => (
              <CategoryTab
                key={cat.id}
                name={cat.name}
                count={cat.items.length}
                active={cat.id === activeCatId}
                onClick={() => selectCategory(cat.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Items list ── */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-4 pb-12">

        {/* Category heading */}
        <div className="flex items-baseline justify-between mb-3">
          <h1 className="text-lg font-semibold text-brand-black">{activeCategory.name}</h1>
          <span className="text-xs text-gray-400">
            {filteredItems.length} {filteredItems.length === 1 ? "pozycja" : "pozycji"}
          </span>
        </div>

        {/* Diet legend for this category */}
        {(() => {
          const tagsInView = [...new Set(filteredItems.map((i) => i.diet).filter(Boolean) as string[])];
          if (tagsInView.length === 0) return null;
          return (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {tagsInView.map((tag) => (
                <DietBadge key={tag} tag={tag} />
              ))}
            </div>
          );
        })()}

        {filteredItems.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="font-medium">Brak wyników</p>
            <p className="text-sm mt-1">Spróbuj innego hasła</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </ul>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-brand-black text-white/25 text-center text-xs py-5">
        &copy; {new Date().getFullYear()} Mr. Rollo
      </footer>
    </div>
  );
}
