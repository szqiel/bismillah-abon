"use client";

import { useState, useMemo } from "react";
import { useAdminStore } from "@/lib/adminStore";

export default function CalendarPage() {
  const { orders, inventory } = useAdminStore();
  const [selectedGearId, setSelectedGearId] = useState<string>("all");

  // Days matrix for July 2026 (matching our mock dataset)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const filteredOrders = useMemo(() => {
    if (selectedGearId === "all") return orders;
    return orders.filter((o) =>
      o.items.some((item) => item.gearItemId === selectedGearId)
    );
  }, [orders, selectedGearId]);

  // Map orders by day of month (July 2026)
  const getOrdersForDay = (day: number) => {
    const dayDate = new Date(2026, 6, day); // Month 6 is July (0-indexed)
    return filteredOrders.filter((order) => {
      if (order.status === "cancelled") return false;
      const start = new Date(order.startAt);
      const due = new Date(order.dueAt);
      return dayDate >= new Date(start.setHours(0,0,0,0)) && dayDate <= new Date(due.setHours(23,59,59,999));
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30">
        <div>
          <h1 className="font-display-xl text-[24px] font-black text-on-surface uppercase tracking-tight">
            Rental Calendar & Availability
          </h1>
          <p className="font-body-md text-[13px] text-on-surface-variant">
            Kalender visual bulanan untuk memantau jadwal sewa dan ketersediaan unit peralatan.
          </p>
        </div>

        {/* Product Filter Dropdown */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="font-category-label font-bold text-[12px] uppercase text-outline flex-shrink-0">
            Filter Alat:
          </label>
          <select
            value={selectedGearId}
            onChange={(e) => setSelectedGearId(e.target.value)}
            className="w-full sm:w-64 p-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl font-category-label font-bold text-[13px] text-on-surface"
          >
            <option value="all">Semua Unit Peralatan</option>
            {inventory.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Month Label Header */}
      <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
        <h3 className="font-display-xl text-[18px] font-black text-on-surface uppercase tracking-tight">
          Juli 2026
        </h3>
        <div className="flex items-center gap-4 text-[12px] font-category-label font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span>Confirmed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-primary"></span>
            <span>Out (Disewa)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span>Pending</span>
          </div>
        </div>
      </div>

      {/* Calendar Month Grid */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 overflow-hidden">
        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-2 mb-3 text-center font-category-label font-bold text-[11px] uppercase text-outline">
          <div>Minggu</div>
          <div>Senin</div>
          <div>Selasa</div>
          <div>Rabu</div>
          <div>Kamis</div>
          <div>Jumat</div>
          <div>Sabtu</div>
        </div>

        {/* Day Cells */}
        <div className="grid grid-cols-7 gap-2">
          {daysInMonth.map((day) => {
            const dayOrders = getOrdersForDay(day);
            const isToday = day === 26; // Simulated current day

            return (
              <div
                key={day}
                className={`min-h-[110px] p-2 rounded-xl border flex flex-col justify-between transition-colors ${
                  isToday
                    ? "bg-primary/5 border-primary/50"
                    : "bg-surface-container-low/40 border-outline-variant/20 hover:border-outline-variant"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-price-chip font-bold text-[13px] ${
                      isToday
                        ? "bg-primary text-on-primary w-6 h-6 rounded-full flex items-center justify-center text-[11px]"
                        : "text-on-surface"
                    }`}
                  >
                    {day}
                  </span>
                  {dayOrders.length > 0 && (
                    <span className="font-price-chip text-[10px] font-bold text-outline">
                      {dayOrders.length} dipesan
                    </span>
                  )}
                </div>

                <div className="space-y-1 my-1 overflow-y-auto max-h-[70px] pr-0.5">
                  {dayOrders.map((order) => (
                    <div
                      key={order.id}
                      title={`${order.customerName}: ${order.items.map((i) => i.name).join(", ")}`}
                      className={`text-[10px] font-category-label font-bold px-1.5 py-0.5 rounded truncate border ${
                        order.status === "out"
                          ? "bg-primary/15 text-primary border-primary/30"
                          : order.status === "confirmed"
                          ? "bg-blue-500/15 text-blue-600 border-blue-500/30"
                          : "bg-amber-500/15 text-amber-600 border-amber-500/30"
                      }`}
                    >
                      {order.customerName.split(" ")[0]}: {order.items[0]?.name}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
