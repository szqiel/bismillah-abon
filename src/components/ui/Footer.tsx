import { siteConfig } from "@/config/site";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full mt-xl grid grid-cols-1 gap-gutter px-margin-desktop py-xl bg-on-tertiary-fixed text-surface-bright border-t-2 border-on-tertiary-fixed-variant md:grid-cols-12">
      <div className="md:col-span-6 flex flex-col justify-between h-full">
        <div className="font-display-xl text-[48px] md:text-display-lg text-surface-bright uppercase leading-none mb-lg md:mb-0">
          {siteConfig.name}
        </div>
        <div className="font-label-caps text-label-caps text-surface-variant uppercase mt-auto">
          © {new Date().getFullYear()} {siteConfig.name}. TECHNICAL GEAR RENTAL.
        </div>
      </div>
      
      <div className="md:col-span-6 flex flex-col md:items-end justify-between">
        <div className="flex flex-col gap-sm md:text-right">
          <a href={siteConfig.links.instagram} target="_blank" rel="noreferrer" className="font-label-caps text-label-caps text-surface-variant hover:text-primary-fixed transition-colors uppercase">
            Instagram
          </a>
          <a href={siteConfig.links.whatsapp} target="_blank" rel="noreferrer" className="font-label-caps text-label-caps text-surface-variant hover:text-primary-fixed transition-colors uppercase">
            WhatsApp
          </a>
          <div className="font-label-caps text-label-caps text-surface-variant uppercase">
            {siteConfig.location}
          </div>
          <Link href="/admin" className="font-label-caps text-label-caps text-surface-variant hover:text-primary-fixed transition-colors uppercase">
            Admin Preview
          </Link>
        </div>
      </div>
    </footer>
  );
}
