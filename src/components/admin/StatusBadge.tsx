import { OrderStatus, PaymentStatus, CustomerFlag } from "@/lib/adminTypes";

interface StatusBadgeProps {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  flag?: CustomerFlag;
  className?: string;
}

export function StatusBadge({ status, paymentStatus, flag, className = "" }: StatusBadgeProps) {
  if (status) {
    switch (status) {
      case "pending":
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-category-label font-bold uppercase bg-amber-500/10 text-amber-600 border border-amber-500/20 ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Pending
          </span>
        );
      case "confirmed":
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-category-label font-bold uppercase bg-blue-500/10 text-blue-600 border border-blue-500/20 ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Confirmed
          </span>
        );
      case "out":
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-category-label font-bold uppercase bg-primary/10 text-primary border border-primary/20 ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            Out (Rented)
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
          </span>
        );
      case "cancelled":
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-category-label font-bold uppercase bg-surface-container text-outline border border-outline-variant/30 ${className}`}>
            Cancelled
          </span>
        );
    }
  }

  if (paymentStatus) {
    switch (paymentStatus) {
      case "paid":
        return (
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-category-label font-bold uppercase bg-primary/15 text-primary border border-primary/25 ${className}`}>
            Paid
          </span>
        );
      case "partial":
        return (
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-category-label font-bold uppercase bg-amber-500/15 text-amber-600 border border-amber-500/25 ${className}`}>
            Partial
          </span>
        );
      case "unpaid":
        return (
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-category-label font-bold uppercase bg-red-500/15 text-red-600 border border-red-500/25 ${className}`}>
            Unpaid
          </span>
        );
    }
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
