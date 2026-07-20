import { inventory } from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";
import Link from "next/link";

export default function Home() {
  const topTier = inventory.slice(0, 3);

  return (
    <>
      <section className="px-margin-desktop py-xl md:py-[120px] relative border-b-2 border-on-tertiary-fixed bg-surface-container-low overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#171d16 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="grid-technical relative z-10 items-center">
          <div className="col-span-2 md:col-span-8 flex flex-col gap-md">
            <div className="inline-flex items-center gap-2 spec-tag-bg px-sm py-xs w-fit">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>videocam</span>
              <span className="font-label-caps text-label-caps tracking-widest uppercase">Premium Cinema Line</span>
            </div>
            <h1 className="font-display-xl text-display-xl uppercase leading-none md:pr-xl text-on-surface">
              Professional Gear.<br/>Zero Compromise.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-sm">
              High-end technical gear rental for professional cinematographers and photographers. Strict maintenance, reliable service, and industry-standard equipment ready for your next production.
            </p>
            <div className="flex gap-sm mt-md">
              <Link href="/catalog" className="bg-on-tertiary-fixed text-surface-bright px-lg py-sm font-label-caps text-label-caps uppercase hover:bg-primary-container transition-colors duration-200">
                Explore Catalog
              </Link>
            </div>
          </div>
          <div className="col-span-2 md:col-span-4 mt-lg md:mt-0 relative h-[400px] md:h-[600px] hard-border bg-surface-bright">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdw00jrv_umvTMRAmUBqns60DcUykogDCyOrg91z5D6f7ziVkupT3OIt1upLGVFW6NpCH43dhLj2dbkYZAmQblIwz1Kg5zrKWVa9oUwLa67aU2ZTQC0PXOYcDoxHlSJ43PTbpNYqZKSD5eQUO6hwdnS76-ogqcTEYIQmh0rkybR4Xu1K5r4fswUKY8uEvKfQEoFyjB8ojv8LsepN4dTbDKww_iFCh9Q8HAGS1iB9-dMhm-chExlK2F" 
              alt="Red Komodo Hero" 
              className="w-full h-full object-cover p-sm grayscale contrast-125 mix-blend-multiply" 
            />
            <div className="absolute top-0 right-0 spec-tag-bg px-sm py-xs border-b-2 border-l-2 border-on-tertiary-fixed">
              <span className="font-price-tag text-price-tag tracking-wider">AVAILABLE</span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-margin-desktop py-xl bg-surface">
        <div className="flex justify-between items-end mb-lg border-b-2 border-on-tertiary-fixed pb-sm">
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase">Top Tier Equipment</h2>
          <Link href="/catalog" className="font-label-caps text-label-caps text-primary hover:text-on-tertiary-fixed transition-colors flex items-center gap-xs">
            View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
        <div className="grid-technical">
          {topTier.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </>
  );
}
