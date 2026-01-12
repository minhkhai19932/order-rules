/**
 * Orders CRUD API module.
 */
import { request } from "./http";
import type {
  Order,
  CreateOrderPayload,
  UpdateOrderPayload,
} from "../types/order";

/**
 * Retrieves all orders.
 *
 * @returns Promise resolving to array of orders
 */
export async function listOrders(): Promise<Order[]> {
  return request<Order[]>("/orders", {
    method: "GET",
  });
}

/**
 * Creates a new order.
 *
 * @param payload - Order creation payload
 * @returns Promise resolving to created order
 */
export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  return request<Order>("/orders", {
    method: "POST",
    body: payload,
  });
}

/**
 * Updates an existing order by ID.
 *
 * @param id - Order ID
 * @param payload - Order update payload
 * @returns Promise resolving to updated order
 */
export async function updateOrder(
  id: string,
  payload: UpdateOrderPayload
): Promise<Order> {
  return request<Order>(`/orders/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

/**
 * Updates an existing order by orderCode.
 *
 * @param orderCode - Order code
 * @param payload - Order update payload
 * @returns Promise resolving to updated order
 */
export async function updateOrderByCode(
  orderCode: string,
  payload: UpdateOrderPayload
): Promise<Order> {
  return request<Order>(`/orders/by-code/${orderCode}`, {
    method: "PATCH",
    body: payload,
  });
}

/**
 * Deletes an order by orderCode.
 *
 * @param orderCode - Order code
 * @returns Promise resolving when deletion is complete
 */
export async function deleteOrder(orderCode: string): Promise<void> {
  return request<void>(`/orders/by-code/${orderCode}`, {
    method: "DELETE",
  });
}
