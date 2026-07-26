"use client";

import { useBookingStore } from "@/lib/store";
import Link from "next/link";
import { useState } from "react";
import { generateWhatsAppMessage, CustomerData } from "@/lib/whatsapp";
import { formatCurrency } from "@/lib/formatters";

export default function CartPage() {
  const { items, removeItem, clearCart } = useBookingStore();
  
  const [nama, setNama] = useState("");
  const [instagram, setInstagram] = useState("");
  const [telepon, setTelepon] = useState("");
  const [alamat, setAlamat] = useState("");
  const [jamAmbil, setJamAmbil] = useState("");

  const grandTotal = items.reduce((acc, item) => acc + item.totalPrice, 0);

  const handleCheckout = () => {
    if (!nama || !telepon || !jamAmbil) {
      alert("Mohon lengkapi Nama, No Telepon, dan Jam Ambil.");
      return;
    }

    const customerData: CustomerData = {
      nama,
      instagram,
      telepon,
      alamat,
      jamAmbil
    };

    const waUrl = generateWhatsAppMessage(customerData, items);
    window.open(waUrl, "_blank");
    clearCart();
  };

  if (items.length === 0) {
    return (
      <div className="px-margin-page py-16 bg-surface-container-lowest min-h-screen flex flex-col items-center justify-center text-center">
        <span className="material-symbols-outlined text-[64px] text-on-surface-variant mb-6">production_quantity_limits</span>
        <h1 className="font-display-xl text-[48px] uppercase leading-none text-on-surface mb-6 font-black tracking-tight">
          Keranjang Kosong
        </h1>
        <Link href="/catalog" className="bg-primary text-on-primary px-8 py-4 font-category-label text-[16px] font-bold uppercase hover:bg-primary/90 active:scale-95 transition-all rounded-full">
          Jelajahi Katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-margin-page py-8 md:py-16">
        
        <div className="flex items-center gap-4 mb-8 border-b-2 border-outline-variant/30 pb-6">
          <span className="material-symbols-outlined text-[32px] text-primary" style={{fontVariationSettings: "'FILL' 1"}}>shopping_cart</span>
          <h1 className="font-display-xl text-[36px] md:text-[48px] uppercase font-black leading-none text-on-surface tracking-tight">
            Keranjang Anda
          </h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Cart Items List */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row bg-surface-container-low border-2 border-on-surface rounded-xl p-4 gap-6 items-center relative shadow-sm">
                
                <div className="w-full sm:w-32 h-32 bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-2 flex-shrink-0 relative">
                  <img src={item.gear.image} alt={item.gear.name} className="w-full h-full object-contain" />
                </div>
                
                <div className="flex flex-col flex-grow w-full">
                  <h3 className="font-display-xl text-[24px] uppercase font-black text-on-surface">{item.gear.name}</h3>
                  <div className="text-on-surface-variant font-category-label text-[13px] font-bold mt-1">
                    {item.startDate} s/d {item.endDate} <span className="text-primary">({item.days} Hari)</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <span className="font-category-label text-[12px] uppercase text-on-surface-variant font-bold bg-surface-container px-2 py-1 rounded">Qty: {item.quantity}</span>
                    </div>
                    <div className="font-price-chip text-on-surface text-[20px] font-bold">
                      {formatCurrency(item.totalPrice)}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => removeItem(item.id)} 
                  className="absolute top-4 right-4 text-on-surface-variant hover:text-error transition-colors"
                  title="Hapus"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            ))}
          </div>
          
          {/* Checkout Form */}
          <div className="lg:col-span-5">
            <div className="bg-surface-container-low border-2 border-on-surface rounded-2xl p-6 md:p-8 flex flex-col shadow-lg sticky top-24">
              <h3 className="font-display-xl text-[24px] font-black uppercase border-b-2 border-on-surface pb-4 mb-6 tracking-tight">Detail Pemesan</h3>
              
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col gap-2">
                  <label className="font-category-label text-[12px] font-bold uppercase text-on-surface-variant">Nama Lengkap</label>
                  <input type="text" value={nama} onChange={e => setNama(e.target.value)} placeholder="Nama Sesuai KTP" className="p-3 bg-surface-container-lowest border-2 border-outline-variant/50 rounded-xl font-body-md text-on-surface focus:border-primary outline-none transition-colors" />
                </div>
                
                <div className="flex gap-4">
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="font-category-label text-[12px] font-bold uppercase text-on-surface-variant">No. Telepon / WA</label>
                    <input type="tel" value={telepon} onChange={e => setTelepon(e.target.value)} placeholder="08..." className="p-3 bg-surface-container-lowest border-2 border-outline-variant/50 rounded-xl font-body-md text-on-surface focus:border-primary outline-none transition-colors" />
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="font-category-label text-[12px] font-bold uppercase text-on-surface-variant">Instagram</label>
                    <input type="text" value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="@username" className="p-3 bg-surface-container-lowest border-2 border-outline-variant/50 rounded-xl font-body-md text-on-surface focus:border-primary outline-none transition-colors" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-category-label text-[12px] font-bold uppercase text-on-surface-variant">Alamat Lengkap</label>
                  <input type="text" value={alamat} onChange={e => setAlamat(e.target.value)} className="p-3 bg-surface-container-lowest border-2 border-outline-variant/50 rounded-xl font-body-md text-on-surface focus:border-primary outline-none transition-colors" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-category-label text-[12px] font-bold uppercase text-on-surface-variant">Rencana Jam Ambil</label>
                  <input type="time" value={jamAmbil} onChange={e => setJamAmbil(e.target.value)} className="p-3 bg-surface-container-lowest border-2 border-outline-variant/50 rounded-xl font-body-md text-on-surface focus:border-primary outline-none transition-colors w-1/2" />
                </div>
              </div>
              
              <div className="flex justify-between items-end mb-6 pb-4 border-b-2 border-outline-variant/30">
                <span className="font-category-label uppercase font-bold text-[14px]">Total Estimasi</span>
                <span className="font-price-chip text-[32px] text-primary font-bold">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
              
              <button 
                onClick={handleCheckout}
                className="bg-primary text-on-primary flex items-center justify-center gap-2 w-full py-4 rounded-full font-category-label text-[16px] font-bold uppercase hover:bg-primary/90 active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined">send</span>
                Checkout via WhatsApp
              </button>
              
              <p className="font-body-md text-[12px] text-on-surface-variant text-center mt-4">
                Anda akan diarahkan ke WhatsApp untuk verifikasi ketersediaan dan pembayaran DP.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
