import Link from "next/link";
import { siteConfig } from "@/config/site";

export function TopNavBar() {
  return (
    <nav className="w-full sticky top-0 z-50 flex justify-between items-center px-margin-desktop py-base bg-surface border-b-2 border-on-tertiary-fixed transition-all duration-300">
      <Link href="/" className="flex items-center">
        {/* Replacing text title with Logo as requested */}
        <div className="relative h-12 w-32 md:h-16 md:w-48">
           <img 
             src={siteConfig.logo} 
             alt={`${siteConfig.name} Logo`} 
             className="object-contain w-full h-full"
           />
        </div>
      </Link>
      
      <div className="hidden md:flex gap-md items-center">
        <Link href="/catalog" className="text-on-surface-variant font-medium hover:text-primary font-label-caps text-label-caps uppercase cursor-pointer active:opacity-80 transition-colors duration-200">
          Catalog
        </Link>
        <Link href="/catalog?category=Camera" className="text-on-surface-variant font-medium hover:text-primary font-label-caps text-label-caps uppercase cursor-pointer active:opacity-80 transition-colors duration-200">
          Kamera
        </Link>
        <Link href="/catalog?category=Lens" className="text-on-surface-variant font-medium hover:text-primary font-label-caps text-label-caps uppercase cursor-pointer active:opacity-80 transition-colors duration-200">
          Lensa
        </Link>
      </div>

      <div className="flex items-center gap-sm">
        <Link href="/cart" className="bg-on-tertiary-fixed text-surface-bright px-md py-sm font-label-caps text-label-caps uppercase hover:bg-primary-container transition-colors duration-200 flex items-center gap-xs">
          <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
          <span className="hidden md:inline">Booking</span>
        </Link>
      </div>
    </nav>
  );
}
