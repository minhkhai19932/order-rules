/**
 * Products CRUD API module.
 */
import { request } from "./http";
import type {
  Product,
  CreateProductPayload,
  UpdateProductPayload,
} from "../types/product";

/**
 * Retrieves all products.
 *
 * @returns Promise resolving to array of products
 */
export async function listProducts(): Promise<Product[]> {
  return request<Product[]>("/products", {
    method: "GET",
  });
}

/**
 * Creates a new product.
 *
 * @param payload - Product creation payload
 * @returns Promise resolving to created product
 */
export async function createProduct(
  payload: CreateProductPayload
): Promise<Product> {
  return request<Product>("/products", {
    method: "POST",
    body: payload,
  });
}

/**
 * Updates an existing product.
 *
 * @param id - Product ID
 * @param payload - Product update payload
 * @returns Promise resolving to updated product
 */
export async function updateProduct(
  id: string,
  payload: UpdateProductPayload
): Promise<Product> {
  return request<Product>(`/products/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

/**
 * Deletes a product.
 *
 * @param id - Product ID
 * @returns Promise resolving when deletion is complete
 */
export async function deleteProduct(id: string): Promise<void> {
  return request<void>(`/products/${id}`, {
    method: "DELETE",
  });
}
