"use client";

import { useState, useMemo, Suspense } from "react";
import { inventory } from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useSearchParams } from "next/navigation";

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  // Filter out bundles for the regular catalog
  const catalogInventory = useMemo(
    () => inventory.filter((item) => item.category !== "Bundle"),
    []
  );

  // Derive filter options from inventory data
  const brands = useMemo(
    () => Array.from(new Set(catalogInventory.map((item) => item.name.split(" ")[0]))),
    [catalogInventory]
  );
  const categories = useMemo(
    () => Array.from(new Set(catalogInventory.map((item) => item.category))),
    [catalogInventory]
  );

  // State for selected filters & mobile collapse drawer
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Active filter count
  const activeFilterCount = selectedBrands.length + selectedCategories.length;

  // Filter inventory based on selected state
  const filteredInventory = useMemo(() => {
    return catalogInventory.filter((item) => {
      const itemBrand = item.name.split(" ")[0];
      const brandMatch =
        selectedBrands.length === 0 || selectedBrands.includes(itemBrand);
      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(item.category);
      return brandMatch && categoryMatch;
    });
  }, [selectedBrands, selectedCategories, catalogInventory]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const resetFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
  };

  // Helper to count items per filter
  const getBrandCount = (brand: string) =>
    catalogInventory.filter((item) => item.name.split(" ")[0] === brand).length;
  const getCategoryCount = (cat: string) =>
    catalogInventory.filter((item) => item.category === cat).length;

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-margin-page py-6 md:py-10 flex flex-col md:flex-row gap-8 lg:gap-16">
        
        {/* MOBILE FILTER TOGGLE BAR */}
        <div className="md:hidden flex items-center justify-between gap-3 bg-surface-container-low p-4 rounded-xl border border-outline-variant/40">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="flex items-center gap-2 font-category-label text-[14px] font-bold uppercase text-on-surface"
          >
            <span className="material-symbols-outlined text-[20px] text-primary">
              tune
            </span>
            <span>Filter & Kategori</span>
            {activeFilterCount > 0 && (
              <span className="bg-primary text-on-primary text-[11px] font-bold px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-3">
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-[12px] font-category-label font-bold text-primary hover:underline uppercase"
              >
                Reset
              </button>
            )}
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isMobileFilterOpen ? "expand_less" : "expand_more"}
              </span>
            </button>
          </div>
        </div>

        {/* MOBILE COLLAPSIBLE FILTER DRAWER */}
        {isMobileFilterOpen && (
          <div className="md:hidden mb-6 bg-surface-container-lowest border-2 border-on-surface p-5 rounded-2xl shadow-xl flex flex-col gap-6">
            {/* Brand Filter */}
            <div>
              <h3 className="font-headline-lg text-sm uppercase font-black tracking-tight text-on-surface border-b-2 border-on-surface pb-2 mb-3">
                Brand
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {brands.map((brand) => {
                  const isChecked = selectedBrands.includes(brand);
                  return (
                    <label
                      key={brand}
                      className="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg bg-surface-container/50 border border-outline-variant/30 hover:border-primary transition-colors"
                      onClick={() => toggleBrand(brand)}
                    >
                      {isChecked ? (
                        <div className="w-4 h-4 border-2 rounded flex items-center justify-center bg-primary border-primary flex-shrink-0 text-on-primary">
                          <span
                            className="material-symbols-outlined text-[12px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            check
                          </span>
                        </div>
                      ) : (
                        <div className="w-4 h-4 border border-outline-variant rounded flex-shrink-0"></div>
                      )}
                      <span
                        className={`font-category-label text-xs font-bold ${
                          isChecked ? "text-primary" : "text-on-surface-variant"
                        }`}
                      >
                        {brand}
                      </span>
                      <span className="ml-auto text-[10px] text-outline font-price-chip">
                        {getBrandCount(brand)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="font-headline-lg text-sm uppercase font-black tracking-tight text-on-surface border-b-2 border-on-surface pb-2 mb-3">
                Kategori
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => {
                  const isChecked = selectedCategories.includes(cat);
                  return (
                    <label
                      key={cat}
                      className="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg bg-surface-container/50 border border-outline-variant/30 hover:border-primary transition-colors"
                      onClick={() => toggleCategory(cat)}
                    >
                      {isChecked ? (
                        <div className="w-4 h-4 border-2 rounded flex items-center justify-center bg-primary border-primary flex-shrink-0 text-on-primary">
                          <span
                            className="material-symbols-outlined text-[12px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            check
                          </span>
                        </div>
                      ) : (
                        <div className="w-4 h-4 border border-outline-variant rounded flex-shrink-0"></div>
                      )}
                      <span
                        className={`font-category-label text-xs font-bold ${
                          isChecked ? "text-primary" : "text-on-surface-variant"
                        }`}
                      >
                        {cat}
                      </span>
                      <span className="ml-auto text-[10px] text-outline font-price-chip">
                        {getCategoryCount(cat)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full bg-primary text-on-primary font-category-label font-bold text-[13px] uppercase py-3 rounded-full hover:bg-primary/90 transition-all shadow-md active:scale-95"
            >
              Terapkan Filter ({filteredInventory.length} Gear)
            </button>
          </div>
        )}

        {/* DESKTOP SIDEBAR (HIDDEN ON MOBILE) */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-[100px] h-[calc(100vh-120px)] overflow-y-auto flex flex-col gap-8 pr-4 scrollbar-thin scrollbar-thumb-outline-variant scrollbar-track-transparent">
            {/* Brand Filter */}
            <div>
              <div className="flex items-center justify-between border-b-2 border-on-surface pb-2 mb-4">
                <h3 className="font-headline-lg text-lg uppercase tracking-tight text-on-surface font-black">
                  Brand
                </h3>
                {selectedBrands.length > 0 && (
                  <button
                    onClick={() => setSelectedBrands([])}
                    className="text-[11px] font-category-label font-bold text-primary uppercase hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-3">
                {brands.map((brand) => {
                  const isChecked = selectedBrands.includes(brand);
                  return (
                    <label
                      key={brand}
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => toggleBrand(brand)}
                    >
                      {isChecked ? (
                        <div className="w-5 h-5 border-2 rounded flex items-center justify-center bg-primary-container border-primary flex-shrink-0">
                          <span
                            className="material-symbols-outlined text-[14px] text-primary"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            check
                          </span>
                        </div>
                      ) : (
                        <div className="w-5 h-5 border-2 border-outline-variant rounded flex items-center justify-center group-hover:border-primary transition-colors flex-shrink-0"></div>
                      )}
                      <span
                        className={`font-category-label text-sm font-bold transition-colors ${
                          isChecked
                            ? "text-on-surface"
                            : "text-on-surface-variant group-hover:text-on-surface"
                        }`}
                      >
                        {brand}
                      </span>
                      <span className="ml-auto text-xs text-outline font-price-chip">
                        {getBrandCount(brand)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <div className="flex items-center justify-between border-b-2 border-on-surface pb-2 mb-4">
                <h3 className="font-headline-lg text-lg uppercase tracking-tight text-on-surface font-black">
                  Kategori
                </h3>
                {selectedCategories.length > 0 && (
                  <button
                    onClick={() => setSelectedCategories([])}
                    className="text-[11px] font-category-label font-bold text-primary uppercase hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-3">
                {categories.map((cat) => {
                  const isChecked = selectedCategories.includes(cat);
                  return (
                    <label
                      key={cat}
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => toggleCategory(cat)}
                    >
                      {isChecked ? (
                        <div className="w-5 h-5 border-2 rounded flex items-center justify-center bg-primary-container border-primary flex-shrink-0">
                          <span
                            className="material-symbols-outlined text-[14px] text-primary"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            check
                          </span>
                        </div>
                      ) : (
                        <div className="w-5 h-5 border-2 border-outline-variant rounded flex items-center justify-center group-hover:border-primary transition-colors flex-shrink-0"></div>
                      )}
                      <span
                        className={`font-category-label text-sm font-bold transition-colors ${
                          isChecked
                            ? "text-on-surface"
                            : "text-on-surface-variant group-hover:text-on-surface"
                        }`}
                      >
                        {cat}
                      </span>
                      <span className="ml-auto text-xs text-outline font-price-chip">
                        {getCategoryCount(cat)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Section */}
        <section className="flex-1 w-full">
          {/* Category Header */}
          <ScrollReveal className="mb-6 pb-4 border-b-2 border-on-surface relative flex items-center justify-between">
            <h1 className="font-display-xl text-[24px] md:text-headline-lg uppercase text-on-surface font-black">
              {selectedCategories.length === 1
                ? selectedCategories[0]
                : "KATALOG PERALATAN"}
            </h1>
            <div className="text-xs font-category-label text-on-surface-variant font-bold">
              {filteredInventory.length} Gear Available
            </div>
            <div className="absolute bottom-[-2px] left-0 w-24 h-0.5 bg-primary"></div>
          </ScrollReveal>

          {filteredInventory.length === 0 ? (
            <div className="text-center py-12 font-body-md text-on-surface-variant">
              Tidak ada gear yang ditemukan untuk filter ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredInventory.map((item, idx) => (
                <ScrollReveal key={item.id} delay={Math.min(idx * 0.05, 0.3)}>
                  <ProductCard item={item} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-on-surface-variant font-category-label font-bold text-sm uppercase tracking-wider animate-pulse">
            Memuat Katalog...
          </div>
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
