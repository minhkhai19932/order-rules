import { create } from "zustand";
import type {
  Order,
  CreateOrderPayload,
  UpdateOrderPayload,
} from "../types/order";
import * as ordersApi from "../api/orders";

/**
 * Orders store state.
 */
interface OrdersState {
  items: Order[];
  loading: boolean;
  error: string | null;
}

/**
 * Orders store actions.
 */
interface OrdersActions {
  fetchList: () => Promise<void>;
  createOne: (payload: CreateOrderPayload) => Promise<void>;
  updateOne: (id: string, payload: UpdateOrderPayload) => Promise<void>;
  cancelOrder: (orderCode: string) => Promise<void>;
  deleteOne: (orderCode: string) => Promise<void>;
  resetError: () => void;
}

/**
 * Orders store type combining state and actions.
 */
type OrdersStore = OrdersState & OrdersActions;

/**
 * Zustand store for orders management.
 * Manages order list state, loading, and error handling.
 * Provides CRUD actions that update state and refresh the list.
 */
export const useOrdersStore = create<OrdersStore>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetchList: async () => {
    set({ loading: true, error: null });
    try {
      const items = await ordersApi.listOrders();
      set({ items, loading: false, error: null });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch orders";
      set({ loading: false, error: errorMessage });
    }
  },

  createOne: async (payload: CreateOrderPayload) => {
    set({ loading: true, error: null });
    try {
      await ordersApi.createOrder(payload);
      // Refresh list after creation
      await get().fetchList();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create order";
      set({ loading: false, error: errorMessage });
    }
  },

  updateOne: async (id: string, payload: UpdateOrderPayload) => {
    set({ loading: true, error: null });
    try {
      await ordersApi.updateOrder(id, payload);
      // Refresh list after update
      await get().fetchList();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update order";
      set({ loading: false, error: errorMessage });
    }
  },

  cancelOrder: async (orderCode: string) => {
    set({ loading: true, error: null });
    try {
      await ordersApi.updateOrderByCode(orderCode, {
        orderStatus: "CANCELLED",
      });
      // Refresh list after cancellation
      await get().fetchList();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to cancel order";
      set({ loading: false, error: errorMessage });
      throw error; // Re-throw so UI can handle it
    }
  },

  deleteOne: async (orderCode: string) => {
    set({ loading: true, error: null });
    try {
      await ordersApi.deleteOrder(orderCode);
      // Refresh list after deletion
      await get().fetchList();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete order";
      set({ loading: false, error: errorMessage });
    }
  },

  resetError: () => {
    set({ error: null });
  },
}));
