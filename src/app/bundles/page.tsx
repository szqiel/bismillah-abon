"use client";

import { useMemo } from "react";
import { inventory } from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function BundlesPage() {
  // Pre-filter inventory for bundles only
  const bundlesInventory = useMemo(
    () => inventory.filter((item) => item.category === "Bundle"),
    []
  );

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-margin-page py-8 flex flex-col gap-8">
        {/* Product Grid Section */}
        <section className="w-full">
          <ScrollReveal className="mb-8 pb-4 border-b-2 border-on-surface relative">
            <h1 className="font-display-xl text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
              SPECIAL BUNDLES
            </h1>
            <div className="absolute bottom-[-2px] left-0 w-24 h-0.5 bg-primary"></div>
          </ScrollReveal>

          {bundlesInventory.length === 0 ? (
            <div className="text-center py-12 font-body-md text-on-surface-variant">
              Tidak ada paket yang ditemukan.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {bundlesInventory.map((item, idx) => (
                <ScrollReveal key={item.id} delay={idx * 0.08}>
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
