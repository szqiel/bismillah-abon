"use client";

import { useState, useMemo } from "react";
import { inventory } from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";
import { useSearchParams } from "next/navigation";

export default function CatalogPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  // Filter out bundles for the regular catalog
  const catalogInventory = inventory.filter(item => item.category !== "Bundle");

  // Derive filter options from inventory data
  const brands = Array.from(new Set(catalogInventory.map(item => item.name.split(" ")[0])));
  const categories = Array.from(new Set(catalogInventory.map(item => item.category)));

  // State for selected filters
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);

  // Filter inventory based on selected state
  const filteredInventory = useMemo(() => {
    return catalogInventory.filter(item => {
      const itemBrand = item.name.split(" ")[0];
      const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(itemBrand);
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(item.category);
      return brandMatch && categoryMatch;
    });
  }, [selectedBrands, selectedCategories]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  // Helper to count items per filter
  const getBrandCount = (brand: string) => catalogInventory.filter(item => item.name.split(" ")[0] === brand).length;
  const getCategoryCount = (cat: string) => catalogInventory.filter(item => item.category === cat).length;

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-margin-page py-8 flex flex-col md:flex-row gap-12 lg:gap-20">
        
        {/* Left Sidebar (Filters) with Independent Scroll */}
        <aside className="w-full md:w-64 flex-shrink-0 mb-8 md:mb-0">
          <div className="sticky top-[100px] h-[calc(100vh-120px)] overflow-y-auto flex flex-col gap-8 pr-4 scrollbar-thin scrollbar-thumb-outline-variant scrollbar-track-transparent">
            
            {/* Brand Filter */}
            <div>
              <h3 className="font-headline-lg text-lg uppercase tracking-tight text-on-surface border-b-2 border-on-surface pb-2 mb-4">Brand</h3>
              <div className="flex flex-col gap-3">
                {brands.map(brand => {
                  const isChecked = selectedBrands.includes(brand);
                  return (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleBrand(brand)}>
                      {isChecked ? (
                        <div className="w-5 h-5 border-2 rounded flex items-center justify-center bg-primary-container border-primary flex-shrink-0">
                          <span className="material-symbols-outlined text-[14px] text-primary" style={{fontVariationSettings: "'FILL' 1"}}>check</span>
                        </div>
                      ) : (
                        <div className="w-5 h-5 border-2 border-outline-variant rounded flex items-center justify-center group-hover:border-primary transition-colors flex-shrink-0"></div>
                      )}
                      <span className={`font-category-label text-sm font-bold transition-colors ${isChecked ? 'text-on-surface' : 'text-on-surface-variant group-hover:text-on-surface'}`}>
                        {brand}
                      </span>
                      <span className="ml-auto text-xs text-outline font-price-chip">{getBrandCount(brand)}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="font-headline-lg text-lg uppercase tracking-tight text-on-surface border-b-2 border-on-surface pb-2 mb-4">Kategori</h3>
              <div className="flex flex-col gap-3">
                {categories.map(cat => {
                  const isChecked = selectedCategories.includes(cat);
                  return (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleCategory(cat)}>
                      {isChecked ? (
                        <div className="w-5 h-5 border-2 rounded flex items-center justify-center bg-primary-container border-primary flex-shrink-0">
                          <span className="material-symbols-outlined text-[14px] text-primary" style={{fontVariationSettings: "'FILL' 1"}}>check</span>
                        </div>
                      ) : (
                        <div className="w-5 h-5 border-2 border-outline-variant rounded flex items-center justify-center group-hover:border-primary transition-colors flex-shrink-0"></div>
                      )}
                      <span className={`font-category-label text-sm font-bold transition-colors ${isChecked ? 'text-on-surface' : 'text-on-surface-variant group-hover:text-on-surface'}`}>
                        {cat}
                      </span>
                      <span className="ml-auto text-xs text-outline font-price-chip">{getCategoryCount(cat)}</span>
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
          <div className="mb-8 pb-4 border-b-2 border-on-surface relative">
            <h1 className="font-display-xl text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
              {selectedCategories.length === 1 ? selectedCategories[0] : "ABON'S CATALOG"}
            </h1>
            <div className="absolute bottom-[-2px] left-0 w-24 h-0.5 bg-primary"></div>
          </div>

          {filteredInventory.length === 0 ? (
            <div className="text-center py-12 font-body-md text-on-surface-variant">
              Tidak ada gear yang ditemukan untuk filter ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredInventory.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          )}
          

        </section>

      </main>
    </div>
  );
}
