"use client";

import { useState, useRef, useEffect } from "react";
import { OrderStatus, PaymentStatus, CustomerFlag, VALID_TRANSITIONS } from "@/lib/adminTypes";

interface StatusBadgeProps {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  flag?: CustomerFlag;
  className?: string;
  onStatusChange?: (newStatus: OrderStatus) => void;
  onPaymentStatusChange?: (newStatus: PaymentStatus) => void;
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirm",
  out: "Mark Out (Rented)",
  returned: "Mark Returned",
  overdue: "Overdue",
  cancelled: "Cancel Order",
};

const PAYMENT_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  unpaid: ["partial", "paid"],
  partial: ["paid"],
  paid: ["unpaid"],
};

const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  unpaid: "Belum Lunas (Unpaid)",
  partial: "Bayar Sebagian (Partial)",
  paid: "Lunas (Paid)",
};

export function StatusBadge({
  status,
  paymentStatus,
  flag,
  className = "",
  onStatusChange,
  onPaymentStatusChange,
}: StatusBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status) {
    const validNextStates = VALID_TRANSITIONS[status] || [];
    const isInteractive = Boolean(onStatusChange && validNextStates.length > 0);

    const renderPillContent = () => {
      switch (status) {
        case "pending":
          return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-category-label font-bold uppercase bg-amber-500/10 text-amber-600 border border-amber-500/20 ${className}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              Pending
              {isInteractive && <span className="material-symbols-outlined text-[14px]">expand_more</span>}
            </span>
          );
        case "confirmed":
          return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-category-label font-bold uppercase bg-blue-500/10 text-blue-600 border border-blue-500/20 ${className}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Confirmed
              {isInteractive && <span className="material-symbols-outlined text-[14px]">expand_more</span>}
            </span>
          );
        case "out":
          return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-category-label font-bold uppercase bg-primary/10 text-primary border border-primary/20 ${className}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              Out (Rented)
              {isInteractive && <span className="material-symbols-outlined text-[14px]">expand_more</span>}
            </span>
          );
        case "returned":
          return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-category-label font-bold uppercase bg-surface-container-highest text-on-surface-variant border border-outline-variant/40 ${className}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant"></span>
              Returned
            </span>
          );
        case "overdue":
          return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-category-label font-bold uppercase bg-red-500/15 text-red-600 border border-red-500/30 animate-pulse ${className}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
              Overdue
              {isInteractive && <span className="material-symbols-outlined text-[14px]">expand_more</span>}
            </span>
          );
        case "cancelled":
          return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-category-label font-bold uppercase bg-surface-container text-outline border border-outline-variant/30 ${className}`}>
              Cancelled
            </span>
          );
      }
    };

    if (!isInteractive) {
      return renderPillContent();
    }

    return (
      <div className="relative inline-block" ref={dropdownRef}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="focus:outline-none cursor-pointer group"
        >
          {renderPillContent()}
        </button>

        {isOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 mt-1 z-50 min-w-[150px] bg-surface-container-lowest border border-outline-variant/40 rounded-xl shadow-xl p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-100"
          >
            <div className="px-2 py-1 text-[10px] font-category-label font-bold uppercase text-outline">
              Ubah Status Ke:
            </div>
            {validNextStates.map((nextState) => (
              <button
                key={nextState}
                type="button"
                onClick={() => {
                  onStatusChange?.(nextState);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[12px] font-category-label font-bold uppercase transition-colors flex items-center justify-between ${
                  nextState === "cancelled"
                    ? "hover:bg-red-500/10 text-red-600"
                    : "hover:bg-primary/10 text-primary"
                }`}
              >
                <span>{STATUS_LABELS[nextState]}</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (paymentStatus) {
    const validPaymentStates = PAYMENT_TRANSITIONS[paymentStatus] || [];
    const isInteractive = Boolean(onPaymentStatusChange && validPaymentStates.length > 0);

    const renderPaymentContent = () => {
      switch (paymentStatus) {
        case "paid":
          return (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-category-label font-bold uppercase bg-primary/15 text-primary border border-primary/25 ${className}`}>
              Paid
              {isInteractive && <span className="material-symbols-outlined text-[13px]">expand_more</span>}
            </span>
          );
        case "partial":
          return (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-category-label font-bold uppercase bg-amber-500/15 text-amber-600 border border-amber-500/25 ${className}`}>
              Partial
              {isInteractive && <span className="material-symbols-outlined text-[13px]">expand_more</span>}
            </span>
          );
        case "unpaid":
          return (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-category-label font-bold uppercase bg-red-500/15 text-red-600 border border-red-500/25 ${className}`}>
              Unpaid
              {isInteractive && <span className="material-symbols-outlined text-[13px]">expand_more</span>}
            </span>
          );
      }
    };

    if (!isInteractive) {
      return renderPaymentContent();
    }

    return (
      <div className="relative inline-block" ref={dropdownRef}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="focus:outline-none cursor-pointer"
        >
          {renderPaymentContent()}
        </button>

        {isOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 mt-1 z-50 min-w-[160px] bg-surface-container-lowest border border-outline-variant/40 rounded-xl shadow-xl p-1.5 space-y-1"
          >
            <div className="px-2 py-1 text-[10px] font-category-label font-bold uppercase text-outline">
              Ubah Status Pembayaran:
            </div>
            {validPaymentStates.map((nextState) => (
              <button
                key={nextState}
                type="button"
                onClick={() => {
                  onPaymentStatusChange?.(nextState);
                  setIsOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-[12px] font-category-label font-bold uppercase hover:bg-primary/10 text-primary transition-colors flex items-center justify-between"
              >
                <span>{PAYMENT_LABELS[nextState]}</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (flag) {
    switch (flag) {
      case "vip":
        return (
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-category-label font-bold uppercase bg-amber-500/15 text-amber-600 border border-amber-500/30 ${className}`}>
            ★ VIP
          </span>
        );
      case "late-return":
        return (
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-category-label font-bold uppercase bg-red-500/15 text-red-600 border border-red-500/30 ${className}`}>
            ⚠ Late Return
          </span>
        );
      case "damage-incident":
        return (
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-category-label font-bold uppercase bg-purple-500/15 text-purple-600 border border-purple-500/30 ${className}`}>
            ⚠ Incident
          </span>
        );
    }
  }

  return null;
}
