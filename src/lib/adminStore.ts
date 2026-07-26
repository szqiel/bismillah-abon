import { create } from "zustand";
import { GearItem, inventory as initialInventory } from "./data";
import { Customer, Order, OrderStatus, PaymentStatus, ConflictDetail } from "./adminTypes";
import { initialCustomers, initialOrders } from "./adminData";

interface AdminStore {
  // Inventory State
  inventory: GearItem[];
  addGearItem: (item: Omit<GearItem, "id">) => void;
  updateGearItem: (id: string, item: Partial<GearItem>) => void;
  deleteGearItem: (id: string) => void;
  duplicateGearItem: (id: string) => void;
  bulkToggleAvailability: (ids: string[], available: boolean) => void;
  bulkDeleteGearItems: (ids: string[]) => void;

  // Orders State
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "createdAt">) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updateOrderPaymentStatus: (id: string, paymentStatus: PaymentStatus) => void;
  updateOrderNotes: (id: string, notes: string) => void;
  checkDateConflict: (
    gearItemId: string,
    startAt: string,
    dueAt: string,
    excludeOrderId?: string
  ) => boolean;
  getConflictDetails: (
    gearItemId: string,
    startAt: string,
    dueAt: string,
    excludeOrderId?: string
  ) => ConflictDetail[];

  // Customers State
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, "id" | "totalOrders" | "totalSpend">) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  inventory: initialInventory,
  orders: initialOrders,
  customers: initialCustomers,

  // --- INVENTORY ACTIONS ---
  addGearItem: (newItem) =>
    set((state) => {
      const id = `gear-${Date.now()}`;
      return { inventory: [{ ...newItem, id }, ...state.inventory] };
    }),

  updateGearItem: (id, updatedFields) =>
    set((state) => ({
      inventory: state.inventory.map((item) =>
        item.id === id ? { ...item, ...updatedFields } : item
      ),
    })),

  deleteGearItem: (id) =>
    set((state) => ({
      inventory: state.inventory.filter((item) => item.id !== id),
    })),

  duplicateGearItem: (id) =>
    set((state) => {
      const target = state.inventory.find((i) => i.id === id);
      if (!target) return state;
      const duplicated: GearItem = {
        ...target,
        id: `gear-${Date.now()}`,
        name: `${target.name} (Copy)`,
      };
      return { inventory: [duplicated, ...state.inventory] };
    }),

  bulkToggleAvailability: (ids, available) =>
    set((state) => ({
      inventory: state.inventory.map((item) =>
        ids.includes(item.id) ? { ...item, available } : item
      ),
    })),

  bulkDeleteGearItems: (ids) =>
    set((state) => ({
      inventory: state.inventory.filter((item) => !ids.includes(item.id)),
    })),

  // --- ORDERS ACTIONS ---
  addOrder: (newOrder) =>
    set((state) => {
      const id = `ORD-2026-${String(state.orders.length + 1).padStart(3, "0")}`;
      const createdAt = new Date().toISOString();
      const order: Order = { ...newOrder, id, createdAt };

      // Also update customer stats
      const updatedCustomers = state.customers.map((c) => {
        if (c.id === order.customerId) {
          return {
            ...c,
            totalOrders: c.totalOrders + 1,
            totalSpend: c.totalSpend + order.totalPrice,
            lastOrderAt: createdAt,
          };
        }
        return c;
      });

      return {
        orders: [order, ...state.orders],
        customers: updatedCustomers,
      };
    }),

  updateOrderStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === id ? { ...order, status } : order
      ),
    })),

  updateOrderPaymentStatus: (id, paymentStatus) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === id ? { ...order, paymentStatus } : order
      ),
    })),

  updateOrderNotes: (id, notes) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === id ? { ...order, notes } : order
      ),
    })),

  checkDateConflict: (gearItemId, startAt, dueAt, excludeOrderId) => {
    return get().getConflictDetails(gearItemId, startAt, dueAt, excludeOrderId).length > 0;
  },

  getConflictDetails: (gearItemId, startAt, dueAt, excludeOrderId) => {
    const { orders, inventory } = get();
    const newStart = new Date(startAt).getTime();
    const newDue = new Date(dueAt).getTime();

    if (isNaN(newStart) || isNaN(newDue)) return [];

    const gear = inventory.find((g) => g.id === gearItemId);
    const gearName = gear ? gear.name : gearItemId;

    const conflicts: ConflictDetail[] = [];

    orders.forEach((order) => {
      if (excludeOrderId && order.id === excludeOrderId) return;
      if (order.status === "cancelled" || order.status === "returned") return;

      const hasItem = order.items.some((i) => i.gearItemId === gearItemId);
      if (!hasItem) return;

      const orderStart = new Date(order.startAt).getTime();
      const orderDue = new Date(order.dueAt).getTime();

      if (newStart < orderDue && newDue > orderStart) {
        conflicts.push({
          gearItemId,
          gearName,
          conflictingOrderId: order.id,
          conflictingOrderRange: {
            startAt: order.startAt,
            dueAt: order.dueAt,
          },
        });
      }
    });

    return conflicts;
  },

  // --- CUSTOMERS ACTIONS ---
  addCustomer: (newCustomer) =>
    set((state) => {
      const id = `cust-${Date.now()}`;
      const customer: Customer = {
        ...newCustomer,
        id,
        totalOrders: 0,
        totalSpend: 0,
      };
      return { customers: [customer, ...state.customers] };
    }),

  updateCustomer: (id, updatedFields) =>
    set((state) => ({
      customers: state.customers.map((c) =>
        c.id === id ? { ...c, ...updatedFields } : c
      ),
    })),
}));
