"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useState } from "react";
import { useBookingStore } from "@/lib/store";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function TopNavBar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const cartItems = useBookingStore((state) => state.items);
  const pathname = usePathname();

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-surface-container-lowest sticky top-0 z-50 border-b border-outline-variant hidden md:flex w-full transition-transform">
        <div className="flex justify-between items-center w-full px-margin-page py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {siteConfig.logo ? (
              <img
                src={siteConfig.logo}
                alt={siteConfig.name}
                className="h-10 w-auto object-contain"
              />
            ) : (
              <span className="font-display-xl text-[24px] font-black text-on-surface uppercase tracking-tighter">
                {siteConfig.name}
              </span>
            )}
          </Link>

          {/* Nav Links */}
          <ul className="flex items-center gap-8">
            <li>
              <Link
                className={`font-category-label text-[15px] font-bold hover:text-primary transition-colors pb-1 relative ${
                  pathname === "/"
                    ? "text-primary border-b-2 border-primary"
                    : "text-on-surface-variant"
                }`}
                href="/"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                className={`font-category-label text-[15px] font-bold hover:text-primary transition-colors pb-1 relative ${
                  pathname === "/catalog" || pathname.startsWith("/product")
                    ? "text-primary border-b-2 border-primary"
                    : "text-on-surface-variant"
                }`}
                href="/catalog"
              >
                Catalog
              </Link>
            </li>
            <li>
              <Link
                className={`font-category-label text-[15px] font-bold hover:text-primary transition-colors pb-1 relative ${
                  pathname === "/bundles"
                    ? "text-primary border-b-2 border-primary"
                    : "text-on-surface-variant"
                }`}
                href="/bundles"
              >
                Bundles
              </Link>
            </li>
            <li>
              <Link
                className={`font-category-label text-[15px] font-bold hover:text-primary transition-colors pb-1 relative ${
                  pathname === "/about"
                    ? "text-primary border-b-2 border-primary"
                    : "text-on-surface-variant"
                }`}
                href="/about"
              >
                About Us
              </Link>
            </li>
          </ul>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <Link
              href="/cart"
              className="relative p-2 text-on-surface hover:text-primary transition-colors flex items-center justify-center"
            >
              <span
                className="material-symbols-outlined text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                shopping_cart
              </span>
              <AnimatePresence>
                {cartItems.length > 0 && (
                  <motion.span
                    key={cartItems.length}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute top-0 right-0 bg-primary text-on-primary font-category-label font-bold text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-sm"
                  >
                    {cartItems.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <a
              href={siteConfig.links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-on-primary font-category-label text-[14px] font-bold uppercase px-6 py-2.5 rounded-full hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              WhatsApp 24H
            </a>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="md:hidden flex justify-between items-center px-margin-page py-4 bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-40">
        <Link href="/" className="flex items-center">
          {siteConfig.logo ? (
            <img
              src={siteConfig.logo}
              alt={siteConfig.name}
              className="h-8 w-auto object-contain"
            />
          ) : (
            <span className="font-display-xl text-[20px] font-black text-on-surface uppercase tracking-tighter">
              {siteConfig.name}
            </span>
          )}
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="relative p-2 text-on-surface hover:text-primary transition-colors"
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              shopping_cart
            </span>
            <AnimatePresence>
              {cartItems.length > 0 && (
                <motion.span
                  key={cartItems.length}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="absolute top-0 right-0 bg-primary text-on-primary font-category-label font-bold text-[10px] w-4 h-4 flex items-center justify-center rounded-full shadow-sm"
                >
                  {cartItems.length}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <button className="p-2 text-on-surface" onClick={toggleDrawer}>
            <span className="material-symbols-outlined text-[28px]">menu</span>
          </button>
        </div>
      </header>

      {/* NavigationDrawer (Mobile) */}
      <aside
        className={`bg-surface-container-low h-full w-80 fixed left-0 top-0 z-[60] border-r border-outline-variant/30 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col p-6 md:hidden ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-outline-variant/30">
          <div>
            {siteConfig.logo ? (
              <img
                src={siteConfig.logo}
                alt={siteConfig.name}
                className="h-8 w-auto object-contain"
              />
            ) : (
              <h2 className="font-display-xl text-[20px] font-black text-on-surface uppercase">
                {siteConfig.name}
              </h2>
            )}
          </div>
          <button
            className="p-2 text-on-surface hover:text-error transition-colors"
            onClick={closeDrawer}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-4">
            <li>
              <Link
                onClick={closeDrawer}
                className={`flex items-center gap-4 hover:text-primary font-category-label text-[18px] font-bold uppercase tracking-wider transition-colors ${
                  pathname === "/" ? "text-primary" : "text-on-surface"
                }`}
                href="/"
              >
                <span className="material-symbols-outlined">home</span>Home
              </Link>
            </li>
            <li>
              <Link
                onClick={closeDrawer}
                className={`flex items-center gap-4 hover:text-primary font-category-label text-[18px] font-bold uppercase tracking-wider transition-colors ${
                  pathname === "/catalog" || pathname.startsWith("/product")
                    ? "text-primary"
                    : "text-on-surface"
                }`}
                href="/catalog"
              >
                <span className="material-symbols-outlined">grid_view</span>Catalog
              </Link>
            </li>
            <li>
              <Link
                onClick={closeDrawer}
                className={`flex items-center gap-4 hover:text-primary font-category-label text-[18px] font-bold uppercase tracking-wider transition-colors ${
                  pathname === "/bundles" ? "text-primary" : "text-on-surface"
                }`}
                href="/bundles"
              >
                <span className="material-symbols-outlined">inventory_2</span>
                Bundles
              </Link>
            </li>
            <li>
              <Link
                onClick={closeDrawer}
                className={`flex items-center gap-4 hover:text-primary font-category-label text-[18px] font-bold uppercase tracking-wider transition-colors ${
                  pathname === "/about" ? "text-primary" : "text-on-surface"
                }`}
                href="/about"
              >
                <span className="material-symbols-outlined">info</span>About Us
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mt-auto pt-6 border-t border-outline-variant/30">
          <a
            href={siteConfig.links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeDrawer}
            className="bg-primary text-on-primary font-category-label text-[16px] font-bold uppercase px-6 py-4 rounded-full flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-95 w-full"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            WhatsApp 24H
          </a>
        </div>
      </aside>

      {/* Overlay for mobile drawer */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={closeDrawer}
        />
      )}
    </>
  );
}
