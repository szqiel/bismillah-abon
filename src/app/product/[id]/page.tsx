import { inventory } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import BookingForm from "./BookingForm";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = inventory.find((g) => g.id === id);

  if (!item) {
    notFound();
  }

  return (
    <div className="px-margin-desktop py-xl bg-surface min-h-screen">
      <Link href="/catalog" className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors flex items-center gap-xs mb-lg uppercase">
        <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to Catalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-xl">
        <div className="md:col-span-7 h-[400px] md:h-[600px] hard-border bg-surface-bright p-xl flex items-center justify-center relative">
           <img 
              src={item.image} 
              alt={item.name} 
              className="w-full h-full object-contain mix-blend-multiply" 
            />
            <div className="absolute top-0 right-0 spec-tag-bg px-sm py-xs border-b-2 border-l-2 border-on-tertiary-fixed">
              <span className="font-price-tag text-[16px] tracking-wider">AVAILABLE</span>
            </div>
        </div>

        <div className="md:col-span-5 flex flex-col">
          <div className="inline-flex items-center gap-2 bg-on-tertiary-fixed text-surface-bright px-sm py-xs w-fit mb-sm">
            <span className="font-label-caps text-[10px] tracking-widest uppercase">{item.category}</span>
          </div>
          <h1 className="font-display-xl text-[48px] md:text-display-lg uppercase leading-none text-on-surface mb-md">
            {item.name}
          </h1>
          
          <div className="flex gap-lg border-b-2 border-on-tertiary-fixed pb-md mb-md">
            <div className="flex flex-col">
              <span className="font-label-caps text-[10px] text-on-surface-variant uppercase mb-xs">12-Hour Rate</span>
              <span className="font-price-tag text-[24px]">Rp {(item.price12h / 1000).toLocaleString('id-ID')}K</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-caps text-[10px] text-on-surface-variant uppercase mb-xs">24-Hour Rate</span>
              <span className="font-price-tag text-[24px] text-primary">Rp {(item.price24h / 1000).toLocaleString('id-ID')}K</span>
            </div>
          </div>

          <p className="font-body-lg text-body-lg text-on-surface-variant mb-md">
            {item.description}
          </p>

          <div className="flex flex-wrap gap-xs mb-xl">
            {item.specs.map((spec, i) => (
              <span key={i} className="px-3 py-2 hard-border font-label-caps text-[12px] uppercase bg-surface-container">
                {spec}
              </span>
            ))}
          </div>

          <BookingForm item={item} />
        </div>
      </div>
    </div>
  );
}
