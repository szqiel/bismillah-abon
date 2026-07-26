"use client";

import { useState, useRef, useEffect } from "react";
import { GearItem } from "@/lib/data";
import Link from "next/link";

export function ProductCard({ item }: { item: GearItem }) {
  const isAvailable = item.available;
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setImageLoaded(true);
    }
  }, []);

  return (
    <Link href={`/product/${item.id}`} className="block h-full">
      <div
        className={`bg-surface-container-low rounded-xl p-6 border-2 border-on-surface flex flex-col gap-6 relative overflow-hidden group transition-all h-full ${
          isAvailable
            ? "hover:shadow-[8px_8px_0px_var(--on-surface)] hover:-translate-y-1 hover:-translate-x-1"
            : "opacity-70 grayscale"
        }`}
      >
        {/* Bundle Tag Badge */}
        {item.category === "Bundle" && (
          <div className="absolute top-3 right-3 bg-primary text-on-primary font-category-label font-bold text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm z-10 border border-on-surface">
            Bundle
          </div>
        )}

        {/* Image Container */}
        <div className="w-full h-48 flex items-center justify-center bg-surface-container-lowest p-4 rounded-lg border-2 border-on-surface/10 mt-6 group-hover:border-primary/30 transition-colors relative overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton-shimmer" />
          )}
          <img
            ref={imgRef}
            src={item.image}
            alt={item.name}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
            className={`w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-all duration-500 ${
              imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          <h3 className="font-display-xl text-[24px] uppercase font-black leading-tight mb-2 text-on-surface line-clamp-2">
            {item.name}
          </h3>

          <ul className="font-body-md text-[14px] text-on-surface-variant space-y-1 mb-6 list-disc list-inside">
            {item.specs.map((spec, i) => (
              <li key={i}>{spec}</li>
            ))}
          </ul>

          <div className="flex items-center justify-between mt-auto gap-2">
            {/* Price Pill */}
            <div className="bg-surface-container text-on-surface rounded-full px-3 py-2 flex flex-wrap items-center gap-2 border border-outline-variant/50 flex-1">
              <span className="font-price-chip text-[16px] text-primary font-bold flex items-baseline gap-1">
                {(item.price12h / 1000).toLocaleString("id-ID")}k
                <span className="text-[11px] text-on-surface-variant font-normal uppercase">
                  /12H
                </span>
              </span>
              <div className="w-1 h-1 rounded-full bg-outline-variant hidden sm:block"></div>
              <span className="font-price-chip text-[14px] text-on-surface font-bold flex items-baseline gap-1">
                {(item.price24h / 1000).toLocaleString("id-ID")}k
                <span className="text-[10px] text-on-surface-variant font-normal uppercase">
                  /24H
                </span>
              </span>
            </div>

            {/* Action Button */}
            <div
              className={`rounded-full p-3 flex-shrink-0 flex items-center justify-center transition-colors border-2 border-transparent ${
                isAvailable
                  ? "bg-on-surface text-background group-hover:bg-primary group-hover:text-on-primary group-hover:border-on-surface"
                  : "bg-surface-container-highest text-on-surface-variant cursor-not-allowed"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isAvailable ? "arrow_forward" : "block"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
