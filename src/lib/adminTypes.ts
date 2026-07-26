export interface OrderItem {
  gearItemId: string;
  name: string; // snapshot at time of order
  duration: "12h" | "24h";
  unitPrice: number;
  quantity: number;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "out"
  | "returned"
  | "overdue"
  | "cancelled";

export type PaymentStatus = "unpaid" | "partial" | "paid";

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  startAt: string; // ISO datetime, pickup
  dueAt: string; // ISO datetime, expected return
  status: OrderStatus;
  deliveryMethod: "pickup" | "delivery";
  deliveryAddress?: string;
  memberDiscount: boolean;
  deposit: number;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
}

export type CustomerFlag = "late-return" | "damage-incident" | "vip";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  isMember: boolean;
  memberSince?: string;
  totalOrders: number;
  totalSpend: number;
  lastOrderAt?: string;
  flags?: CustomerFlag[];
}

export interface BundleComposition {
  bundleId: string;
  componentGearIds: string[];
}

export interface ConflictDetail {
  gearItemId: string;
  gearName: string;
  conflictingOrderId: string;
  conflictingOrderRange: { startAt: string; dueAt: string };
}

export const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["out", "cancelled"],
  out: ["returned"],
  returned: [],
  cancelled: [],
  overdue: ["returned"],
};
