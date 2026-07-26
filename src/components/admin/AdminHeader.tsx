"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
  onOpenNewOrderModal?: () => void;
}

export function AdminHeader({ onToggleSidebar, onOpenNewOrderModal }: AdminHeaderProps) {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === "/4dminabon") return "Dashboard Overview";
    if (pathname.startsWith("/4dminabon/inventory")) return "Inventory Management";
    if (pathname.startsWith("/4dminabon/bundles")) return "Bundle Management";
    if (pathname.startsWith("/4dminabon/orders")) return "Orders & Rental Tracking";
    if (pathname.startsWith("/4dminabon/calendar")) return "Calendar & Availability";
    if (pathname.startsWith("/4dminabon/customers")) return "Customer Records (CRM)";
    if (pathname.startsWith("/4dminabon/reports")) return "Financial & Reports";
    return "Admin Panel";
  };

  return (
    <header className="sticky top-0 z-30 bg-surface-container-lowest border-b border-outline-variant/30 px-6 py-4 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-4">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-on-surface hover:bg-surface-container-low"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
        )}
        <div>
          <h2 className="font-display-xl text-[20px] font-black text-on-surface uppercase tracking-tight">
            {getPageTitle()}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {onOpenNewOrderModal && (
          <button
            onClick={onOpenNewOrderModal}
            className="bg-primary text-on-primary font-category-label text-[13px] font-bold uppercase px-4 py-2.5 rounded-full hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>New Order</span>
          </button>
        )}

        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex bg-surface-container text-on-surface font-category-label text-[13px] font-bold uppercase px-4 py-2.5 rounded-full hover:bg-surface-container-high transition-all items-center gap-1.5 border border-outline-variant/40"
        >
          <span>Storefront</span>
          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
        </Link>
      </div>
    </header>
  );
}
