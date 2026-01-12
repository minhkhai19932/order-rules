/**
 * Product status values.
 */
export type ProductStatus = "ACTIVE" | "INACTIVE";

/**
 * Product currency values.
 */
export type ProductCurrency = "VND";

/**
 * Product entity representing a sellable item.
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: ProductCurrency;
  stock: number;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
}

/**
 * Payload for creating a new product.
 */
export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  currency: ProductCurrency;
  stock: number;
  status: ProductStatus;
}

/**
 * Payload for updating an existing product.
 */
export interface UpdateProductPayload {
  name?: string;
  description?: string;
  price?: number;
  currency?: ProductCurrency;
  stock?: number;
  status?: ProductStatus;
}
