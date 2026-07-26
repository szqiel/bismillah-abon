"use client";

import { useState, useMemo } from "react";
import { useAdminStore } from "@/lib/adminStore";
import { Order, OrderStatus, PaymentStatus } from "@/lib/adminTypes";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatCurrency, formatDateTime, formatDate } from "@/lib/formatters";

type ActiveTab = "all" | "pending" | "confirmed" | "out" | "returned" | "overdue";

export default function OrdersPage() {
  const {
    orders,
    inventory,
    customers,
    updateOrderStatus,
    updateOrderPaymentStatus,
    updateOrderNotes,
    addOrder,
    checkDateConflict,
  } = useAdminStore();

  // Active Tab View State
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Selected Order Drawer State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // New Order Modal State
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [newCustomerId, setNewCustomerId] = useState(customers[0]?.id || "");
  const [selectedItemId, setSelectedItemId] = useState(inventory[0]?.id || "");
  const [itemDuration, setItemDuration] = useState<"12h" | "24h">("24h");
  const [itemQty, setItemQty] = useState(1);

  const [orderItemsList, setOrderItemsList] = useState<
    { gearItemId: string; name: string; duration: "12h" | "24h"; unitPrice: number; quantity: number }[]
  >([]);

  const [startAtDate, setStartAtDate] = useState("2026-07-27T09:00");
  const [dueAtDate, setDueAtDate] = useState("2026-07-28T09:00");
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [memberDiscount, setMemberDiscount] = useState(false);
  const [depositAmount, setDepositAmount] = useState(100000);
  const [notes, setNotes] = useState("");

  // Tab Badge Counts
  const counts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      out: orders.filter((o) => o.status === "out").length,
      returned: orders.filter((o) => o.status === "returned").length,
      overdue: orders.filter((o) => o.status === "out" && new Date(o.dueAt) < new Date()).length,
    };
  }, [orders]);

  // Filtered Orders List according to Active Tab & Search Query
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Search match
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerPhone.includes(searchQuery);

      if (!matchesSearch) return false;

      // Tab match
      if (activeTab === "all") return true;
      if (activeTab === "overdue") {
        return order.status === "out" && new Date(order.dueAt) < new Date();
      }
      return order.status === activeTab;
    });
  }, [orders, activeTab, searchQuery]);

  // Conflict Warning State for New Order
  const conflictWarning = useMemo(() => {
    if (!startAtDate || !dueAtDate || orderItemsList.length === 0) return false;
    return orderItemsList.some((item) =>
      checkDateConflict(item.gearItemId, new Date(startAtDate).toISOString(), new Date(dueAtDate).toISOString())
    );
  }, [orderItemsList, startAtDate, dueAtDate, checkDateConflict]);

  const handleAddItemToOrder = () => {
    const gear = inventory.find((i) => i.id === selectedItemId);
    if (!gear) return;

    const unitPrice = itemDuration === "12h" ? gear.price12h : gear.price24h;
    setOrderItemsList((prev) => [
      ...prev,
      {
        gearItemId: gear.id,
        name: gear.name,
        duration: itemDuration,
        unitPrice,
        quantity: itemQty,
      },
    ]);
  };

  const handleRemoveItemFromOrder = (index: number) => {
    setOrderItemsList((prev) => prev.filter((_, i) => i !== index));
  };

  const calculatedTotal = useMemo(() => {
    const subtotal = orderItemsList.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    if (memberDiscount) return Math.round(subtotal * 0.9);
    return subtotal;
  }, [orderItemsList, memberDiscount]);

  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderItemsList.length === 0) {
      alert("Silakan pilih minimal satu unit peralatan untuk pesanan.");
      return;
    }

    const customer = customers.find((c) => c.id === newCustomerId);
    if (!customer) return;

    addOrder({
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      items: orderItemsList,
      startAt: new Date(startAtDate).toISOString(),
      dueAt: new Date(dueAtDate).toISOString(),
      status: "confirmed",
      deliveryMethod,
      deliveryAddress: deliveryMethod === "delivery" ? deliveryAddress : undefined,
      memberDiscount,
      deposit: Number(depositAmount),
      totalPrice: calculatedTotal,
      paymentStatus: "unpaid",
      notes,
    });

    setIsNewOrderModalOpen(false);
    setOrderItemsList([]);
  };

  const tabsConfig: { key: ActiveTab; label: string; count: number; icon: string; highlight?: boolean }[] = [
    { key: "all", label: "Semua Pesanan", count: counts.all, icon: "list_alt" },
    { key: "pending", label: "Pending", count: counts.pending, icon: "pending_actions" },
    { key: "confirmed", label: "Confirmed", count: counts.confirmed, icon: "task_alt" },
    { key: "out", label: "Rented (Out)", count: counts.out, icon: "key" },
    { key: "returned", label: "Returned", count: counts.returned, icon: "inventory" },
    ...(counts.overdue > 0
      ? [{ key: "overdue" as ActiveTab, label: "Overdue", count: counts.overdue, icon: "warning", highlight: true }]
      : []),
  ];

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30">
        <div>
          <h1 className="font-display-xl text-[24px] font-black text-on-surface uppercase tracking-tight">
            Orders & Rental Tracking ({orders.length})
          </h1>
          <p className="font-body-md text-[13px] text-on-surface-variant">
            Filter status pesanan, kelola pengambilan & pengembalian unit, dan atur status pembayaran.
          </p>
        </div>
        <button
          onClick={() => setIsNewOrderModalOpen(true)}
          className="bg-primary text-on-primary font-category-label text-[13px] font-bold uppercase px-5 py-2.5 rounded-full hover:bg-primary/90 transition-all flex items-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Create New Order</span>
        </button>
      </div>

      {/* Clean Status Tabs Navigation Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-surface-container-low p-2 rounded-2xl border border-outline-variant/30">
        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {tabsConfig.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-xl font-category-label text-[13px] font-bold uppercase flex items-center gap-2 transition-all whitespace-nowrap flex-shrink-0 ${
                  isActive
                    ? tab.highlight
                      ? "bg-red-600 text-white shadow-sm"
                      : "bg-primary text-on-primary shadow-sm"
                    : tab.highlight
                    ? "bg-red-500/10 text-red-600 hover:bg-red-500/20"
                    : "text-outline hover:text-on-surface hover:bg-surface-container-lowest"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                <span>{tab.label}</span>
                <span
                  className={`font-price-chip text-[11px] px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? "bg-black/20 text-white"
                      : "bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[220px]">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Cari ID / Pelanggan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-[13px] text-on-surface focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Spacious Single-View Orders Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-xs">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 text-outline font-body-md text-[14px]">
            Tidak ada transaksi sewa pada kategori status ini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 text-outline font-category-label text-[11px] uppercase tracking-wider bg-surface-container-low/40">
                  <th className="py-3.5 px-6">ID & Pelanggan</th>
                  <th className="py-3.5 px-6">Peralatan Disewa</th>
                  <th className="py-3.5 px-6">Jadwal Sewa (Ambil → Kembali)</th>
                  <th className="py-3.5 px-6">Status Sewa</th>
                  <th className="py-3.5 px-6">Pembayaran</th>
                  <th className="py-3.5 px-6">Total Biaya</th>
                  <th className="py-3.5 px-6 text-right">Ubah Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-body-md text-[14px]">
                {filteredOrders.map((order) => {
                  const isOverdue =
                    order.status === "out" && new Date(order.dueAt) < new Date();

                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`hover:bg-surface-container-low/50 transition-colors cursor-pointer ${
                        isOverdue ? "bg-red-500/5" : ""
                      }`}
                    >
                      {/* ID & Customer */}
                      <td className="py-4 px-6">
                        <div className="font-price-chip font-bold text-[14px] text-on-surface">
                          {order.id}
                        </div>
                        <div className="font-category-label font-bold text-primary text-[14px]">
                          {order.customerName}
                        </div>
                        <div className="font-price-chip text-[12px] text-on-surface-variant">
                          {order.customerPhone}
                        </div>
                      </td>

                      {/* Equipment Items */}
                      <td className="py-4 px-6 max-w-xs">
                        <div className="font-category-label font-bold text-[13px] text-on-surface leading-snug">
                          {order.items.map((i) => `${i.name} (x${i.quantity})`).join(", ")}
                        </div>
                        <div className="font-category-label text-[11px] uppercase text-outline mt-0.5">
                          Metode: {order.deliveryMethod === "delivery" ? "Kurir Antar" : "Ambil Studio"}
                        </div>
                      </td>

                      {/* Schedule */}
                      <td className="py-4 px-6 font-price-chip text-[13px]">
                        <div>Ambil: <span className="font-bold text-on-surface">{formatDate(order.startAt)}</span></div>
                        <div className={isOverdue ? "text-red-600 font-bold" : "text-on-surface-variant"}>
                          Kembali: <span className="font-bold">{formatDate(order.dueAt)}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        {isOverdue ? (
                          <StatusBadge status="overdue" />
                        ) : (
                          <StatusBadge status={order.status} />
                        )}
                      </td>

                      {/* Payment */}
                      <td className="py-4 px-6">
                        <StatusBadge paymentStatus={order.paymentStatus} />
                      </td>

                      {/* Total */}
                      <td className="py-4 px-6 font-price-chip font-bold text-primary text-[16px]">
                        {formatCurrency(order.totalPrice)}
                      </td>

                      {/* Quick Status Dropdown */}
                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value as OrderStatus)
                          }
                          className="p-2 bg-surface-container border border-outline-variant/40 rounded-xl font-category-label font-bold text-[12px] uppercase text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                        >
                          <option value="pending">Ubah: Pending</option>
                          <option value="confirmed">Ubah: Confirmed</option>
                          <option value="out">Ubah: Out (Disewa)</option>
                          <option value="returned">Ubah: Returned</option>
                          <option value="cancelled">Ubah: Dibatalkan</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="bg-surface-container-lowest w-full max-w-xl h-full p-6 space-y-6 overflow-y-auto border-l border-outline-variant/40 shadow-2xl">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
              <div>
                <span className="font-price-chip text-[12px] text-primary font-bold">
                  {selectedOrder.id}
                </span>
                <h3 className="font-display-xl text-[22px] font-black text-on-surface uppercase">
                  Rincian Transaksi Sewa
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-outline hover:text-on-surface p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Status Badges */}
            <div className="flex items-center gap-3">
              <StatusBadge status={selectedOrder.status} />
              <StatusBadge paymentStatus={selectedOrder.paymentStatus} />
            </div>

            {/* Customer Info */}
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 space-y-2">
              <div className="font-category-label font-bold text-[12px] uppercase text-outline">
                Informasi Pelanggan
              </div>
              <div className="font-category-label font-bold text-[16px] text-on-surface">
                {selectedOrder.customerName}
              </div>
              <div className="font-price-chip text-[13px] text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary">call</span>
                <a href={`https://wa.me/${selectedOrder.customerPhone}`} target="_blank" className="hover:underline text-primary font-bold">
                  {selectedOrder.customerPhone} (Chat WhatsApp)
                </a>
              </div>
            </div>

            {/* Rental Dates & Delivery */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30">
                <div className="font-category-label text-[11px] uppercase font-bold text-outline">
                  Waktu Ambil Alat
                </div>
                <div className="font-price-chip font-bold text-[13px] text-on-surface mt-1">
                  {formatDateTime(selectedOrder.startAt)}
                </div>
              </div>
              <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30">
                <div className="font-category-label text-[11px] uppercase font-bold text-outline">
                  Target Pengembalian
                </div>
                <div className="font-price-chip font-bold text-[13px] text-on-surface mt-1">
                  {formatDateTime(selectedOrder.dueAt)}
                </div>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="space-y-3">
              <div className="font-category-label font-bold text-[12px] uppercase text-outline">
                Rincian Unit Sewa
              </div>
              <div className="border border-outline-variant/30 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse text-[13px]">
                  <thead>
                    <tr className="bg-surface-container-low font-category-label uppercase text-[11px] text-outline border-b border-outline-variant/30">
                      <th className="p-2.5">Nama Unit</th>
                      <th className="p-2.5">Durasi</th>
                      <th className="p-2.5">Jumlah</th>
                      <th className="p-2.5 text-right">Biaya</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-category-label font-bold text-on-surface">
                          {item.name}
                        </td>
                        <td className="p-2.5 uppercase font-price-chip text-primary font-bold">
                          {item.duration}
                        </td>
                        <td className="p-2.5 font-price-chip font-bold">{item.quantity}</td>
                        <td className="p-2.5 text-right font-price-chip font-bold text-on-surface">
                          {formatCurrency(item.unitPrice * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment & Status Controls */}
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 space-y-3">
              <div className="flex items-center justify-between font-category-label font-bold text-[13px]">
                <span className="text-outline uppercase">Total Biaya Sewa:</span>
                <span className="font-price-chip text-[18px] text-primary">
                  {formatCurrency(selectedOrder.totalPrice)}
                </span>
              </div>
              <div className="flex items-center justify-between font-category-label text-[12px]">
                <span className="text-outline uppercase">Uang Muka / Jaminan DP:</span>
                <span className="font-price-chip font-bold text-on-surface">
                  {formatCurrency(selectedOrder.deposit)}
                </span>
              </div>

              <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between gap-4">
                <label className="font-category-label font-bold text-[12px] uppercase text-on-surface">
                  Status Pembayaran:
                </label>
                <select
                  value={selectedOrder.paymentStatus}
                  onChange={(e) => {
                    updateOrderPaymentStatus(selectedOrder.id, e.target.value as PaymentStatus);
                    setSelectedOrder({ ...selectedOrder, paymentStatus: e.target.value as PaymentStatus });
                  }}
                  className="p-2 bg-surface-container-lowest border border-outline-variant/40 rounded-lg font-category-label font-bold text-[12px] text-on-surface"
                >
                  <option value="unpaid">Belum Lunas (Unpaid)</option>
                  <option value="partial">DP / Bayar Sebagian</option>
                  <option value="paid">Lunas (Paid)</option>
                </select>
              </div>
            </div>

            {/* Staff Notes */}
            <div className="space-y-2">
              <label className="block font-category-label font-bold text-[12px] uppercase text-outline">
                Catatan Petugas / Log Unit
              </label>
              <textarea
                rows={3}
                value={selectedOrder.notes || ""}
                onChange={(e) => {
                  updateOrderNotes(selectedOrder.id, e.target.value);
                  setSelectedOrder({ ...selectedOrder, notes: e.target.value });
                }}
                placeholder="Tambah catatan seperti verifikasi KTP, kondisi fisik saat diambil..."
                className="w-full p-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-on-surface text-[13px]"
              />
            </div>
          </div>
        </div>
      )}

      {/* New Order Modal */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
              <h3 className="font-display-xl text-[20px] font-black text-on-surface uppercase">
                Buat Transaksi Sewa Baru
              </h3>
              <button
                onClick={() => setIsNewOrderModalOpen(false)}
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateOrderSubmit} className="space-y-5 font-body-md text-[14px]">
              {/* Conflict Warning Banner */}
              {conflictWarning && (
                <div className="bg-amber-500/10 border border-amber-500/40 p-3 rounded-xl flex items-center gap-3 text-amber-600 font-category-label text-[13px]">
                  <span className="material-symbols-outlined text-[24px]">warning</span>
                  <div>
                    <span className="font-bold uppercase">Peringatan Bentrok Jadwal:</span> Salah satu peralatan yang dipilih telah dipesan di rentang waktu ini oleh transaksi lain!
                  </div>
                </div>
              )}

              {/* Customer Selector */}
              <div>
                <label className="block font-category-label font-bold text-[12px] text-on-surface uppercase mb-1">
                  Pilih Pelanggan
                </label>
                <select
                  value={newCustomerId}
                  onChange={(e) => setNewCustomerId(e.target.value)}
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl font-category-label font-bold text-on-surface"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone}) {c.isMember ? "★ Member" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Item Picker */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 space-y-3">
                <label className="block font-category-label font-bold text-[12px] text-on-surface uppercase">
                  Pilih Alat Untuk Disewa
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <select
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    className="sm:col-span-2 p-2 bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-[13px] font-category-label font-bold text-on-surface"
                  >
                    {inventory.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name} ({formatCurrency(i.price24h)}/24h)
                      </option>
                    ))}
                  </select>

                  <select
                    value={itemDuration}
                    onChange={(e) => setItemDuration(e.target.value as "12h" | "24h")}
                    className="p-2 bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-[13px] font-category-label font-bold"
                  >
                    <option value="12h">12 Jam</option>
                    <option value="24h">24 Jam</option>
                  </select>

                  <input
                    type="number"
                    min={1}
                    value={itemQty}
                    onChange={(e) => setItemQty(Math.max(1, Number(e.target.value)))}
                    className="p-2 bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-[13px] font-price-chip font-bold text-center"
                    placeholder="Qty"
                  />

                  <button
                    type="button"
                    onClick={handleAddItemToOrder}
                    className="bg-primary text-on-primary font-category-label text-[12px] font-bold uppercase rounded-lg p-2"
                  >
                    Tambah Alat
                  </button>
                </div>

                {/* Added Items List */}
                {orderItemsList.length > 0 && (
                  <div className="pt-3 border-t border-outline-variant/30 space-y-2">
                    {orderItemsList.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/30 text-[13px]"
                      >
                        <div className="font-category-label font-bold text-on-surface">
                          {item.name}{" "}
                          <span className="text-primary font-price-chip uppercase text-[11px]">
                            ({item.duration}) x{item.quantity}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-price-chip font-bold text-primary">
                            {formatCurrency(item.unitPrice * item.quantity)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItemFromOrder(idx)}
                            className="text-outline hover:text-red-600"
                          >
                            <span className="material-symbols-outlined text-[16px]">close</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-category-label font-bold text-[12px] text-on-surface uppercase mb-1">
                    Tanggal & Jam Ambil
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={startAtDate}
                    onChange={(e) => setStartAtDate(e.target.value)}
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-on-surface font-price-chip text-[13px]"
                  />
                </div>
                <div>
                  <label className="block font-category-label font-bold text-[12px] text-on-surface uppercase mb-1">
                    Tanggal & Jam Kembali
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={dueAtDate}
                    onChange={(e) => setDueAtDate(e.target.value)}
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-on-surface font-price-chip text-[13px]"
                  />
                </div>
              </div>

              {/* Delivery & Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-category-label font-bold text-[12px] text-on-surface uppercase mb-1">
                    Metode Pengambilan
                  </label>
                  <select
                    value={deliveryMethod}
                    onChange={(e) => setDeliveryMethod(e.target.value as "pickup" | "delivery")}
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl font-category-label font-bold text-on-surface"
                  >
                    <option value="pickup">Ambil Di Studio</option>
                    <option value="delivery">Kurir Antar Lokasi</option>
                  </select>
                </div>
                <div>
                  <label className="block font-category-label font-bold text-[12px] text-on-surface uppercase mb-1">
                    Jumlah Jaminan DP (IDR)
                  </label>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl font-price-chip font-bold text-on-surface"
                  />
                </div>
              </div>

              {deliveryMethod === "delivery" && (
                <div>
                  <label className="block font-category-label font-bold text-[12px] text-on-surface uppercase mb-1">
                    Alamat Pengantaran
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Masukkan alamat pengantaran lengkap..."
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-on-surface text-[13px]"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="discCheck"
                  checked={memberDiscount}
                  onChange={(e) => setMemberDiscount(e.target.checked)}
                  className="accent-primary rounded w-4 h-4"
                />
                <label htmlFor="discCheck" className="font-category-label font-bold text-[13px] text-on-surface">
                  Terapkan Diskon Member 10%
                </label>
              </div>

              <div>
                <label className="block font-category-label font-bold text-[12px] uppercase text-outline mb-1">
                  Catatan Tambahan
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Instruksi khusus atau catatan untuk petugas..."
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-on-surface text-[13px]"
                />
              </div>

              {/* Total Calculation */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex items-center justify-between font-category-label font-bold">
                <span className="text-on-surface uppercase">Kalkulasi Total Biaya:</span>
                <span className="font-price-chip text-[20px] text-primary">
                  {formatCurrency(calculatedTotal)}
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="px-4 py-2.5 bg-surface-container text-on-surface font-category-label font-bold uppercase rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-on-primary font-category-label font-bold uppercase rounded-xl hover:bg-primary/90"
                >
                  Buat Pesanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
