"use client";

import Link from "next/link";
import { useAdminStore } from "@/lib/adminStore";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/formatters";

export default function AdminDashboardPage() {
  const { orders, inventory, customers } = useAdminStore();

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const activeRentals = orders.filter((o) => o.status === "out");
  const overdueOrders = orders.filter(
    (o) => o.status === "out" && new Date(o.dueAt) < new Date()
  );

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const recentOrders = orders.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner & Quick Action Buttons */}
      <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display-xl text-[28px] font-black text-on-surface uppercase tracking-tight">
            System Overview
          </h1>
          <p className="font-body-md text-[14px] text-on-surface-variant">
            Statistik operasional langsung untuk Hub Peralatan Abon Kamera Semarang.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/4dminabon/orders"
            className="bg-primary text-on-primary font-category-label text-[13px] font-bold uppercase px-5 py-2.5 rounded-full hover:bg-primary/90 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>New Order</span>
          </Link>
          <Link
            href="/4dminabon/inventory"
            className="bg-surface-container text-on-surface font-category-label text-[13px] font-bold uppercase px-5 py-2.5 rounded-full hover:bg-surface-container-high transition-all flex items-center gap-2 border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            <span>Manage Gear</span>
          </Link>
        </div>
      </div>

      {/* Critical Overdue Warning Alert */}
      {overdueOrders.length > 0 && (
        <div className="bg-red-500/10 border-2 border-red-500/40 p-4 rounded-xl flex items-center justify-between text-red-600">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[28px] animate-pulse">warning</span>
            <div>
              <h4 className="font-category-label font-bold text-[15px] uppercase">
                Peringatan Sewa Melewati Batas Waktu ({overdueOrders.length})
              </h4>
              <p className="font-body-md text-[13px] text-red-600/80">
                Penyewa ({overdueOrders.map((o) => o.customerName).join(", ")}) belum mengembalikan alat sesuai jadwal yang ditentukan.
              </p>
            </div>
          </div>
          <Link
            href="/4dminabon/orders"
            className="bg-red-600 text-white font-category-label text-[12px] font-bold uppercase px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Review Orders
          </Link>
        </div>
      )}

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-4">
            <span className="font-category-label text-[12px] font-bold uppercase tracking-wider">
              Active Rentals
            </span>
            <span className="material-symbols-outlined text-primary text-[24px]">key</span>
          </div>
          <div>
            <div className="font-price-chip text-[32px] font-black text-on-surface">
              {activeRentals.length}
            </div>
            <div className="font-body-md text-[12px] text-primary mt-1">
              Sedang digunakan di lokasi syuting
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-4">
            <span className="font-category-label text-[12px] font-bold uppercase tracking-wider">
              Pending Orders
            </span>
            <span className="material-symbols-outlined text-amber-500 text-[24px]">pending_actions</span>
          </div>
          <div>
            <div className="font-price-chip text-[32px] font-black text-amber-500">
              {pendingOrders.length}
            </div>
            <div className="font-body-md text-[12px] text-on-surface-variant mt-1">
              Menunggu konfirmasi admin
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-4">
            <span className="font-category-label text-[12px] font-bold uppercase tracking-wider">
              Total Revenue (YTD)
            </span>
            <span className="material-symbols-outlined text-primary text-[24px]">payments</span>
          </div>
          <div>
            <div className="font-price-chip text-[28px] font-black text-primary truncate">
              {formatCurrency(totalRevenue)}
            </div>
            <div className="font-body-md text-[12px] text-on-surface-variant mt-1">
              Dari {totalOrders} total transaksi sewa
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-4">
            <span className="font-category-label text-[12px] font-bold uppercase tracking-wider">
              Total Inventory Items
            </span>
            <span className="material-symbols-outlined text-on-surface text-[24px]">photo_camera</span>
          </div>
          <div>
            <div className="font-price-chip text-[32px] font-black text-on-surface">
              {inventory.length}
            </div>
            <div className="font-body-md text-[12px] text-on-surface-variant mt-1">
              Terdaftar untuk {customers.length} pelanggan
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display-xl text-[20px] font-black text-on-surface uppercase tracking-tight">
              Recent Orders & Bookings
            </h3>
            <p className="font-body-md text-[13px] text-on-surface-variant">
              Daftar pesanan terbaru dan status pembaruan transaksi.
            </p>
          </div>
          <Link
            href="/4dminabon/orders"
            className="font-category-label text-[13px] text-primary hover:underline font-bold flex items-center gap-1"
          >
            <span>View All Kanban</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 text-outline font-category-label text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Pelanggan</th>
                <th className="py-3 px-4">Daftar Alat</th>
                <th className="py-3 px-4">Tgl Ambil</th>
                <th className="py-3 px-4">Tgl Kembali</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Total Biaya</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 font-body-md text-[14px]">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3.5 px-4 font-price-chip font-bold text-on-surface">
                    {order.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-category-label font-bold text-on-surface">
                      {order.customerName}
                    </div>
                    <div className="font-price-chip text-[12px] text-on-surface-variant">
                      {order.customerPhone}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-category-label text-[13px] text-on-surface max-w-xs truncate">
                      {order.items.map((i) => `${i.name} (x${i.quantity})`).join(", ")}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-price-chip text-[13px]">
                    {formatDate(order.startAt)}
                  </td>
                  <td className="py-3.5 px-4 font-price-chip text-[13px]">
                    {formatDate(order.dueAt)}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-3.5 px-4 font-price-chip font-bold text-primary">
                    {formatCurrency(order.totalPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
