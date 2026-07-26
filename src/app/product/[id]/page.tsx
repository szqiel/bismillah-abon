import { inventory } from "@/lib/data";
import { formatCurrency } from "@/lib/formatters";
import { notFound } from "next/navigation";
import Link from "next/link";
import BookingForm from "./BookingForm";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = inventory.find((g) => g.id === id);

  if (!item) {
    notFound();
  }
  
  const isAvailable = item.available;


  return (
    <div className="bg-surface-container-lowest min-h-screen text-on-surface flex flex-col">
      <div className="max-w-7xl mx-auto px-margin-page py-8 flex-grow w-full">
        
        {/* Back Navigation */}
        <Link href="/catalog" className="font-category-label text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-2 mb-8 uppercase w-fit">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Main Big Image */}
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-8 relative flex items-center justify-center aspect-[4/3] md:aspect-[16/10] overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-contain drop-shadow-2xl" 
              />
              

            </div>

            {/* Thumbnails Row */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-surface-container border border-primary rounded-lg aspect-[4/3] flex items-center justify-center p-2 overflow-hidden cursor-pointer opacity-100">
                <img src={item.image} className="w-full h-full object-contain" alt="Thumb 1"/>
              </div>
              <div className="bg-surface-container-low border border-outline-variant/30 rounded-lg aspect-[4/3] flex items-center justify-center p-2 overflow-hidden cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
                <img src={item.image} className="w-full h-full object-contain" alt="Thumb 2"/>
              </div>
              <div className="bg-surface-container-low border border-outline-variant/30 rounded-lg aspect-[4/3] flex items-center justify-center p-2 overflow-hidden cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
                <img src={item.image} className="w-full h-full object-contain" alt="Thumb 3"/>
              </div>
              <div className="bg-surface-container-low border border-outline-variant/30 rounded-lg aspect-[4/3] flex items-center justify-center p-2 overflow-hidden cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
                <img src={item.image} className="w-full h-full object-contain" alt="Thumb 4"/>
              </div>
            </div>

          </div>

          {/* Right: Info & Booking */}
          <div className="lg:col-span-5 flex flex-col">
            
            <h1 className="font-display-xl text-[40px] md:text-[48px] uppercase font-bold text-on-surface leading-none tracking-tight">
              {item.name}
            </h1>
            <p className="font-body-md text-[14px] text-on-surface-variant mt-2">
              {item.category === "Camera" ? "Full-Frame Mirrorless Hybrid Camera" : `${item.category} Professional Equipment`}
            </p>
            
            {/* Price Box */}
            <div className="mt-6 border border-primary/40 bg-primary/10 rounded-xl p-4 flex items-center justify-center gap-6">
              <div className="flex items-baseline gap-1">
                <span className="font-price-chip text-[28px] font-bold text-primary">{formatCurrency(item.price12h)}</span>
                <span className="font-category-label text-[12px] text-primary/80 ml-1">/ 12H</span>
              </div>
              <div className="w-[1px] h-8 bg-primary/30"></div>
              <div className="flex items-baseline gap-1">
                <span className="font-price-chip text-[28px] font-bold text-on-surface">{formatCurrency(item.price24h)}</span>
                <span className="font-category-label text-[12px] text-on-surface-variant ml-1">/ 24H</span>
              </div>
            </div>

            {/* Tech Specs / Features Box */}
            <div className="mt-6 border border-outline-variant/30 bg-surface-container-low rounded-xl p-6">
              <div className="flex items-center gap-2 mb-6 text-on-surface">
                <span className="material-symbols-outlined text-primary text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>
                  {item.category === 'Bundle' ? 'inventory_2' : 'memory'}
                </span>
                <h3 className="font-category-label font-bold text-[18px]">
                  {item.category === 'Bundle' ? 'Included Items' : 'Key Features'}
                </h3>
              </div>
              
              <div className="flex flex-col gap-3">
                {item.specs.map((spec, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-[18px] mt-0.5" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                    <span className="font-price-chip text-[14px] text-on-surface font-bold leading-snug flex-1">
                      {spec}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Form (Calendar & Buttons) */}
            <BookingForm item={item} />

          </div>
        </div>
      </div>

      {/* Detail Produk Section */}
      <div className="bg-surface-container-low border-t border-outline-variant/20 py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-margin-page grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          <div className="flex flex-col">
            <h2 className="font-display-xl text-[32px] uppercase font-bold text-on-surface mb-6 border-b border-outline-variant/30 pb-4">
              DETAIL PRODUK
            </h2>
            <p className="font-body-md text-[15px] leading-relaxed text-on-surface-variant mb-6">
              {item.description}
            </p>
            <p className="font-body-md text-[15px] leading-relaxed text-on-surface-variant">
              Sistem autofokus mewarisi teknologi mutakhir, menampilkan pelacakan real-time bahkan saat merekam video. Prosesor yang responsif memastikan operasi tanpa lag, krusial untuk menangkap momen tak terduga dalam berbagai skenario produksi.
            </p>
          </div>
          
          <div className="flex flex-col pt-2 lg:pt-16">
            <p className="font-body-md text-[15px] leading-relaxed text-on-surface-variant mb-6">
              Bagi para profesional, alat ini adalah powerhouse sejati. Menawarkan resolusi luar biasa dan reproduksi warna yang menakjubkan, menjadikannya pilihan ideal untuk komersial dan dokumenter tanpa perlu color grading yang berat.
            </p>
            <ul className="font-body-md text-[15px] leading-relaxed text-on-surface-variant list-disc list-outside ml-5 space-y-3">
              <li>Layar fleksibel untuk berbagai sudut perekaman yang dinamis.</li>
              <li>Konektivitas canggih dengan kecepatan tinggi untuk alur kerja profesional.</li>
              <li>Desain bodi tahan debu dan kelembapan untuk kondisi lapangan yang menantang.</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}
