import { describe, it, expect, vi, beforeEach } from "vitest";
import { useProductsStore } from "./productsStore";
import * as productsApi from "../api/products";
import type {
  Product,
  CreateProductPayload,
  UpdateProductPayload,
} from "../types/product";

vi.mock("../api/products");

describe("productsStore", () => {
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "Product 1",
      description: "Description 1",
      price: 1000,
      currency: "VND",
      stock: 10,
      status: "ACTIVE",
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    },
    {
      id: "2",
      name: "Product 2",
      description: "Description 2",
      price: 2000,
      currency: "VND",
      stock: 20,
      status: "INACTIVE",
      created_at: "2026-01-02T00:00:00Z",
      updated_at: "2026-01-02T00:00:00Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useProductsStore.setState({
      items: [],
      loading: false,
      error: null,
    });
  });

  describe("fetchList", () => {
    it("should populate items and toggle loading", async () => {
      vi.mocked(productsApi.listProducts).mockResolvedValue(mockProducts);

      const store = useProductsStore.getState();
      expect(store.items).toEqual([]);
      expect(store.loading).toBe(false);

      await store.fetchList();

      expect(productsApi.listProducts).toHaveBeenCalledTimes(1);
      expect(useProductsStore.getState().items).toEqual(mockProducts);
      expect(useProductsStore.getState().loading).toBe(false);
      expect(useProductsStore.getState().error).toBe(null);
    });

    it("should set loading to true during fetch", async () => {
      let resolvePromise: (value: Product[]) => void;
      const promise = new Promise<Product[]>((resolve) => {
        resolvePromise = resolve;
      });
      vi.mocked(productsApi.listProducts).mockReturnValue(promise);

      const store = useProductsStore.getState();
      const fetchPromise = store.fetchList();

      expect(useProductsStore.getState().loading).toBe(true);

      resolvePromise!(mockProducts);
      await fetchPromise;

      expect(useProductsStore.getState().loading).toBe(false);
    });

    it("should handle errors and set error state", async () => {
      const errorMessage = "Network error";
      vi.mocked(productsApi.listProducts).mockRejectedValue(
        new Error(errorMessage)
      );

      const store = useProductsStore.getState();
      await store.fetchList();

      expect(useProductsStore.getState().loading).toBe(false);
      expect(useProductsStore.getState().error).toBe(errorMessage);
      expect(useProductsStore.getState().items).toEqual([]);
    });
  });

  describe("createOne", () => {
    it("should trigger API call then refresh list", async () => {
      const newProduct: Product = {
        id: "3",
        name: "New Product",
        description: "New Description",
        price: 3000,
        currency: "VND",
        stock: 30,
        status: "ACTIVE",
        created_at: "2026-01-03T00:00:00Z",
        updated_at: "2026-01-03T00:00:00Z",
      };

      const payload: CreateProductPayload = {
        name: "New Product",
        description: "New Description",
        price: 3000,
        currency: "VND",
        stock: 30,
        status: "ACTIVE",
      };

      vi.mocked(productsApi.createProduct).mockResolvedValue(newProduct);
      vi.mocked(productsApi.listProducts).mockResolvedValue([
        ...mockProducts,
        newProduct,
      ]);

      const store = useProductsStore.getState();
      await store.createOne(payload);

      expect(productsApi.createProduct).toHaveBeenCalledTimes(1);
      expect(productsApi.createProduct).toHaveBeenCalledWith(payload);
      expect(productsApi.listProducts).toHaveBeenCalledTimes(1);
      expect(useProductsStore.getState().items).toEqual([
        ...mockProducts,
        newProduct,
      ]);
      expect(useProductsStore.getState().loading).toBe(false);
      expect(useProductsStore.getState().error).toBe(null);
    });

    it("should handle errors and set error state", async () => {
      const payload: CreateProductPayload = {
        name: "New Product",
        description: "New Description",
        price: 3000,
        currency: "VND",
        stock: 30,
        status: "ACTIVE",
      };

      const errorMessage = "Failed to create product";
      vi.mocked(productsApi.createProduct).mockRejectedValue(
        new Error(errorMessage)
      );

      const store = useProductsStore.getState();
      await store.createOne(payload);

      expect(productsApi.createProduct).toHaveBeenCalledTimes(1);
      expect(productsApi.listProducts).not.toHaveBeenCalled();
      expect(useProductsStore.getState().loading).toBe(false);
      expect(useProductsStore.getState().error).toBe(errorMessage);
    });
  });

  describe("updateOne", () => {
    it("should trigger API call then refresh list", async () => {
      const updatedProduct: Product = {
        ...mockProducts[0],
        name: "Updated Product",
        updated_at: "2026-01-04T00:00:00Z",
      };

      const payload: UpdateProductPayload = {
        name: "Updated Product",
      };

      vi.mocked(productsApi.updateProduct).mockResolvedValue(updatedProduct);
      vi.mocked(productsApi.listProducts).mockResolvedValue([
        updatedProduct,
        mockProducts[1],
      ]);

      const store = useProductsStore.getState();
      await store.updateOne("1", payload);

      expect(productsApi.updateProduct).toHaveBeenCalledTimes(1);
      expect(productsApi.updateProduct).toHaveBeenCalledWith("1", payload);
      expect(productsApi.listProducts).toHaveBeenCalledTimes(1);
      expect(useProductsStore.getState().items).toEqual([
        updatedProduct,
        mockProducts[1],
      ]);
      expect(useProductsStore.getState().loading).toBe(false);
      expect(useProductsStore.getState().error).toBe(null);
    });

    it("should handle errors and set error state", async () => {
      const payload: UpdateProductPayload = {
        name: "Updated Product",
      };

      const errorMessage = "Failed to update product";
      vi.mocked(productsApi.updateProduct).mockRejectedValue(
        new Error(errorMessage)
      );

      const store = useProductsStore.getState();
      await store.updateOne("1", payload);

      expect(productsApi.updateProduct).toHaveBeenCalledTimes(1);
      expect(productsApi.listProducts).not.toHaveBeenCalled();
      expect(useProductsStore.getState().loading).toBe(false);
      expect(useProductsStore.getState().error).toBe(errorMessage);
    });
  });

  describe("deleteOne", () => {
    it("should trigger API call then refresh list", async () => {
      vi.mocked(productsApi.deleteProduct).mockResolvedValue(undefined);
      vi.mocked(productsApi.listProducts).mockResolvedValue([mockProducts[1]]);

      const store = useProductsStore.getState();
      await store.deleteOne("1");

      expect(productsApi.deleteProduct).toHaveBeenCalledTimes(1);
      expect(productsApi.deleteProduct).toHaveBeenCalledWith("1");
      expect(productsApi.listProducts).toHaveBeenCalledTimes(1);
      expect(useProductsStore.getState().items).toEqual([mockProducts[1]]);
      expect(useProductsStore.getState().loading).toBe(false);
      expect(useProductsStore.getState().error).toBe(null);
    });

    it("should handle errors and set error state", async () => {
      const errorMessage = "Failed to delete product";
      vi.mocked(productsApi.deleteProduct).mockRejectedValue(
        new Error(errorMessage)
      );

      const store = useProductsStore.getState();
      await store.deleteOne("1");

      expect(productsApi.deleteProduct).toHaveBeenCalledTimes(1);
      expect(productsApi.listProducts).not.toHaveBeenCalled();
      expect(useProductsStore.getState().loading).toBe(false);
      expect(useProductsStore.getState().error).toBe(errorMessage);
    });
  });
});
