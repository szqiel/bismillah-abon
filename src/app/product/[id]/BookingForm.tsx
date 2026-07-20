"use client";

import { useState } from "react";
import { GearItem } from "@/lib/data";
import { useBookingStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { generateWhatsAppMessage } from "@/lib/whatsapp";

export default function BookingForm({ item }: { item: GearItem }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [intent, setIntent] = useState<'whatsapp' | 'cart' | null>(null);
  
  // Form State
  const [nama, setNama] = useState("");
  const [instagram, setInstagram] = useState("");
  const [telepon, setTelepon] = useState("");
  const [alamat, setAlamat] = useState("");
  const [jamAmbil, setJamAmbil] = useState("");
  const [tanggalAmbil, setTanggalAmbil] = useState("");
  const [tanggalKembali, setTanggalKembali] = useState("");
  const [kuantitas, setKuantitas] = useState(1);
  
  const router = useRouter();
  const addItem = useBookingStore(state => state.addItem);

  const calculateDays = () => {
    if (!tanggalAmbil || !tanggalKembali) return 0;
    const start = new Date(tanggalAmbil);
    const end = new Date(tanggalKembali);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime < 0) return 0;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
    return diffDays;
  };

  const days = calculateDays();
  const totalPrice = days > 0 ? days * item.price24h * kuantitas : 0;

  const openModal = (actionIntent: 'whatsapp' | 'cart') => {
    if (!item.available) {
      alert("Gear ini sedang dipesan dan tidak tersedia.");
      return;
    }
    setIntent(actionIntent);
    setIsModalOpen(true);
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIntent(null);
    document.body.style.overflow = 'auto';
  };

  const handleConfirm = () => {
    if (!tanggalAmbil || !tanggalKembali) {
      alert("Silakan pilih tanggal ambil dan kembali.");
      return;
    }
    if (new Date(tanggalAmbil) > new Date(tanggalKembali)) {
      alert("Tanggal kembali tidak boleh sebelum tanggal ambil.");
      return;
    }

    if (intent === 'whatsapp') {
      // Validate extra fields for Whatsapp
      if (!nama || !telepon) {
        alert("Mohon lengkapi Nama dan No Telepon.");
        return;
      }
      
      const cartItem = {
        id: Math.random().toString(36).substring(7),
        gear: item,
        quantity: kuantitas,
        startDate: tanggalAmbil,
        endDate: tanggalKembali,
        days,
        totalPrice,
      };

      const waUrl = generateWhatsAppMessage({
        nama,
        instagram,
        telepon,
        alamat,
        jamAmbil
      }, [cartItem]);
      
      window.open(waUrl, "_blank");
      closeModal();
      
    } else if (intent === 'cart') {
      addItem({
        id: Math.random().toString(36).substring(7),
        gear: item,
        quantity: kuantitas,
        startDate: tanggalAmbil,
        endDate: tanggalKembali,
        days,
        totalPrice,
      });
      closeModal();
      router.push("/cart");
    }
  };

  return (
    <div className="mt-6 flex flex-col gap-4 relative">
      
      {/* Calendar Widget Container (Mock visual) */}
      <div className="border border-outline-variant/30 bg-surface-container-low/50 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-on-surface">
            <span className="material-symbols-outlined text-primary text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>calendar_month</span>
            <h3 className="font-category-label font-bold text-[18px]">Ketersediaan</h3>
          </div>
          <div className="bg-surface-container border border-outline-variant/30 text-on-surface-variant px-3 py-1 rounded font-category-label text-[12px] font-bold">
            Okt 2024
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['S', 'S', 'R', 'K', 'J', 'S', 'M'].map((day, i) => (
            <div key={i} className="text-center font-category-label text-[12px] font-bold text-on-surface-variant">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          <div className="col-start-3 aspect-square flex items-center justify-start p-1.5 font-price-chip text-[12px] text-on-surface-variant/30 line-through">1</div>
          <div className="aspect-square flex items-center justify-start p-1.5 font-price-chip text-[12px] text-on-surface-variant/30">2</div>
          <div className="aspect-square flex items-center justify-start p-1.5 font-price-chip text-[12px] text-primary border border-primary/50 bg-primary/10 rounded">3</div>
          <div className="aspect-square flex items-center justify-start p-1.5 font-price-chip text-[12px] text-primary border border-primary/50 bg-primary/10 rounded">4</div>
          <div className="aspect-square flex items-center justify-start p-1.5 font-price-chip text-[12px] text-on-surface-variant/50">5</div>
          <div className="aspect-square flex items-center justify-start p-1.5 font-price-chip text-[12px] text-primary border border-primary/50 bg-primary/10 rounded">6</div>
          <div className="aspect-square flex items-center justify-start p-1.5 font-price-chip text-[12px] text-primary border border-primary/50 bg-primary/10 rounded">7</div>
          <div className="aspect-square flex items-center justify-start p-1.5 font-price-chip text-[12px] text-error border border-error/50 bg-error/10 rounded">8</div>
          <div className="aspect-square flex items-center justify-start p-1.5 font-price-chip text-[12px] text-error border border-error/50 bg-error/10 rounded">9</div>
          <div className="aspect-square flex items-center justify-start p-1.5 font-price-chip text-[12px] text-primary border border-primary/50 bg-primary/10 rounded">10</div>
          <div className="aspect-square flex items-center justify-start p-1.5 font-price-chip text-[12px] text-primary border border-primary/50 bg-primary/10 rounded">11</div>
          <div className="aspect-square flex items-center justify-start p-1.5 font-price-chip text-[12px] text-primary border border-primary/50 bg-primary/10 rounded">12</div>
        </div>
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm border border-primary/50 bg-primary/20"></div>
            <span className="font-category-label text-[12px] text-on-surface-variant">Tersedia</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm border border-error/50 bg-error/20"></div>
            <span className="font-category-label text-[12px] text-on-surface-variant">Dipesan</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <button 
        onClick={() => openModal('whatsapp')}
        className="mt-2 w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-4 rounded-full font-category-label text-[15px] font-bold uppercase hover:bg-primary/90 transition-all active:scale-95 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>forum</span>
        Booking via Whatsapp
      </button>

      <button 
        onClick={() => openModal('cart')}
        className="w-full flex items-center justify-center gap-2 bg-transparent border border-on-surface text-on-surface py-4 rounded-full font-category-label text-[15px] font-bold uppercase hover:bg-on-surface/5 transition-all active:scale-95 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>shopping_cart</span>
        Tambah ke Keranjang
      </button>

      {/* Modal Popup overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in slide-in-from-bottom-4 duration-300">
            
            {/* Close Button */}
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-surface-container rounded-full hover:bg-error hover:text-on-error transition-colors z-10"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            
            <div className="p-6 md:p-8 flex flex-col gap-6">
              <div>
                <h3 className="font-display-xl text-[28px] uppercase font-black text-on-surface tracking-tight">Detail Booking</h3>
                <p className="font-body-md text-on-surface-variant text-[14px] mt-1">Lengkapi data di bawah ini untuk melanjutkan.</p>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Personal Info */}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="font-category-label text-[12px] font-bold uppercase text-on-surface-variant">Nama Lengkap</label>
                  <input type="text" value={nama} onChange={e => setNama(e.target.value)} placeholder="Nama Sesuai KTP" className="p-3 bg-surface-container-low border border-outline-variant/50 rounded-xl font-body-md text-on-surface focus:border-primary outline-none transition-colors" />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="font-category-label text-[12px] font-bold uppercase text-on-surface-variant">Instagram</label>
                  <input type="text" value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="@username" className="p-3 bg-surface-container-low border border-outline-variant/50 rounded-xl font-body-md text-on-surface focus:border-primary outline-none transition-colors" />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="font-category-label text-[12px] font-bold uppercase text-on-surface-variant">No. Telepon / WA</label>
                  <input type="tel" value={telepon} onChange={e => setTelepon(e.target.value)} placeholder="08..." className="p-3 bg-surface-container-low border border-outline-variant/50 rounded-xl font-body-md text-on-surface focus:border-primary outline-none transition-colors" />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="font-category-label text-[12px] font-bold uppercase text-on-surface-variant">Alamat Lengkap</label>
                  <input type="text" value={alamat} onChange={e => setAlamat(e.target.value)} className="p-3 bg-surface-container-low border border-outline-variant/50 rounded-xl font-body-md text-on-surface focus:border-primary outline-none transition-colors" />
                </div>
                
                <div className="col-span-1 md:col-span-2 border-t border-outline-variant/30 my-2"></div>
                
                {/* Dates Info */}
                <div className="flex flex-col gap-2">
                  <label className="font-category-label text-[12px] font-bold uppercase text-on-surface-variant">Tanggal Ambil</label>
                  <input type="date" value={tanggalAmbil} onChange={e => setTanggalAmbil(e.target.value)} className="p-3 bg-surface-container-low border border-outline-variant/50 rounded-xl font-body-md text-on-surface focus:border-primary outline-none transition-colors" />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="font-category-label text-[12px] font-bold uppercase text-on-surface-variant">Tanggal Kembali</label>
                  <input type="date" value={tanggalKembali} onChange={e => setTanggalKembali(e.target.value)} className="p-3 bg-surface-container-low border border-outline-variant/50 rounded-xl font-body-md text-on-surface focus:border-primary outline-none transition-colors" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-category-label text-[12px] font-bold uppercase text-on-surface-variant">Jam Ambil</label>
                  <input type="time" value={jamAmbil} onChange={e => setJamAmbil(e.target.value)} className="p-3 bg-surface-container-low border border-outline-variant/50 rounded-xl font-body-md text-on-surface focus:border-primary outline-none transition-colors" />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="font-category-label text-[12px] font-bold uppercase text-on-surface-variant">Kuantitas Alat</label>
                  <input type="number" min="1" value={kuantitas} onChange={e => setKuantitas(Number(e.target.value))} className="p-3 bg-surface-container-low border border-outline-variant/50 rounded-xl font-body-md text-on-surface focus:border-primary outline-none transition-colors" />
                </div>

              </div>

              {/* Summary */}
              <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mt-2">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="font-category-label text-[12px] font-bold uppercase text-primary">Durasi Sewa: {days} Hari</span>
                    <span className="font-category-label text-[12px] font-bold uppercase text-on-surface-variant mt-1">Total Estimasi Harga</span>
                  </div>
                  <span className="font-price-chip text-[24px] font-bold text-primary">
                    Rp {(totalPrice / 1000).toLocaleString('id-ID')}K
                  </span>
                </div>
              </div>

              {/* Submit Action */}
              <button 
                onClick={handleConfirm}
                disabled={!tanggalAmbil || !tanggalKembali}
                className={`w-full py-4 rounded-full font-category-label text-[16px] font-bold uppercase transition-all flex items-center justify-center gap-2 active:scale-95
                  ${
                    !tanggalAmbil || !tanggalKembali
                      ? "bg-surface-container-high text-on-surface-variant cursor-not-allowed border border-outline-variant"
                      : "bg-primary text-on-primary cursor-pointer hover:bg-primary/90"
                  }`}
              >
                <span className="material-symbols-outlined">{intent === 'whatsapp' ? 'send' : 'add_shopping_cart'}</span>
                {intent === 'whatsapp' ? 'Kirim Format via WhatsApp' : 'Konfirmasi Keranjang'}
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
