"use client";

import { useMemo } from "react";
import { useAdminStore } from "@/lib/adminStore";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/formatters";

export default function ReportsPage() {
  const { orders, inventory, updateOrderPaymentStatus } = useAdminStore();

  const nonCancelledOrders = useMemo(
    () => orders.filter((o) => o.status !== "cancelled"),
    [orders]
  );

  const totalRevenue = useMemo(
    () => nonCancelledOrders.reduce((sum, o) => sum + o.totalPrice, 0),
    [nonCancelledOrders]
  );

  // Revenue by Category computation
  const categoryRevenue = useMemo(() => {
    const map: Record<string, number> = {
      Camera: 0,
      Lens: 0,
      Lighting: 0,
      Audio: 0,
      Support: 0,
      Bundle: 0,
    };

    nonCancelledOrders.forEach((order) => {
      order.items.forEach((item) => {
        const gear = inventory.find((g) => g.id === item.gearItemId);
        const cat = gear ? gear.category : "Camera";
        map[cat] = (map[cat] || 0) + item.unitPrice * item.quantity;
      });
    });

    return map;
  }, [nonCancelledOrders, inventory]);

  // Gear Utilization Count
  const gearUtilization = useMemo(() => {
    const map: Record<string, { name: string; category: string; count: number }> = {};

    inventory.forEach((item) => {
      map[item.id] = { name: item.name, category: item.category, count: 0 };
    });

    nonCancelledOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (map[item.gearItemId]) {
          map[item.gearItemId].count += item.quantity;
        }
      });
    });

    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [inventory, nonCancelledOrders]);

  // Outstanding Balances List
  const outstandingOrders = useMemo(() => {
    return orders.filter(
      (o) => o.status !== "cancelled" && (o.paymentStatus === "unpaid" || o.paymentStatus === "partial")
    );
  }, [orders]);

  const totalOutstandingAmount = useMemo(() => {
    return outstandingOrders.reduce((sum, o) => {
      const paid = o.paymentStatus === "partial" ? o.deposit : 0;
      return sum + (o.totalPrice - paid);
    }, 0);
  }, [outstandingOrders]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30">
        <div>
          <h1 className="font-display-xl text-[24px] font-black text-on-surface uppercase tracking-tight">
            Financial & Utilization Reports
          </h1>
          <p className="font-body-md text-[13px] text-on-surface-variant">
            Rincian pendapatan sewa, metrik tingkat penggunaan unit, dan pelacakan sisa pembayaran belum lunas.
          </p>
        </div>
      </div>

      {/* Revenue Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 flex flex-col justify-between">
          <span className="font-category-label text-[12px] font-bold uppercase text-outline mb-2">
            Total Revenue YTD
          </span>
          <div className="font-price-chip text-[32px] font-black text-primary">
            {formatCurrency(totalRevenue)}
          </div>
          <span className="font-body-md text-[12px] text-on-surface-variant mt-2">
            Dari {nonCancelledOrders.length} transaksi sewa terkonfirmasi
          </span>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 flex flex-col justify-between">
          <span className="font-category-label text-[12px] font-bold uppercase text-outline mb-2">
            Outstanding Receivables
          </span>
          <div className="font-price-chip text-[32px] font-black text-red-600">
            {formatCurrency(totalOutstandingAmount)}
          </div>
          <span className="font-body-md text-[12px] text-red-600/80 mt-2">
            Dari {outstandingOrders.length} pesanan belum lunas / DP
          </span>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 flex flex-col justify-between">
          <span className="font-category-label text-[12px] font-bold uppercase text-outline mb-2">
            Average Order Value
          </span>
          <div className="font-price-chip text-[32px] font-black text-on-surface">
            {formatCurrency(nonCancelledOrders.length ? Math.round(totalRevenue / nonCancelledOrders.length) : 0)}
          </div>
          <span className="font-body-md text-[12px] text-on-surface-variant mt-2">
            Rata-rata nilai per transaksi sewa
          </span>
        </div>
      </div>

      {/* Grid: Category Revenue & Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue by Category */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 space-y-6">
          <h3 className="font-display-xl text-[20px] font-black text-on-surface uppercase tracking-tight">
            Revenue by Category
          </h3>

          <div className="space-y-4 font-body-md text-[14px]">
            {Object.entries(categoryRevenue).map(([cat, val]) => {
              const percentage = totalRevenue > 0 ? Math.round((val / totalRevenue) * 100) : 0;

              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex justify-between font-category-label font-bold text-[13px]">
                    <span className="text-on-surface">{cat}</span>
                    <span className="font-price-chip text-primary">
                      {formatCurrency(val)} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden border border-outline-variant/30">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Equipment Utilization */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 space-y-6">
          <h3 className="font-display-xl text-[20px] font-black text-on-surface uppercase tracking-tight">
            Gear Utilization Ranking
          </h3>

          <div className="space-y-3 overflow-y-auto max-h-[340px] pr-1">
            {gearUtilization.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-outline-variant/30"
              >
                <div>
                  <div className="font-category-label font-bold text-[14px] text-on-surface">
                    {item.name}
                  </div>
                  <div className="font-category-label text-[11px] uppercase text-outline">
                    {item.category}
                  </div>
                </div>
                <div className="font-price-chip text-[13px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  {item.count} kali disewa
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Outstanding Balances Table */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 space-y-6">
        <h3 className="font-display-xl text-[20px] font-black text-on-surface uppercase tracking-tight">
          Outstanding Unpaid & Partial Balances
        </h3>

        {outstandingOrders.length === 0 ? (
          <div className="text-center py-8 text-outline italic text-[14px]">
            Semua tagihan sewa telah lunas terbayar!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 text-outline font-category-label text-[11px] uppercase tracking-wider bg-surface-container-low/40">
                  <th className="py-3.5 px-6">ID Pesanan</th>
                  <th className="py-3.5 px-6">Pelanggan</th>
                  <th className="py-3.5 px-6">Tgl Transaksi</th>
                  <th className="py-3.5 px-6">Status Pembayaran</th>
                  <th className="py-3.5 px-6">Total Biaya</th>
                  <th className="py-3.5 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-body-md text-[14px]">
                {outstandingOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-4 px-6 font-price-chip font-bold text-on-surface">
                      {order.id}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-category-label font-bold text-on-surface">
                        {order.customerName}
                      </div>
                      <div className="font-price-chip text-[12px] text-on-surface-variant">
                        {order.customerPhone}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-price-chip text-[13px]">
                      {formatDate(order.startAt)}
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge paymentStatus={order.paymentStatus} />
                    </td>
                    <td className="py-4 px-6 font-price-chip text-red-600 font-bold text-[15px]">
                      {formatCurrency(order.totalPrice)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => updateOrderPaymentStatus(order.id, "paid")}
                        className="px-3.5 py-1.5 bg-primary text-on-primary font-category-label text-[12px] font-bold uppercase rounded-lg shadow-xs hover:bg-primary/90 transition-all"
                      >
                        Tandai Lunas
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
