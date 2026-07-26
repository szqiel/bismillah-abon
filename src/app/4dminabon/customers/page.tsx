"use client";

import { useState, useMemo } from "react";
import { useAdminStore } from "@/lib/adminStore";
import { Customer } from "@/lib/adminTypes";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/formatters";

export default function CustomersPage() {
  const { customers, orders } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"spend" | "orders" | "recent">("spend");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = useMemo(() => {
    const result = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery)
    );

    if (sortBy === "spend") {
      result.sort((a, b) => b.totalSpend - a.totalSpend);
    } else if (sortBy === "orders") {
      result.sort((a, b) => b.totalOrders - a.totalOrders);
    } else if (sortBy === "recent") {
      result.sort(
        (a, b) =>
          new Date(b.lastOrderAt || 0).getTime() -
          new Date(a.lastOrderAt || 0).getTime()
      );
    }

    return result;
  }, [customers, searchQuery, sortBy]);

  const customerOrders = useMemo(() => {
    if (!selectedCustomer) return [];
    return orders.filter((o) => o.customerId === selectedCustomer.id);
  }, [selectedCustomer, orders]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30">
        <div>
          <h1 className="font-display-xl text-[24px] font-black text-on-surface uppercase tracking-tight">
            Customer Records & CRM ({customers.length})
          </h1>
          <p className="font-body-md text-[13px] text-on-surface-variant">
            Riwayat transaksi pelanggan, analisis total pengeluaran, status member, dan catatan insiden.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Cari nama pelanggan atau nomor WhatsApp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-[14px] text-on-surface focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="font-category-label font-bold text-[12px] uppercase text-outline flex-shrink-0">
            Urutkan:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "spend" | "orders" | "recent")}
            className="p-2 bg-surface-container-lowest border border-outline-variant/40 rounded-xl font-category-label font-bold text-[13px] text-on-surface"
          >
            <option value="spend">Pengeluaran Tertinggi</option>
            <option value="orders">Jumlah Transaksi Sewa</option>
            <option value="recent">Aktivitas Terakhir</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 text-outline font-category-label text-[11px] uppercase tracking-wider bg-surface-container-low/40">
                <th className="py-3.5 px-6">Nama Pelanggan</th>
                <th className="py-3.5 px-6">Kontak</th>
                <th className="py-3.5 px-6">Status Member</th>
                <th className="py-3.5 px-6">Total Sewa</th>
                <th className="py-3.5 px-6">Total Pengeluaran</th>
                <th className="py-3.5 px-6">Catatan Insiden</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 font-body-md text-[14px]">
              {filteredCustomers.map((cust) => (
                <tr
                  key={cust.id}
                  onClick={() => setSelectedCustomer(cust)}
                  className="hover:bg-surface-container-low/50 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-6">
                    <div className="font-category-label font-bold text-on-surface text-[15px]">
                      {cust.name}
                    </div>
                    {cust.memberSince && (
                      <div className="font-price-chip text-[11px] text-outline">
                        Member sejak {formatDate(cust.memberSince)}
                      </div>
                    )}
                  </td>

                  <td className="py-4 px-6">
                    <div className="font-price-chip text-[13px] text-on-surface font-bold">
                      {cust.phone}
                    </div>
                    {cust.email && (
                      <div className="font-body-md text-[12px] text-on-surface-variant">
                        {cust.email}
                      </div>
                    )}
                  </td>

                  <td className="py-4 px-6">
                    {cust.isMember ? (
                      <span className="px-2.5 py-0.5 rounded-full font-category-label font-bold text-[11px] uppercase bg-primary/10 text-primary border border-primary/20">
                        ★ Member (Diskon 10%)
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full font-category-label font-bold text-[11px] uppercase bg-surface-container text-outline border border-outline-variant/30">
                        Pelanggan Umum
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6 font-price-chip font-bold text-on-surface">
                    {cust.totalOrders} kali
                  </td>

                  <td className="py-4 px-6 font-price-chip text-primary font-bold text-[15px]">
                    {formatCurrency(cust.totalSpend)}
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1">
                      {cust.flags && cust.flags.length > 0 ? (
                        cust.flags.map((flag, i) => <StatusBadge key={i} flag={flag} />)
                      ) : (
                        <span className="text-outline text-[12px] italic">Rekam Rekomendasi Baik</span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCustomer(cust);
                      }}
                      className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-category-label text-[12px] font-bold uppercase rounded-lg border border-outline-variant/30"
                    >
                      Riwayat Sewa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail & Order History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl max-w-3xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
              <div>
                <h3 className="font-display-xl text-[22px] font-black text-on-surface uppercase">
                  {selectedCustomer.name}
                </h3>
                <div className="font-price-chip text-[13px] text-primary font-bold">
                  {selectedCustomer.phone} • Total Akumulasi: {formatCurrency(selectedCustomer.totalSpend)}
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* History Table */}
            <div className="space-y-3">
              <h4 className="font-category-label font-bold text-[13px] uppercase text-outline">
                Log Riwayat Pesanan Sewa ({customerOrders.length})
              </h4>

              {customerOrders.length === 0 ? (
                <div className="text-center py-8 text-outline italic text-[14px]">
                  Belum ada catatan transaksi sewa untuk pelanggan ini.
                </div>
              ) : (
                <div className="border border-outline-variant/30 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-[13px]">
                    <thead>
                      <tr className="bg-surface-container-low font-category-label uppercase text-[11px] text-outline border-b border-outline-variant/30">
                        <th className="p-3">ID Pesanan</th>
                        <th className="p-3">Unit Disewa</th>
                        <th className="p-3">Tgl Ambil</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Total Biaya</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {customerOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="p-3 font-price-chip font-bold text-on-surface">
                            {order.id}
                          </td>
                          <td className="p-3 font-category-label font-bold text-on-surface">
                            {order.items.map((i) => i.name).join(", ")}
                          </td>
                          <td className="p-3 font-price-chip">{formatDate(order.startAt)}</td>
                          <td className="p-3">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="p-3 text-right font-price-chip font-bold text-primary">
                            {formatCurrency(order.totalPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-outline-variant/20">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 bg-surface-container text-on-surface font-category-label font-bold uppercase rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
