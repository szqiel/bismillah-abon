import Link from "next/link";
import { GearItem } from "@/lib/data";

export function ProductCard({ item }: { item: GearItem }) {
  return (
    <Link href={`/product/${item.id}`} className="col-span-2 md:col-span-4 flex flex-col hard-border bg-surface-container-low group relative hover:bg-surface transition-colors">
      <div className="absolute top-0 left-0 w-full flex justify-between items-start z-10 p-0">
        <div className="spec-tag-bg px-sm py-sm border-r-2 border-b-2 border-on-tertiary-fixed flex flex-col">
          <span className="font-label-caps text-[10px] text-surface-container opacity-80 uppercase leading-none">Per Day</span>
          <span className="font-price-tag text-price-tag tracking-widest mt-1">
            Rp {(item.price24h / 1000).toFixed(0)}K
          </span>
        </div>
      </div>
      <div className="h-[250px] border-b-2 border-on-tertiary-fixed relative overflow-hidden bg-surface-bright p-xl flex items-center justify-center">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500 scale-95 group-hover:scale-100" 
        />
      </div>
      <div className="p-md flex flex-col flex-grow">
        <h3 className="font-headline-lg text-[24px] uppercase leading-tight mb-sm">{item.name}</h3>
        <div className="flex flex-wrap gap-xs mt-auto">
          {item.specs.map((spec, i) => (
            <span key={i} className="px-2 py-1 border border-on-tertiary-fixed font-label-caps text-[10px] uppercase bg-surface-bright">
              {spec}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
