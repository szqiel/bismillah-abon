"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { useAdminStore } from "@/lib/adminStore";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen = true, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const orders = useAdminStore((state) => state.orders);

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const overdueCount = orders.filter((o) => o.status === "out" && new Date(o.dueAt) < new Date()).length;

  const navItems = [
    {
      label: "Dashboard",
      href: "/4dminabon",
      icon: "dashboard",
      exact: true,
    },
    {
      label: "Inventory",
      href: "/4dminabon/inventory",
      icon: "inventory_2",
    },
    {
      label: "Bundles",
      href: "/4dminabon/bundles",
      icon: "package_2",
    },
    {
      label: "Orders & Rentals",
      href: "/4dminabon/orders",
      icon: "shopping_bag",
      badge: pendingCount > 0 ? `${pendingCount}` : undefined,
      badgeColor: "bg-primary text-on-primary",
      overdueBadge: overdueCount > 0 ? `${overdueCount}` : undefined,
    },
    {
      label: "Calendar",
      href: "/4dminabon/calendar",
      icon: "calendar_month",
    },
    {
      label: "Customers",
      href: "/4dminabon/customers",
      icon: "group",
    },
    {
      label: "Reports",
      href: "/4dminabon/reports",
      icon: "analytics",
    },
  ];

  return (
    <aside
      className={`w-64 bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col h-screen fixed left-0 top-0 z-40 transition-transform duration-300 md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Brand Header */}
      <div className="p-6 border-b border-outline-variant/20 flex items-center justify-between">
        <Link href="/4dminabon" className="flex items-center gap-3">
          {siteConfig.logo ? (
            <img
              src={siteConfig.logo}
              alt={siteConfig.name}
              className="h-9 w-auto object-contain rounded-lg"
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center font-display-xl font-black text-[18px] shadow-sm">
              A
            </div>
          )}
          <div>
            <h1 className="font-display-xl font-black text-[16px] text-on-surface uppercase tracking-tight leading-none">
              {siteConfig.name}
            </h1>
            <span className="font-price-chip text-[11px] text-primary font-bold uppercase tracking-wider">
              ADMIN PANEL
            </span>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden text-on-surface-variant hover:text-on-surface p-1"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5">
        <div className="px-3 pb-2 font-category-label text-[11px] font-bold uppercase tracking-wider text-outline">
          Management
        </div>
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-category-label text-[14px] font-bold transition-all group ${
                isActive
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`material-symbols-outlined text-[22px] transition-colors ${
                    isActive
                      ? "text-on-primary"
                      : "text-outline group-hover:text-primary"
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {item.overdueBadge && (
                  <span className="bg-red-500 text-white font-price-chip text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse whitespace-nowrap flex items-center justify-center">
                    !{item.overdueBadge}
                  </span>
                )}
                {item.badge && (
                  <span
                    className={`font-price-chip text-[11px] font-black px-2 py-0.5 rounded-full whitespace-nowrap flex items-center justify-center ${
                      isActive ? "bg-on-primary text-primary" : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile & Demo Notice */}
      <div className="p-4 border-t border-outline-variant/20 bg-surface-container-low/50">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
          <div className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center font-category-label font-bold text-[13px]">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-category-label font-bold text-[13px] text-on-surface truncate">
              Demo Admin
            </div>
            <div className="font-price-chip text-[11px] text-primary truncate">
              Staff / Operator
            </div>
          </div>
          <Link
            href="/"
            title="View Customer Catalog Site"
            className="text-outline hover:text-primary transition-colors p-1"
          >
            <span className="material-symbols-outlined text-[20px]">open_in_new</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
