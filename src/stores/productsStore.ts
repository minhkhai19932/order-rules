import { create } from "zustand";
import type {
  Product,
  CreateProductPayload,
  UpdateProductPayload,
} from "../types/product";
import * as productsApi from "../api/products";

/**
 * Products store state.
 */
interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

/**
 * Products store actions.
 */
interface ProductsActions {
  fetchList: () => Promise<void>;
  createOne: (payload: CreateProductPayload) => Promise<void>;
  updateOne: (id: string, payload: UpdateProductPayload) => Promise<void>;
  deleteOne: (id: string) => Promise<void>;
  resetError: () => void;
}

/**
 * Products store type combining state and actions.
 */
type ProductsStore = ProductsState & ProductsActions;

/**
 * Zustand store for products management.
 * Manages product list state, loading, and error handling.
 * Provides CRUD actions that update state and refresh the list.
 */
export const useProductsStore = create<ProductsStore>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetchList: async () => {
    set({ loading: true, error: null });
    try {
      const items = await productsApi.listProducts();
      set({ items, loading: false, error: null });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch products";
      set({ loading: false, error: errorMessage });
    }
  },

  createOne: async (payload: CreateProductPayload) => {
    set({ loading: true, error: null });
    try {
      await productsApi.createProduct(payload);
      // Refresh list after creation
      await get().fetchList();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create product";
      set({ loading: false, error: errorMessage });
    }
  },

  updateOne: async (id: string, payload: UpdateProductPayload) => {
    set({ loading: true, error: null });
    try {
      await productsApi.updateProduct(id, payload);
      // Refresh list after update
      await get().fetchList();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update product";
      set({ loading: false, error: errorMessage });
    }
  },

  deleteOne: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await productsApi.deleteProduct(id);
      // Refresh list after deletion
      await get().fetchList();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete product";
      set({ loading: false, error: errorMessage });
    }
  },

  resetError: () => {
    set({ error: null });
  },
}));
