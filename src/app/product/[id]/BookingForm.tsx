"use client";

import { useState } from "react";
import { GearItem } from "@/lib/data";
import { useBookingStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function BookingForm({ item }: { item: GearItem }) {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const router = useRouter();
  
  const addItem = useBookingStore(state => state.addItem);

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
    return diffDays;
  };

  const days = calculateDays();
  const totalPrice = days > 0 ? days * item.price24h * quantity : 0;

  const handleBook = () => {
    if (!startDate || !endDate) {
      alert("Please select start and end dates.");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      alert("End date cannot be before start date.");
      return;
    }
    
    addItem({
      id: Math.random().toString(36).substring(7),
      gear: item,
      quantity,
      startDate,
      endDate,
      days,
      totalPrice,
    });
    
    router.push("/cart");
  };

  return (
    <div className="flex flex-col gap-md p-md hard-border bg-surface-container-low mt-lg">
      <h3 className="font-headline-lg-mobile text-[24px] uppercase border-b-2 border-on-tertiary-fixed pb-sm">Book This Gear</h3>
      
      <div className="flex gap-md flex-col md:flex-row">
        <div className="flex flex-col flex-1">
          <label className="font-label-caps text-label-caps uppercase text-on-surface-variant mb-xs">Start Date</label>
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-sm bg-surface-bright border-2 border-outline-variant font-body-md focus:border-primary outline-none"
          />
        </div>
        <div className="flex flex-col flex-1">
          <label className="font-label-caps text-label-caps uppercase text-on-surface-variant mb-xs">End Date</label>
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-sm bg-surface-bright border-2 border-outline-variant font-body-md focus:border-primary outline-none"
          />
        </div>
      </div>
      
      <div className="flex flex-col mt-sm">
        <label className="font-label-caps text-label-caps uppercase text-on-surface-variant mb-xs">Quantity</label>
        <input 
          type="number" 
          min="1" 
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="p-sm bg-surface-bright border-2 border-outline-variant font-body-md focus:border-primary outline-none w-full md:w-32"
        />
      </div>

      <div className="flex justify-between items-end mt-md border-t-2 border-outline-variant pt-sm">
        <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Estimated Total</span>
        <span className="font-price-tag text-[28px] tracking-wider text-primary">
          Rp {(totalPrice / 1000).toLocaleString('id-ID')}K
        </span>
      </div>

      <button 
        onClick={handleBook}
        className="mt-sm bg-primary text-on-primary px-lg py-md font-label-caps text-label-caps uppercase hover:bg-primary-container hover:text-on-primary-container transition-colors duration-200"
      >
        Add to Booking Cart
      </button>
    </div>
  );
}
