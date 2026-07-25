import { ProductCard } from "@/components/ui/ProductCard";
import { inventory } from "@/lib/data";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import Link from "next/link";

export default function Home() {
  const featuredGear = inventory.filter(item => item.category !== "Bundle").slice(0, 3);
  const homeBundles = inventory.filter(item => item.category === "Bundle").slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-[80px] pb-0 md:pt-[100px] flex flex-col items-center text-center px-margin-page bg-surface-container-lowest overflow-hidden">
        <ScrollReveal className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-3 mb-6">
          <h1 className="font-display-xl text-[44px] md:text-[64px] font-bold text-on-surface tracking-tighter leading-tight">
            Rental Kamera <span className="text-primary">Termurah</span>
          </h1>
          <p className="font-body-md text-[18px] md:text-[22px] text-on-surface-variant max-w-2xl font-normal">
            Everything a production needs, priced up front, ready tonight. The most comprehensive gear hub in Central Java.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-3">
            <Link className="bg-primary text-on-primary font-body-md text-[16px] px-8 py-3 rounded-full hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center font-semibold" href="/catalog">
              Lihat Katalog
            </Link>
            <Link className="bg-transparent text-primary border border-primary font-body-md text-[16px] px-8 py-3 rounded-full hover:bg-primary/5 transition-all active:scale-95 flex items-center justify-center font-semibold" href="#katalog">
              Featured Gear
            </Link>
          </div>
        </ScrollReveal>

        {/* Hero Image */}
        <ScrollReveal delay={0.15} className="relative z-10 w-full max-w-4xl mx-auto mt-auto flex justify-center">
          <img 
            className="w-full h-auto max-h-[38vh] md:max-h-[42vh] object-contain object-bottom" 
            alt="Hero Background" 
            src="https://static.bhphoto.com/images/images750x750/1605606382_1600161.jpg" 
          />
        </ScrollReveal>
      </section>

      {/* Featured Gear Section */}
      <section className="py-section-mobile md:py-section-desktop bg-surface-container-lowest px-margin-page border-t border-primary/20" id="katalog">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="flex justify-between items-end mb-12 border-b border-primary pb-4">
            <h2 className="font-display-xl text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">Featured Gear</h2>
            <Link className="font-category-label text-[16px] text-primary hover:underline flex items-center gap-1" href="/catalog">
              View All <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </Link>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {featuredGear.map((item, idx) => (
              <ScrollReveal key={item.id} delay={idx * 0.1}>
                <ProductCard item={item} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bundling Packages */}
      <section className="py-section-mobile md:py-section-desktop bg-surface-bright px-margin-page text-on-surface border-t border-primary/20">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-primary pb-4 gap-4">
            <div>
              <h2 className="font-display-xl text-headline-lg-mobile md:text-headline-lg uppercase font-black tracking-tighter">Bundling Packages</h2>
              <p className="font-body-md text-on-surface-variant mt-2">Pre-configured kits for typical shoot scenarios. Save up to 20%.</p>
            </div>
            <Link className="font-category-label text-[16px] text-primary hover:underline flex items-center gap-1" href="/bundles">
              View All <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </Link>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {homeBundles.map((bundle, idx) => (
              <ScrollReveal key={bundle.id} delay={idx * 0.1}>
                <ProductCard item={bundle} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Cinematic Trust Band */}
      <section className="relative py-section-mobile md:py-[120px] bg-surface-container-lowest overflow-hidden border-t border-outline-variant">
        <div className="absolute inset-0 flex gap-4 opacity-30 grayscale saturate-0 pointer-events-none w-[200%] md:w-full animate-[pan_60s_linear_infinite]">
          <img className="h-full w-1/3 object-cover" alt="BTS 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtXolmqzIdse4sPo7QgHJszCCFSAMXDntD8tU55kDYhbIQYw6J6St-xOf7T1w15RnR8bO3zyb53c67m7dKMREPCDSTfwvES3OZKrSOtQ7iXpKcSW79Q7kw8IuhHWierfGHUYCVI5tbhZKaLCAukBlb1HrhmncNxJFQZ2RRdgYmXOKj8fsWm1JhuW39xIk1nzfVPxbAO5S1xoqJzeoSH_YWsp_8uTzppsni8kBwI1Cyt2iGVyU0K9bZ" />
          <img className="h-full w-1/3 object-cover" alt="BTS 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlIEjcD72Kuj59tJ1IWd3DXstmLNnxYVoYzjG22eIUFsseHJ5QYQINnODCt8SC1w6DOfQ_udux3XGLQGOZjdVXQeZXkqc3uJhwza-C8WIpuRcvO8_99L4ydG44jLdKNuO8feINdVeC_0Lf7CSbz1gEt7ssGthlmIBPzgNUZ-_hPAKr8LPmFklDSmUHn16cDQHncAHqjSGnsSvyCtY8q_DXrGdHBplvO_GxHtnZSWrcbRZ0EUrOtZ_M" />
          <img className="h-full w-1/3 object-cover" alt="BTS 3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGXMkC2A5ImUdDzWZ3f3gRinHCKbgIzqRFBQUNjZ_48Rsf3isCxU8AoGmGCek5hZdY8e0EldcLLgAmnCc8KtP_ORVVPW0Jr98_EppXjjNIZN_KBSIdNO1zdzNE7sC1S7rGDyKo-bJFEBR9XoEvINssd4AlqP_FSf5TTKfmpDIhwlXCH753DZP3E8EjiczD_78SyUO5Xr4xjpvaWEqhGTbLcDMd4hxKQUjbcE18wMzDlN3c8wEEXtI0" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/80 to-transparent"></div>
        <ScrollReveal className="relative z-10 max-w-4xl mx-auto text-center px-margin-page flex flex-col items-center">
          <span className="material-symbols-outlined text-[48px] text-primary mb-6">movie</span>
          <h2 className="font-display-xl text-headline-lg-mobile md:text-[64px] uppercase font-black text-on-surface leading-none mb-6">
            Trusted by Semarang&apos;s<br/>Top Creators
          </h2>
          <p className="font-body-md text-[18px] text-on-surface-variant max-w-2xl mx-auto mb-10">
            Dari project mahasiswa hingga commercial shoot skala nasional. Kami memastikan alat yang Anda sewa dalam kondisi prima, terkalibrasi, dan siap tempur.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex flex-col items-center p-4 bg-surface-container/50 backdrop-blur border border-outline-variant rounded-lg w-32">
              <span className="font-display-xl text-[36px] font-black text-on-surface">500+</span>
              <span className="font-category-label text-[12px] text-on-surface-variant uppercase">Projects</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-surface-container/50 backdrop-blur border border-outline-variant rounded-lg w-32">
              <span className="font-display-xl text-[36px] font-black text-on-surface">99%</span>
              <span className="font-category-label text-[12px] text-on-surface-variant uppercase">Uptime Gear</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-surface-container/50 backdrop-blur border border-outline-variant rounded-lg w-32">
              <span className="font-display-xl text-[36px] font-black text-on-surface">24/7</span>
              <span className="font-category-label text-[12px] text-on-surface-variant uppercase">Support</span>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
