"use client";

import { useState, useMemo } from "react";
import menuData from "@/data/menu.json";

type DietTag = "VEGE" | "WEGAN" | "FIT" | "KETO" | "LOW_IG";

interface MenuItem {
  name: string;
  bread?: string;
  description?: string;
  note?: string;
  tags?: DietTag[];
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

const TAG_CONFIG: Record<DietTag, { label: string; bg: string; text: string }> = {
  VEGE:   { label: "Vege",    bg: "bg-diet-vege",  text: "text-brand-black" },
  WEGAN:  { label: "Wegan",   bg: "bg-diet-wegan", text: "text-white" },
  FIT:    { label: "Fit",     bg: "bg-diet-fit",   text: "text-brand-black" },
  KETO:   { label: "Keto",    bg: "bg-diet-keto",  text: "text-brand-black" },
  LOW_IG: { label: "Low IG",  bg: "bg-diet-lowig", text: "text-brand-black" },
};

function DietBadge({ tag }: { tag: DietTag }) {
  const cfg = TAG_CONFIG[tag];
  return (
    <span
      className={`inline-block text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}
    >
      {cfg.label}
    </span>
  );
}

function CategorySection({
  category,
  isOpen,
  onToggle,
}: {
  category: MenuCategory;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mb-2">
      <button
        onClick={onToggle}
        className={`
          w-full flex items-center justify-between px-5 py-4 rounded-2xl
          font-semibold text-left text-base tracking-wide transition-all duration-200
          ${
            isOpen
              ? "bg-brand-black text-brand-green shadow-md"
              : "bg-white text-brand-black hover:bg-brand-green-light shadow-sm hover:shadow"
          }
        `}
      >
        <span>{category.name}</span>
        <span
          className={`ml-3 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M4 6.5L9 11.5L14 6.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="mt-1 grid gap-1.5 px-1">
          {category.items.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl px-4 py-3 flex items-start justify-between gap-3 shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-brand-black leading-snug">
                  {item.name}
                </p>
                {item.bread && (
                  <p className="text-xs text-gray-400 mt-0.5 font-light">{item.bread}</p>
                )}
                {item.description && (
                  <p className="text-xs text-gray-400 mt-0.5 font-light">{item.description}</p>
                )}
                {item.note && (
                  <p className="text-xs text-brand-orange mt-0.5 font-medium">{item.note}</p>
                )}
              </div>
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-end flex-shrink-0 pt-0.5">
                  {item.tags.map((tag) => (
                    <DietBadge key={tag} tag={tag as DietTag} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MenuClient() {
  const categories = menuData.categories as MenuCategory[];
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function expandAll() {
    setOpenIds(new Set(categories.map((c) => c.id)));
  }

  function collapseAll() {
    setOpenIds(new Set());
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            (item.bread?.toLowerCase().includes(q) ?? false)
        ),
      }))
      .filter((cat) => cat.items.length > 0 || cat.name.toLowerCase().includes(q));
  }, [search, categories]);

  const allOpen = filtered.every((c) => openIds.has(c.id));

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <header className="bg-brand-black sticky top-0 z-20 shadow-md">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <div className="text-brand-green font-bold text-2xl tracking-tight leading-none">
              Mr. Rollo
            </div>
            <div className="text-white/50 text-xs mt-0.5 font-light tracking-widest uppercase">
              Naturalnie dla Ciebie
            </div>
          </div>
          <div className="text-brand-green/60 text-xs text-right">
            <span className="block font-medium text-brand-green">{categories.length}</span>
            kategorii
          </div>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto px-4 pb-4">
          <div className="relative">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Szukaj dania..."
              className="w-full bg-white/10 text-white placeholder-white/40 text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:bg-white/20 transition-colors"
            />
          </div>
        </div>
      </header>

      {/* Diet legend */}
      <div className="max-w-2xl mx-auto px-4 pt-4 pb-2">
        <div className="flex flex-wrap gap-2 items-center">
          {(Object.keys(TAG_CONFIG) as DietTag[]).map((tag) => (
            <DietBadge key={tag} tag={tag} />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-2xl mx-auto px-4 py-2 flex items-center justify-between">
        <p className="text-xs text-gray-400">
          {filtered.length} {filtered.length === 1 ? "kategoria" : "kategorii"}
        </p>
        <button
          onClick={allOpen ? collapseAll : expandAll}
          className="text-xs text-brand-black/60 hover:text-brand-black underline underline-offset-2 transition-colors"
        >
          {allOpen ? "Zwiń wszystkie" : "Rozwiń wszystkie"}
        </button>
      </div>

      {/* Categories */}
      <main className="max-w-2xl mx-auto px-4 pb-10">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium">Brak wyników</p>
            <p className="text-sm mt-1">Spróbuj innego hasła</p>
          </div>
        ) : (
          filtered.map((cat) => (
            <CategorySection
              key={cat.id}
              category={cat}
              isOpen={openIds.has(cat.id)}
              onToggle={() => toggle(cat.id)}
            />
          ))
        )}
      </main>

      {/* Footer */}
      <footer className="bg-brand-black text-white/30 text-center text-xs py-6">
        &copy; {new Date().getFullYear()} Mr. Rollo
      </footer>
    </div>
  );
}
