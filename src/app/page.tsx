import { ProductCard } from "@/components/ui/ProductCard";
import { inventory } from "@/lib/data";
import Link from "next/link";

export default function Home() {
  const featuredGear = inventory.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-[120px] pb-0 md:pt-[160px] flex flex-col items-center text-center px-margin-page bg-surface-container-lowest overflow-hidden">
        {/* Text Content */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-4 mb-12">
          <h1 className="font-display-xl text-[48px] md:text-[72px] font-bold text-on-surface tracking-tighter leading-tight">
            Rental Kamera <span className="text-primary">Termurah</span>
          </h1>
          <p className="font-body-md text-[20px] md:text-[24px] text-on-surface-variant max-w-2xl font-normal">
            Everything a production needs, priced up front, ready tonight. The most comprehensive gear hub in Central Java.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link className="bg-primary text-on-primary font-body-md text-[16px] px-8 py-3 rounded-full hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center font-semibold" href="/catalog">
              Lihat Katalog
            </Link>
            <Link className="bg-transparent text-primary border border-primary font-body-md text-[16px] px-8 py-3 rounded-full hover:bg-primary/5 transition-all active:scale-95 flex items-center justify-center font-semibold" href="#katalog">
              Featured Gear
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative z-10 w-full max-w-4xl mx-auto mt-auto flex justify-center">
          <img 
            className="w-full h-auto max-h-[50vh] object-contain object-bottom" 
            alt="Rental Kamera Hero" 
            src="https://static.bhphoto.com/images/images750x750/1605606382_1600161.jpg" 
          />
        </div>
      </section>

      {/* Featured Gear Section */}
      <section className="py-section-mobile md:py-section-desktop bg-surface-container-lowest px-margin-page border-t border-primary/20" id="katalog">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12 border-b border-primary pb-4">
            <h2 className="font-display-xl text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">Featured Gear</h2>
            <Link className="font-category-label text-[16px] text-primary hover:underline flex items-center gap-1" href="/catalog">View All <span className="material-symbols-outlined text-[20px]">arrow_forward</span></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {featuredGear.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Bundling Packages */}
      <section className="py-section-mobile md:py-section-desktop bg-surface-bright px-margin-page text-on-surface border-t-4 border-on-surface">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b-2 border-on-surface pb-4 gap-4">
            <div>
              <h2 className="font-display-xl text-headline-lg-mobile md:text-headline-lg uppercase font-black tracking-tighter">Bundling Packages</h2>
              <p className="font-body-md text-on-surface-variant mt-2">Pre-configured kits for typical shoot scenarios. Save up to 20%.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
            {/* Bundle Card 1 */}
            <div className="bg-surface-container-low rounded-xl p-6 border-2 border-on-surface flex flex-col md:flex-row gap-6 relative overflow-hidden group hover:shadow-[8px_8px_0px_var(--on-surface)] transition-all">
              <div className="absolute -right-6 -top-6 bg-primary text-on-primary font-category-label font-black w-32 h-32 rounded-full transform rotate-12 border-4 border-on-surface group-hover:rotate-[24deg] transition-transform flex flex-col items-center justify-center shadow-lg">
                  <span className="text-[12px] leading-none opacity-90">HEMAT</span>
                  <span className="text-[20px] leading-none mt-1">15%</span>
              </div>
              <div className="w-full md:w-2/5 flex flex-col gap-4 bg-surface p-4 rounded-lg border border-outline-variant/30">
                <img 
                  className="w-full h-32 object-contain mix-blend-multiply" 
                  alt="Bundle 1" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAL6GsJ4OJLkuBpZ0z9e_Q_Ukm0qcMKMK21irkAKScXFTxvBmwx6SOIoWzOhAYLl5P5MdnD3OtVExlz3WUiF_teI5-rUFyle8HyW5WxfgXs2SNdpnIoC0rY-IgbkfC3BR-MzHX5H-j9YDcl_ybbUDqNX-fkhn1Vtt5GWYSwbmi6WkWm1IrHXBZKJ4G_V-Y5NHPv2wd5KxvZJX0bT33Z1-gYIGGjVNhkJW8i6uchI-f7dqhnus-eZVpp" 
                />
                <div className="flex items-center justify-center gap-2 font-display-xl text-[20px] font-bold text-on-surface">
                  A7 III <span className="text-primary">+</span> 28-75mm
                </div>
              </div>
              <div className="w-full md:w-3/5 flex flex-col justify-center">
                <h3 className="font-display-xl text-[28px] uppercase font-black leading-tight mb-2 text-on-surface">The Essential<br/>Wedding Kit</h3>
                <ul className="font-body-md text-[14px] text-on-surface-variant space-y-1 mb-6 list-disc list-inside">
                  <li>Sony A7 III Body</li>
                  <li>Tamron 28-75mm f/2.8</li>
                  <li>2x NP-FZ100 Batteries</li>
                  <li>SanDisk 64GB Extreme Pro</li>
                </ul>
                <div className="flex items-center justify-between mt-auto">
                  <div className="bg-surface-container text-on-surface rounded-full px-4 py-2 flex items-center gap-3">
                    <span className="font-price-chip text-[18px] font-bold line-through text-outline">450k</span>
                    <span className="font-price-chip text-[20px] text-primary font-bold">380k<span className="text-[12px] text-on-surface-variant font-normal">/12H</span></span>
                  </div>
                  <Link href="/catalog" className="bg-on-surface text-background rounded-full p-3 hover:bg-primary hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Bundle Card 2 */}
            <div className="bg-surface-container-low rounded-xl p-6 border-2 border-on-surface flex flex-col md:flex-row gap-6 relative overflow-hidden group hover:shadow-[8px_8px_0px_var(--on-surface)] transition-all">
              <div className="absolute -right-6 -top-6 bg-primary text-on-primary font-category-label font-black w-32 h-32 rounded-full transform rotate-12 border-4 border-on-surface group-hover:rotate-[24deg] transition-transform flex flex-col items-center justify-center shadow-lg">
                  <span className="text-[12px] leading-none opacity-90">HEMAT</span>
                  <span className="text-[20px] leading-none mt-1">20%</span>
              </div>
              <div className="w-full md:w-2/5 flex flex-col gap-4 bg-surface p-4 rounded-lg border border-outline-variant/30">
                <img 
                  className="w-full h-32 object-contain mix-blend-multiply" 
                  alt="Bundle 2" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNLooZazDlroYQR3pJhLx2nPA_R5PoYWIvPJpB9_7RJg62FxtZHQSg-rbivBB7pSdwc9FqAE27Xg_CruHfEiryPKMu4860B9i5AfFxb51dUk-xqRB9ySzgTVIT8Ty3BEXJFJMx2cxpx_6qGw0v9DyiU04NRfBT_rTD51bZ6ZNHK5C7TRnovP28oDcTxRmMJpGappGInTUx45Q2Vt2XJfcStfA2Sw5UrjeUWzkkD8JJ5C1CWuoukP7W" 
                />
                <div className="flex items-center justify-center gap-2 font-display-xl text-[20px] font-bold text-on-surface">
                  2x SL60W <span className="text-primary">+</span> Softbox
                </div>
              </div>
              <div className="w-full md:w-3/5 flex flex-col justify-center">
                <h3 className="font-display-xl text-[28px] uppercase font-black leading-tight mb-2 text-on-surface">Basic Studio<br/>Lighting</h3>
                <ul className="font-body-md text-[14px] text-on-surface-variant space-y-1 mb-6 list-disc list-inside">
                  <li>2x Godox SL60W Video Light</li>
                  <li>2x Rectangular Softbox 60x90</li>
                  <li>2x Light Stand Takara</li>
                  <li>Kabel Roll 10m</li>
                </ul>
                <div className="flex items-center justify-between mt-auto">
                  <div className="bg-surface-container text-on-surface rounded-full px-4 py-2 flex items-center gap-3">
                    <span className="font-price-chip text-[18px] font-bold line-through text-outline">200k</span>
                    <span className="font-price-chip text-[20px] text-primary font-bold">160k<span className="text-[12px] text-on-surface-variant font-normal">/12H</span></span>
                  </div>
                  <Link href="/catalog" className="bg-on-surface text-background rounded-full p-3 hover:bg-primary hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
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
        <div className="relative z-10 max-w-4xl mx-auto text-center px-margin-page flex flex-col items-center">
          <span className="material-symbols-outlined text-[48px] text-primary mb-6">movie</span>
          <h2 className="font-display-xl text-headline-lg-mobile md:text-[64px] uppercase font-black text-on-surface leading-none mb-6">Trusted by Semarang's<br/>Top Creators</h2>
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
        </div>
      </section>
    </div>
  );
}
