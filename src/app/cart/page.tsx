"use client";

import { useBookingStore } from "@/lib/store";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { items, removeItem, clearCart } = useBookingStore();
  const [customerName, setCustomerName] = useState("");

  const grandTotal = items.reduce((acc, item) => acc + item.totalPrice, 0);

  const generateWhatsAppLink = () => {
    let message = `Halo! Saya mau booking dari *${siteConfig.name}*:\n\n`;
    
    items.forEach((item) => {
      message += `- ${item.gear.name} x${item.quantity}\n`;
      message += `  Tgl: ${item.startDate} s/d ${item.endDate} (${item.days} hari)\n`;
      message += `  Subtotal: Rp ${(item.totalPrice).toLocaleString('id-ID')}\n\n`;
    });
    
    message += `*Estimasi Total: Rp ${grandTotal.toLocaleString('id-ID')}*\n\n`;
    message += `Nama: ${customerName || "[Belum diisi]"}\n`;
    
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${siteConfig.whatsappNumber}?text=${encoded}`;
  };

  if (items.length === 0) {
    return (
      <div className="px-margin-desktop py-xl bg-surface min-h-screen flex flex-col items-center justify-center text-center">
        <span className="material-symbols-outlined text-[64px] text-on-surface-variant mb-md">production_quantity_limits</span>
        <h1 className="font-display-xl text-[48px] uppercase leading-none text-on-surface mb-md">
          Your Cart is Empty
        </h1>
        <Link href="/catalog" className="bg-on-tertiary-fixed text-surface-bright px-lg py-sm font-label-caps text-label-caps uppercase hover:bg-primary-container transition-colors duration-200">
          Browse Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="px-margin-desktop py-xl bg-surface min-h-screen">
      <h1 className="font-display-xl text-[48px] uppercase leading-none text-on-surface mb-lg border-b-2 border-on-tertiary-fixed pb-sm">
        Booking Summary
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-xl">
        <div className="md:col-span-8 flex flex-col gap-md">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row hard-border bg-surface-bright p-sm gap-md items-center">
               <div className="w-full md:w-32 h-32 bg-surface-container relative">
                 <img src={item.gear.image} alt={item.gear.name} className="w-full h-full object-contain mix-blend-multiply" />
               </div>
               <div className="flex flex-col flex-grow">
                 <h3 className="font-headline-lg-mobile text-[24px] uppercase">{item.gear.name}</h3>
                 <div className="text-on-surface-variant font-body-md text-sm">
                   {item.startDate} to {item.endDate} ({item.days} days)
                 </div>
                 <div className="font-price-tag text-primary text-[20px] mt-xs">
                   Rp {(item.totalPrice).toLocaleString('id-ID')}
                 </div>
               </div>
               <div className="flex flex-col items-center gap-xs">
                 <span className="font-label-caps text-[12px]">Qty: {item.quantity}</span>
                 <button onClick={() => removeItem(item.id)} className="text-error underline font-label-caps text-[10px] uppercase">Remove</button>
               </div>
            </div>
          ))}
        </div>
        
        <div className="md:col-span-4">
          <div className="hard-border bg-surface-container-low p-md flex flex-col">
            <h3 className="font-headline-lg-mobile text-[24px] uppercase border-b-2 border-on-tertiary-fixed pb-sm mb-md">Checkout</h3>
            
            <div className="flex justify-between items-center mb-sm">
              <span className="font-body-md">Items</span>
              <span className="font-body-md">{items.length}</span>
            </div>
            
            <div className="flex justify-between items-center mb-md pb-md border-b-2 border-outline-variant">
              <span className="font-label-caps uppercase">Total</span>
              <span className="font-price-tag text-[24px] text-primary">
                Rp {grandTotal.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="flex flex-col mb-md">
              <label className="font-label-caps uppercase text-on-surface-variant mb-xs">Your Name (Optional)</label>
              <input 
                type="text" 
                placeholder="Enter your name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="p-sm bg-surface-bright border-2 border-outline-variant font-body-md focus:border-primary outline-none"
              />
            </div>
            
            <a 
              href={generateWhatsAppLink()}
              target="_blank"
              rel="noreferrer"
              onClick={clearCart}
              className="bg-primary text-center text-on-primary px-lg py-md font-label-caps text-label-caps uppercase hover:bg-primary-container hover:text-on-primary-container transition-colors duration-200"
            >
              Book via WhatsApp
            </a>
            
            <p className="font-label-caps text-[10px] text-on-surface-variant text-center mt-sm">
              You will be redirected to WhatsApp to confirm your booking and check availability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
