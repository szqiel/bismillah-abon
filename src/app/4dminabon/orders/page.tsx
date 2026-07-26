"use client";

import { useState, useMemo } from "react";
import { useAdminStore } from "@/lib/adminStore";
import { Order, OrderStatus, VALID_TRANSITIONS } from "@/lib/adminTypes";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatCurrency, formatDateTime, formatDate } from "@/lib/formatters";

type ActiveTab = "all" | "pending" | "confirmed" | "out" | "returned" | "overdue";
type QuickFilter = "all" | "pickup_today" | "due_today" | "unpaid";

export default function OrdersPage() {
  const {
    orders,
    inventory,
    customers,
    updateOrderStatus,
    updateOrderPaymentStatus,
    updateOrderNotes,
    addOrder,
    getConflictDetails,
  } = useAdminStore();

  // Navigation & Filter States
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Sorting & Bulk Selection States
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkActionToast, setBulkActionToast] = useState<string | null>(null);

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

  // Simulated current reference date for "Today" (July 26, 2026)
  const todayDateStr = "2026-07-26";

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

  // Overdue Orders Details List
  const overdueOrdersList = useMemo(() => {
    return orders.filter((o) => o.status === "out" && new Date(o.dueAt) < new Date());
  }, [orders]);

  // Today Summary Metrics
  const todayMetrics = useMemo(() => {
    const pickupToday = orders.filter(
      (o) => o.status !== "cancelled" && o.startAt.startsWith(todayDateStr)
    ).length;

    const returnDueToday = orders.filter(
      (o) => o.status !== "cancelled" && o.dueAt.startsWith(todayDateStr)
    ).length;

    const unpaidBalanceSum = orders
      .filter((o) => o.status !== "cancelled" && o.paymentStatus !== "paid")
      .reduce((sum, o) => {
        const paid = o.paymentStatus === "partial" ? o.deposit : 0;
        return sum + (o.totalPrice - paid);
      }, 0);

    return {
      pickupToday,
      returnDueToday,
      overdueCount: counts.overdue,
      unpaidBalanceSum,
    };
  }, [orders, counts.overdue]);

  // Filtered & Sorted Orders List
  const filteredOrders = useMemo(() => {
    const result = orders.filter((order) => {
      // Search match
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerPhone.includes(searchQuery);

      if (!matchesSearch) return false;

      // Active Tab Match
      if (activeTab === "overdue") {
        if (!(order.status === "out" && new Date(order.dueAt) < new Date())) return false;
      } else if (activeTab !== "all") {
        if (order.status !== activeTab) return false;
      }

      // Quick Filter Match
      if (quickFilter === "pickup_today") {
        return order.startAt.startsWith(todayDateStr);
      }
      if (quickFilter === "due_today") {
        return order.dueAt.startsWith(todayDateStr);
      }
      if (quickFilter === "unpaid") {
        return order.paymentStatus !== "paid";
      }

      return true;
    });

    // Sort by Due Date
    result.sort((a, b) => {
      const timeA = new Date(a.dueAt).getTime();
      const timeB = new Date(b.dueAt).getTime();
      return sortDirection === "asc" ? timeA - timeB : timeB - timeA;
    });

    return result;
  }, [orders, activeTab, quickFilter, searchQuery, sortDirection]);

  // Specific Conflict Details for New Order Modal
  const activeConflicts = useMemo(() => {
    if (!startAtDate || !dueAtDate || orderItemsList.length === 0) return [];

    const startISO = new Date(startAtDate).toISOString();
    const dueISO = new Date(dueAtDate).toISOString();

    const allConflicts = orderItemsList.flatMap((item) =>
      getConflictDetails(item.gearItemId, startISO, dueISO)
    );

    return allConflicts;
  }, [orderItemsList, startAtDate, dueAtDate, getConflictDetails]);

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

  // Bulk Actions Handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredOrders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredOrders.map((o) => o.id));
    }
  };

  const toggleSelectId = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkTransition = (targetStatus: OrderStatus) => {
    let successCount = 0;
    selectedIds.forEach((id) => {
      const targetOrder = orders.find((o) => o.id === id);
      if (!targetOrder) return;

      const allowedNext = VALID_TRANSITIONS[targetOrder.status] || [];
      if (allowedNext.includes(targetStatus)) {
        updateOrderStatus(id, targetStatus);
        successCount++;
      }
    });

    setBulkActionToast(
      `${successCount} dari ${selectedIds.length} pesanan berhasil diubah ke ${targetStatus.toUpperCase()}`
    );
    setSelectedIds([]);
    setTimeout(() => setBulkActionToast(null), 4000);
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
      {/* 1. OVERDUE ALERT STRIP (PERMAMENT PROACTIVE NUDGE AT TOP) */}
      {counts.overdue > 0 && (
        <div
          onClick={() => {
            setActiveTab("overdue");
            setQuickFilter("all");
          }}
          className="bg-red-500/10 border-2 border-red-500/40 p-4 rounded-2xl flex items-center justify-between text-red-600 cursor-pointer hover:bg-red-500/15 transition-all shadow-xs"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[28px] animate-pulse text-red-600">
              warning
            </span>
            <div>
              <div className="font-category-label font-bold text-[14px] uppercase tracking-wide">
                ⚠ {counts.overdue} Unit Melewati Batas Waktu Pengembalian
              </div>
              <div className="font-body-md text-[13px] text-red-600/90 font-medium">
                {overdueOrdersList.slice(0, 2).map((o) => (
                  <span key={o.id} className="mr-3">
                    • <strong className="font-bold">{o.items[0]?.name || "Gear"}</strong> terlambat kembali (
                    {o.customerName}, <span className="font-price-chip font-bold">{o.id}</span>)
                  </span>
                ))}
                {overdueOrdersList.length > 2 && (
                  <span className="font-bold text-red-700 underline">
                    +{overdueOrdersList.length - 2} lainnya
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 font-category-label text-[12px] font-bold uppercase bg-red-600 text-white px-3.5 py-1.5 rounded-xl shadow-xs">
            <span>Buka Overdue</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </div>
        </div>
      )}

      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30">
        <div>
          <h1 className="font-display-xl text-[24px] font-black text-on-surface uppercase tracking-tight">
            Orders & Rental Tracking ({orders.length})
          </h1>
          <p className="font-body-md text-[13px] text-on-surface-variant">
            Pantau siklus sewa, alur pengembalian alat, deteksi jadwal bentrok, dan kelola pembayaran.
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

      {/* 2. TODAY-AT-A-GLANCE SUMMARY ROW (3-4 COMPACT STAT CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pickup Today */}
        <div
          onClick={() => setQuickFilter(quickFilter === "pickup_today" ? "all" : "pickup_today")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            quickFilter === "pickup_today"
              ? "bg-primary/10 border-primary shadow-xs"
              : "bg-surface-container-lowest border-outline-variant/30 hover:border-outline-variant"
          }`}
        >
          <div className="flex items-center justify-between text-outline mb-2">
            <span className="font-category-label text-[11px] font-bold uppercase tracking-wider">
              Pickup Today
            </span>
            <span className="material-symbols-outlined text-[20px] text-primary">local_shipping</span>
          </div>
          <div className="font-price-chip text-[26px] font-black text-on-surface">
            {todayMetrics.pickupToday}
          </div>
        </div>

        {/* Return Due Today */}
        <div
          onClick={() => setQuickFilter(quickFilter === "due_today" ? "all" : "due_today")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            quickFilter === "due_today"
              ? "bg-primary/10 border-primary shadow-xs"
              : "bg-surface-container-lowest border-outline-variant/30 hover:border-outline-variant"
          }`}
        >
          <div className="flex items-center justify-between text-outline mb-2">
            <span className="font-category-label text-[11px] font-bold uppercase tracking-wider">
              Return Due Today
            </span>
            <span className="material-symbols-outlined text-[20px] text-blue-500">event_available</span>
          </div>
          <div className="font-price-chip text-[26px] font-black text-on-surface">
            {todayMetrics.returnDueToday}
          </div>
        </div>

        {/* Overdue */}
        <div
          onClick={() => {
            setActiveTab("overdue");
            setQuickFilter("all");
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            activeTab === "overdue"
              ? "bg-red-500/10 border-red-500 shadow-xs"
              : "bg-surface-container-lowest border-outline-variant/30 hover:border-red-500/40"
          }`}
        >
          <div className="flex items-center justify-between text-outline mb-2">
            <span className="font-category-label text-[11px] font-bold uppercase tracking-wider">
              Overdue
            </span>
            <span className="material-symbols-outlined text-[20px] text-red-500 animate-pulse">
              warning
            </span>
          </div>
          <div className="font-price-chip text-[26px] font-black text-red-600">
            {todayMetrics.overdueCount}
          </div>
        </div>

        {/* Unpaid Balance */}
        <div
          onClick={() => setQuickFilter(quickFilter === "unpaid" ? "all" : "unpaid")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            quickFilter === "unpaid"
              ? "bg-amber-500/10 border-amber-500 shadow-xs"
              : "bg-surface-container-lowest border-outline-variant/30 hover:border-outline-variant"
          }`}
        >
          <div className="flex items-center justify-between text-outline mb-2">
            <span className="font-category-label text-[11px] font-bold uppercase tracking-wider">
              Unpaid Balance
            </span>
            <span className="material-symbols-outlined text-[20px] text-amber-500">payments</span>
          </div>
          <div className="font-price-chip text-[20px] font-black text-amber-600 truncate">
            {formatCurrency(todayMetrics.unpaidBalanceSum)}
          </div>
        </div>
      </div>

      {/* 7. FLOATING CONTEXTUAL BULK ACTION BAR */}
      {selectedIds.length > 0 && (
        <div className="bg-primary/10 border border-primary/30 p-3 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="font-category-label font-bold text-[13px] text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">check_box</span>
            <span>{selectedIds.length} pesanan dipilih</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleBulkTransition("confirmed")}
              className="bg-blue-600 text-white font-category-label text-[12px] font-bold uppercase px-3.5 py-1.5 rounded-xl hover:bg-blue-700 transition-colors shadow-xs"
            >
              Konfirmasi Terpilih
            </button>
            <button
              onClick={() => handleBulkTransition("returned")}
              className="bg-primary text-on-primary font-category-label text-[12px] font-bold uppercase px-3.5 py-1.5 rounded-xl hover:bg-primary/90 transition-colors shadow-xs"
            >
              Tandai Pengembalian
            </button>
            <button
              onClick={() => handleBulkTransition("cancelled")}
              className="bg-red-600 text-white font-category-label text-[12px] font-bold uppercase px-3.5 py-1.5 rounded-xl hover:bg-red-700 transition-colors shadow-xs"
            >
              Batalkan Terpilih
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="bg-surface-container text-on-surface font-category-label text-[12px] font-bold uppercase px-3 py-1.5 rounded-xl border border-outline-variant/30"
            >
              Batal Pilih
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {bulkActionToast && (
        <div className="bg-primary text-on-primary p-3 rounded-xl font-category-label font-bold text-[13px] text-center shadow-lg animate-in fade-in">
          {bulkActionToast}
        </div>
      )}

      {/* Clean Status Tabs Navigation Bar & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-surface-container-low p-2 rounded-2xl border border-outline-variant/30">
        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {tabsConfig.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setQuickFilter("all");
                }}
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

      {/* 3, 4, 6 & 7. REFINED ORDERS TABLE */}
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
                  <th className="py-3.5 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length === filteredOrders.length && filteredOrders.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="accent-primary rounded"
                    />
                  </th>
                  <th className="py-3.5 px-4">ID & Pelanggan</th>
                  <th className="py-3.5 px-4">Peralatan Disewa</th>

                  {/* 7. Clickable Sortable Due Date Column Header */}
                  <th
                    onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                    className="py-3.5 px-4 cursor-pointer hover:text-on-surface transition-colors select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>Jadwal Sewa</span>
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        {sortDirection === "asc" ? "arrow_upward" : "arrow_downward"}
                      </span>
                    </div>
                  </th>

                  {/* 3. Interactive Status Badges (No duplicate dropdown column!) */}
                  <th className="py-3.5 px-4">Status Sewa</th>
                  <th className="py-3.5 px-4">Status Bayar</th>
                  <th className="py-3.5 px-4">Total Biaya</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-body-md text-[14px]">
                {filteredOrders.map((order) => {
                  const isOverdue =
                    order.status === "out" && new Date(order.dueAt) < new Date();
                  const isSelected = selectedIds.includes(order.id);

                  // 6. Truncate Equipment Items (Max 2 item names + +N lainnya)
                  const displayItems = order.items.slice(0, 2);
                  const remainingCount = order.items.length - 2;

                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`hover:bg-surface-container-low/50 transition-colors cursor-pointer h-16 ${
                        isOverdue ? "bg-red-500/5" : ""
                      } ${isSelected ? "bg-primary/5" : ""}`}
                    >
                      {/* Row Checkbox */}
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectId(order.id)}
                          className="accent-primary rounded"
                        />
                      </td>

                      {/* ID & Customer */}
                      <td className="py-3 px-4">
                        <div className="font-price-chip font-bold text-[13px] text-on-surface">
                          {order.id}
                        </div>
                        <div className="font-category-label font-bold text-primary text-[14px] truncate max-w-[160px]">
                          {order.customerName}
                        </div>
                      </td>

                      {/* 6. Equipment Items with Truncation */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-category-label font-bold text-[13px] text-on-surface truncate flex items-center gap-1.5">
                          <span>
                            {displayItems.map((i) => `${i.name} (x${i.quantity})`).join(", ")}
                          </span>
                          {remainingCount > 0 && (
                            <span className="px-1.5 py-0.5 bg-surface-container text-outline border border-outline-variant/30 rounded text-[10px] font-category-label font-bold flex-shrink-0">
                              +{remainingCount} lainnya
                            </span>
                          )}
                        </div>
                        <div className="font-category-label text-[11px] uppercase text-outline mt-0.5">
                          {order.deliveryMethod === "delivery" ? "Kurir Antar" : "Ambil Studio"}
                        </div>
                      </td>

                      {/* Schedule (Due Date) */}
                      <td className="py-3 px-4 font-price-chip text-[12px]">
                        <div>Ambil: {formatDate(order.startAt)}</div>
                        <div className={isOverdue ? "text-red-600 font-bold" : "text-on-surface font-bold"}>
                          Kembali: {formatDate(order.dueAt)}
                        </div>
                      </td>

                      {/* 3 & 4. Interactive Status Badge (State Machine constrained) */}
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <StatusBadge
                          status={isOverdue ? "overdue" : order.status}
                          onStatusChange={(newStatus) => updateOrderStatus(order.id, newStatus)}
                        />
                      </td>

                      {/* Interactive Payment Badge */}
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <StatusBadge
                          paymentStatus={order.paymentStatus}
                          onPaymentStatusChange={(newPaymentStatus) =>
                            updateOrderPaymentStatus(order.id, newPaymentStatus)
                          }
                        />
                      </td>

                      {/* Total Price */}
                      <td className="py-3 px-4 font-price-chip font-bold text-primary text-[15px]">
                        {formatCurrency(order.totalPrice)}
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
              <StatusBadge
                status={selectedOrder.status}
                onStatusChange={(newStatus) => {
                  updateOrderStatus(selectedOrder.id, newStatus);
                  setSelectedOrder({ ...selectedOrder, status: newStatus });
                }}
              />
              <StatusBadge
                paymentStatus={selectedOrder.paymentStatus}
                onPaymentStatusChange={(newPayment) => {
                  updateOrderPaymentStatus(selectedOrder.id, newPayment);
                  setSelectedOrder({ ...selectedOrder, paymentStatus: newPayment });
                }}
              />
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
                <a
                  href={`https://wa.me/${selectedOrder.customerPhone}`}
                  target="_blank"
                  className="hover:underline text-primary font-bold"
                >
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

            {/* Full Order Items List (Drawer shows 100% of items) */}
            <div className="space-y-3">
              <div className="font-category-label font-bold text-[12px] uppercase text-outline">
                Rincian Lengkap Unit Sewa ({selectedOrder.items.length})
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

            {/* Payment Summary */}
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 space-y-2">
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

      {/* 5. NEW ORDER MODAL WITH GRANULAR CONFLICT MESSAGING */}
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
              {/* 5. SPECIFIC CONFLICT MESSAGING BANNER */}
              {activeConflicts.length > 0 && (
                <div className="bg-amber-500/10 border-2 border-amber-500/40 p-4 rounded-xl space-y-2 text-amber-600 font-category-label text-[13px]">
                  <div className="flex items-center gap-2 font-bold uppercase text-[14px]">
                    <span className="material-symbols-outlined text-[24px]">warning</span>
                    <span>Peringatan Bentrok Jadwal Sewa ({activeConflicts.length})</span>
                  </div>
                  <div className="space-y-1 pl-8">
                    {activeConflicts.map((conf, idx) => (
                      <div key={idx} className="font-body-md text-[13px] text-amber-700">
                        • <strong className="font-bold">{conf.gearName}</strong> telah dipesan oleh{" "}
                        <span className="font-price-chip font-bold">{conf.conflictingOrderId}</span> pada rentang waktu (
                        {formatDate(conf.conflictingOrderRange.startAt)} – {formatDate(conf.conflictingOrderRange.dueAt)}).
                      </div>
                    ))}
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
