"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  Mic,
  Camera,
  X,
  Pill,
  Tag,
  Layers,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Zap,
} from "lucide-react";

// ─── DATA ──────────────────────────────────────────────────────────────────────

interface SearchResult {
  id: string;
  name: string;
  category: "medicine" | "brand" | "category";
  type?: "rx" | "otc";
  price?: number;
  mrp?: number;
  brand?: string;
  isBranded?: boolean;
  genericName?: string;
  genericPrice?: number;
}

const SEARCH_DATA: SearchResult[] = [
  // Medicines
  { id: "m1", name: "Dolo 650", category: "medicine", type: "otc", price: 30, mrp: 35, brand: "Micro Labs", isBranded: true, genericName: "Paracetamol 650mg", genericPrice: 18 },
  { id: "m2", name: "Crocin Advance 500mg", category: "medicine", type: "otc", price: 38, mrp: 42, brand: "GSK", isBranded: true, genericName: "Paracetamol 500mg", genericPrice: 12 },
  { id: "m3", name: "Pantoprazole 40mg", category: "medicine", type: "rx", price: 55, mrp: 70, brand: "Sun Pharma", isBranded: true, genericName: "Pantoprazole 40mg (Generic)", genericPrice: 22 },
  { id: "m4", name: "Metformin 500mg", category: "medicine", type: "rx", price: 48, mrp: 60, brand: "USV", isBranded: true, genericName: "Metformin 500mg (Generic)", genericPrice: 20 },
  { id: "m5", name: "Azithromycin 500mg", category: "medicine", type: "rx", price: 110, mrp: 145, brand: "Cipla", isBranded: true, genericName: "Azithromycin 500mg (Generic)", genericPrice: 65 },
  { id: "m6", name: "Cetirizine 10mg", category: "medicine", type: "otc", price: 22, mrp: 28, brand: "Elder", isBranded: true, genericName: "Cetirizine 10mg (Generic)", genericPrice: 10 },
  { id: "m7", name: "Ibuprofen 400mg", category: "medicine", type: "otc", price: 28, mrp: 35, brand: "Abbott", isBranded: true, genericName: "Ibuprofen 400mg (Generic)", genericPrice: 12 },
  { id: "m8", name: "Omeprazole 20mg", category: "medicine", type: "rx", price: 42, mrp: 55, brand: "Torrent", isBranded: true, genericName: "Omeprazole 20mg (Generic)", genericPrice: 18 },
  // Brands
  { id: "b1", name: "Cipla", category: "brand" },
  { id: "b2", name: "Sun Pharma", category: "brand" },
  { id: "b3", name: "Abbott India", category: "brand" },
  { id: "b4", name: "Dr. Reddy's", category: "brand" },
  { id: "b5", name: "Micro Labs", category: "brand" },
  // Categories
  { id: "c1", name: "Antibiotics", category: "category" },
  { id: "c2", name: "Pain Relief", category: "category" },
  { id: "c3", name: "Diabetes Care", category: "category" },
  { id: "c4", name: "Allergy & Cold", category: "category" },
  { id: "c5", name: "Heart & BP", category: "category" },
  { id: "c6", name: "Vitamins & Supplements", category: "category" },
];

// Typo-tolerance aliases (simulated fuzzy matching)
const ALIASES: Record<string, string> = {
  "dolo 60": "dolo 650",
  "dolo60": "dolo 650",
  "paracetamol": "dolo 650",
  "crocin": "crocin advance 500mg",
  "pan40": "pantoprazole 40mg",
  "metfromin": "metformin 500mg",
  "azith": "azithromycin 500mg",
  "cetirizin": "cetirizine 10mg",
  "ibuprofin": "ibuprofen 400mg",
  "omepraz": "omeprazole 20mg",
};

// ─── FILTER PILLS ─────────────────────────────────────────────────────────────

const FILTER_PILLS = [
  { id: "all", label: "All" },
  { id: "otc", label: "OTC Only (No Rx)" },
  { id: "medicine", label: "Medicines" },
  { id: "brand", label: "Brands" },
  { id: "category", label: "Categories" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function fuzzySearch(query: string): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  // Check for alias first
  const aliased = ALIASES[q];
  const searchTerm = aliased ?? q;

  return SEARCH_DATA.filter((item) =>
    item.name.toLowerCase().includes(searchTerm) ||
    item.brand?.toLowerCase().includes(searchTerm) ||
    item.name.toLowerCase().includes(q) ||
    item.brand?.toLowerCase().includes(q)
  );
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

interface SearchOmnibarProps {
  isMobile?: boolean;
}

export default function SearchOmnibar({ isMobile = false }: SearchOmnibarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Voice state
  const [voiceState, setVoiceState] = useState<"idle" | "listening" | "done">("idle");

  // Camera state
  const [cameraState, setCameraState] = useState<"idle" | "scanning" | "done">("idle");

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Search Logic
  useEffect(() => {
    const q = query.trim();
    if (q.length === 0) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    const found = fuzzySearch(q);
    setResults(found);
    setIsOpen(true);
  }, [query]);

  // ── Filter results
  const filteredResults = results.filter((r) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "otc") return r.type === "otc";
    return r.category === activeFilter;
  });

  const medicines = filteredResults.filter((r) => r.category === "medicine");
  const brands = filteredResults.filter((r) => r.category === "brand");
  const categories = filteredResults.filter((r) => r.category === "category");

  // ── Close on outside click
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  // ── Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // ── Voice Input Simulation
  const handleVoice = () => {
    if (voiceState !== "idle") return;
    setVoiceState("listening");
    setTimeout(() => {
      setQuery("Paracetamol 500mg");
      setVoiceState("done");
      setIsOpen(true);
      setTimeout(() => setVoiceState("idle"), 1500);
    }, 2000);
  };

  // ── Camera Input Simulation
  const handleCamera = () => {
    if (cameraState !== "idle") return;
    setCameraState("scanning");
    setTimeout(() => {
      setQuery("Dolo 650");
      setCameraState("done");
      setIsOpen(true);
      setTimeout(() => setCameraState("idle"), 1200);
    }, 2000);
  };

  const handleSelect = (name: string) => {
    setQuery(name);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const clearQuery = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const hasResults = filteredResults.length > 0;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* ── Input Bar ── */}
      <div
        className={`flex items-center gap-2 bg-gray-100 rounded-full px-4 transition-all
          ${isOpen ? "ring-2 ring-[#1E6FD9]/30 bg-white shadow-md" : "hover:bg-gray-200"}
          ${isMobile ? "py-2" : "py-2.5"}
        `}
      >
        {/* Search icon */}
        <Search className="w-[18px] h-[18px] text-gray-400 flex-shrink-0" />

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-500 outline-none min-w-0"
          placeholder={isMobile ? "Search medicines..." : "Search for medicines, brands, categories..."}
          aria-label="Search medicines and healthcare products"
          aria-autocomplete="list"
          aria-expanded={isOpen}
        />

        {/* Clear button */}
        {query.length > 0 && (
          <button
            onClick={clearQuery}
            className="p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Divider */}
        <div className="w-px h-5 bg-gray-300 flex-shrink-0" />

        {/* Mic button */}
        <button
          onClick={handleVoice}
          className={`relative p-1.5 rounded-full flex-shrink-0 transition-all min-w-[36px] min-h-[36px] flex items-center justify-center
            ${voiceState === "listening"
              ? "bg-red-100 text-red-500"
              : "hover:bg-gray-200 text-gray-500 hover:text-[#1E6FD9]"
            }`}
          aria-label="Voice search"
          title="Voice search"
        >
          {voiceState === "listening" && (
            <span className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-60" />
          )}
          <Mic className="w-[18px] h-[18px]" />
        </button>

        {/* Camera button */}
        <button
          onClick={handleCamera}
          className={`relative p-1.5 rounded-full flex-shrink-0 transition-all min-w-[36px] min-h-[36px] flex items-center justify-center
            ${cameraState === "scanning"
              ? "bg-blue-100 text-[#1E6FD9]"
              : "hover:bg-gray-200 text-gray-500 hover:text-[#1E6FD9]"
            }`}
          aria-label="Visual pill recognition search"
          title="Pill recognition search"
        >
          <Camera className="w-[18px] h-[18px]" />
        </button>
      </div>

      {/* ── Voice Listening Feedback ── */}
      {voiceState === "listening" && (
        <div className="absolute top-full mt-2 left-0 right-0 z-[60] bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Mic className="w-5 h-5 text-red-500" />
            </div>
            <span className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Listening…</p>
            <p className="text-xs text-gray-500">Speak now — e.g. "Dolo 650" or "Paracetamol"</p>
          </div>
          <div className="ml-auto flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-1 bg-red-400 rounded-full animate-bounce"
                style={{ height: `${8 + (i % 3) * 6}px`, animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Camera Scanning Overlay ── */}
      {cameraState === "scanning" && (
        <div className="absolute top-full mt-2 left-0 right-0 z-[60] bg-white rounded-2xl shadow-xl border border-blue-100 p-4">
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="relative w-24 h-24 border-2 border-dashed border-[#1E6FD9] rounded-xl flex items-center justify-center">
              <Camera className="w-8 h-8 text-[#1E6FD9] opacity-60" />
              {/* Corner brackets */}
              {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos, i) => (
                <span
                  key={i}
                  className={`absolute w-4 h-4 border-[#1E6FD9] ${pos} ${
                    i < 2 ? "border-t-2" : "border-b-2"
                  } ${i % 2 === 0 ? "border-l-2" : "border-r-2"}`}
                />
              ))}
              {/* Scan line animation */}
              <div
                className="absolute left-0 right-0 h-0.5 bg-[#1E6FD9]/60"
                style={{ animation: "scanLine 1.5s ease-in-out infinite", top: "50%" }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-[#1E6FD9] animate-spin" />
              <p className="text-sm font-semibold text-gray-700">Recognising pill…</p>
            </div>
            <p className="text-xs text-gray-400 text-center">Hold your pill/medicine up to the camera</p>
          </div>
        </div>
      )}

      {/* ── Dropdown Results ── */}
      {isOpen && voiceState === "idle" && cameraState === "idle" && (
        <div className="absolute top-full mt-2 left-0 right-0 z-[60] bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden">

          {/* Filter Pills */}
          <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide border-b border-gray-100 snap-x snap-mandatory">
            {FILTER_PILLS.map((pill) => (
              <button
                key={pill.id}
                onClick={() => setActiveFilter(pill.id)}
                className={`flex-shrink-0 snap-start px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all min-h-[32px]
                  ${activeFilter === pill.id
                    ? pill.id === "otc"
                      ? "bg-[#4CAF50] text-white shadow-sm"
                      : "bg-[#1E6FD9] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {pill.id === "otc" && <span className="mr-1">✓</span>}
                {pill.label}
              </button>
            ))}
          </div>

          {/* Results */}
          <div className="max-h-[420px] overflow-y-auto">
            {!hasResults && query.length > 0 ? (
              <div className="p-6 text-center text-gray-400">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium">No results for &quot;{query}&quot;</p>
                <p className="text-xs mt-1">Try a different spelling or browse categories</p>
              </div>
            ) : (
              <div>
                {/* Medicines Section */}
                {medicines.length > 0 && (
                  <div>
                    <div className="px-4 pt-3 pb-1 flex items-center gap-2 sticky top-0 bg-white/95 backdrop-blur-sm">
                      <Pill className="w-3.5 h-3.5 text-[#1E6FD9]" />
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Medicines</span>
                    </div>
                    {medicines.map((item) => (
                      <MedicineRow
                        key={item.id}
                        item={item}
                        isHovered={hoveredItem === item.id}
                        onHover={() => setHoveredItem(item.id)}
                        onLeave={() => setHoveredItem(null)}
                        onSelect={handleSelect}
                      />
                    ))}
                  </div>
                )}

                {/* Brands Section */}
                {brands.length > 0 && (
                  <div>
                    <div className="px-4 pt-3 pb-1 flex items-center gap-2 sticky top-0 bg-white/95 backdrop-blur-sm">
                      <Tag className="w-3.5 h-3.5 text-[#4CAF50]" />
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Brands</span>
                    </div>
                    {brands.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item.name)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left"
                        aria-label={`Search brand ${item.name}`}
                      >
                        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                          <Tag className="w-4 h-4 text-[#4CAF50]" />
                        </div>
                        <span className="text-sm font-medium text-gray-800">{item.name}</span>
                        <ArrowRight className="w-4 h-4 text-gray-300 ml-auto" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Categories Section */}
                {categories.length > 0 && (
                  <div>
                    <div className="px-4 pt-3 pb-1 flex items-center gap-2 sticky top-0 bg-white/95 backdrop-blur-sm">
                      <Layers className="w-3.5 h-3.5 text-purple-500" />
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Categories</span>
                    </div>
                    <div className="px-4 pb-3 flex flex-wrap gap-2">
                      {categories.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(item.name)}
                          className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 rounded-full text-xs font-semibold text-purple-700 transition-colors border border-purple-100 min-h-[32px]"
                          aria-label={`Browse category ${item.name}`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {hasResults && (
            <div className="border-t border-gray-100 px-4 py-2.5 flex items-center justify-between bg-gray-50">
              <span className="text-xs text-gray-400">{filteredResults.length} result{filteredResults.length !== 1 ? "s" : ""}</span>
              <button
                onClick={() => { setIsOpen(false); }}
                className="text-xs font-semibold text-[#1E6FD9] hover:underline flex items-center gap-1"
              >
                View all results <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Global scanLine animation style */}
      <style>{`
        @keyframes scanLine {
          0% { transform: translateY(-40px); opacity: 0.4; }
          50% { opacity: 1; }
          100% { transform: translateY(40px); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

// ─── MEDICINE ROW ─────────────────────────────────────────────────────────────

interface MedicineRowProps {
  item: SearchResult;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onSelect: (name: string) => void;
}

function MedicineRow({ item, isHovered, onHover, onLeave, onSelect }: MedicineRowProps) {
  const discount = item.price && item.mrp
    ? Math.round(((item.mrp - item.price) / item.mrp) * 100)
    : 0;

  const genericSaving = item.price && item.genericPrice
    ? Math.round(((item.price - item.genericPrice) / item.price) * 100)
    : 40;

  return (
    <div onMouseEnter={onHover} onMouseLeave={onLeave}>
      {/* Main result row */}
      <button
        onClick={() => onSelect(item.name)}
        className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${isHovered ? "bg-blue-50" : "hover:bg-gray-50"}`}
        aria-label={`Select ${item.name}`}
      >
        {/* Icon */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.type === "rx" ? "bg-orange-50" : "bg-blue-50"}`}>
          <Pill className={`w-4 h-4 ${item.type === "rx" ? "text-orange-500" : "text-[#1E6FD9]"}`} />
        </div>

        {/* Name and brand */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-800 truncate">{item.name}</span>
            {item.type === "rx" ? (
              <span className="flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-600 flex items-center gap-0.5">
                <ShieldCheck className="w-2.5 h-2.5" /> Rx
              </span>
            ) : (
              <span className="flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-[#4CAF50]">
                OTC
              </span>
            )}
          </div>
          {item.brand && (
            <span className="text-xs text-gray-400">{item.brand}</span>
          )}
        </div>

        {/* Price */}
        {item.price && (
          <div className="text-right flex-shrink-0">
            <div className="flex items-center gap-1 justify-end">
              <span className="text-sm font-bold text-[#1E6FD9]">₹{item.price}</span>
              {discount > 0 && (
                <span className="text-[10px] font-bold text-[#4CAF50] bg-green-50 px-1 py-0.5 rounded">
                  -{discount}%
                </span>
              )}
            </div>
            {item.mrp && (
              <span className="text-xs text-gray-400 line-through">₹{item.mrp}</span>
            )}
          </div>
        )}
      </button>

      {/* Generic Swap Card — shows on hover for branded items */}
      {isHovered && item.isBranded && item.genericName && (
        <div className="mx-4 mb-2 mt-0 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm border border-green-100">
            <Zap className="w-4 h-4 text-[#4CAF50]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#4CAF50] uppercase tracking-wide">Nivimeds Suggested Generic</span>
            </div>
            <p className="text-xs font-semibold text-gray-700 truncate">{item.genericName}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="inline-flex items-center gap-1 bg-[#4CAF50] text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-0.5">
              Save {genericSaving}%
            </div>
            <div className="text-xs font-bold text-gray-700">₹{item.genericPrice}</div>
          </div>
          <button
            onClick={() => onSelect(item.genericName!)}
            className="flex-shrink-0 text-xs font-bold text-[#1E6FD9] hover:underline whitespace-nowrap flex items-center gap-0.5 ml-1"
            aria-label={`Select generic ${item.genericName}`}
          >
            Select <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
