/**
 * Shipping status values for order delivery.
 */
export type ShippingStatus =
  | "NOT_CREATED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "FAILED"
  | "CANCELLED";

/**
 * Order item within an order.
 */
export interface OrderItem {
  id: number;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

/**
 * Customer information for an order.
 */
export interface OrderCustomer {
  customerId: string;
  name: string;
  phone: string;
  email: string;
}

/**
 * Pricing breakdown for an order.
 */
export interface OrderPricing {
  subTotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  currency: "VND";
}

/**
 * Shipping address for order delivery.
 */
export interface ShippingAddress {
  receiverName: string;
  receiverPhone: string;
  fullAddress: string;
}

/**
 * Shipper information for order delivery.
 */
export interface Shipper {
  shipperId: string;
  name: string;
  phone: string;
  vehicleType: string;
}

/**
 * Shipping information for an order.
 */
export interface OrderShipping {
  shippingOrderCode: string;
  status: ShippingStatus;
  address: ShippingAddress;
  shipper: Shipper;
  estimatedDeliveryTime: string;
  deliveredAt: string;
  failedReason: string;
}

/**
 * Order entity representing a customer purchase.
 */
export interface Order {
  id: string;
  orderCode: string;
  customer: OrderCustomer;
  items: OrderItem[];
  pricing: OrderPricing;
  shipping: OrderShipping;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Payload for creating a new order.
 */
export interface CreateOrderPayload {
  customer: OrderCustomer;
  items: Array<Pick<OrderItem, "productId" | "quantity" | "unitPrice">>;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}

/**
 * Payload for updating an existing order.
 */
export interface UpdateOrderPayload {
  customer?: OrderCustomer;
  items?: Array<Pick<OrderItem, "productId" | "quantity" | "unitPrice">>;
  shippingAddress?: ShippingAddress;
  paymentMethod?: string;
  orderStatus?: string;
  paymentStatus?: string;
}
