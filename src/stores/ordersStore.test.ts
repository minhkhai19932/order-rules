import { describe, it, expect, vi, beforeEach } from "vitest";
import { useOrdersStore } from "./ordersStore";
import * as ordersApi from "../api/orders";
import type {
  Order,
  CreateOrderPayload,
  UpdateOrderPayload,
} from "../types/order";

vi.mock("../api/orders");

describe("ordersStore", () => {
  const mockOrders: Order[] = [
    {
      id: "1",
      orderCode: "ORD-001",
      customer: {
        customerId: "CUST-001",
        name: "Customer 1",
        phone: "1234567890",
        email: "customer1@example.com",
      },
      items: [
        {
          id: 1,
          productId: "PROD-001",
          productName: "Product 1",
          quantity: 2,
          unitPrice: 1000,
          totalPrice: 2000,
        },
      ],
      pricing: {
        subTotal: 2000,
        shippingFee: 500,
        discount: 0,
        totalAmount: 2500,
        currency: "VND",
      },
      shipping: {
        shippingOrderCode: "SHIP-001",
        status: "NOT_CREATED",
        address: {
          receiverName: "Customer 1",
          receiverPhone: "1234567890",
          fullAddress: "123 Main St",
        },
        shipper: {
          shipperId: "SHIPPER-001",
          name: "Shipper 1",
          phone: "0987654321",
          vehicleType: "BIKE",
        },
        estimatedDeliveryTime: "",
        deliveredAt: "",
        failedReason: "",
      },
      orderStatus: "PENDING",
      paymentMethod: "CASH",
      paymentStatus: "PENDING",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
    {
      id: "2",
      orderCode: "ORD-002",
      customer: {
        customerId: "CUST-002",
        name: "Customer 2",
        phone: "0987654321",
        email: "customer2@example.com",
      },
      items: [
        {
          id: 2,
          productId: "PROD-002",
          productName: "Product 2",
          quantity: 1,
          unitPrice: 2000,
          totalPrice: 2000,
        },
      ],
      pricing: {
        subTotal: 2000,
        shippingFee: 500,
        discount: 0,
        totalAmount: 2500,
        currency: "VND",
      },
      shipping: {
        shippingOrderCode: "SHIP-002",
        status: "IN_TRANSIT",
        address: {
          receiverName: "Customer 2",
          receiverPhone: "0987654321",
          fullAddress: "456 Oak Ave",
        },
        shipper: {
          shipperId: "SHIPPER-002",
          name: "Shipper 2",
          phone: "1234567890",
          vehicleType: "CAR",
        },
        estimatedDeliveryTime: "",
        deliveredAt: "",
        failedReason: "",
      },
      orderStatus: "CONFIRMED",
      paymentMethod: "CARD",
      paymentStatus: "PAID",
      createdAt: "2026-01-02T00:00:00Z",
      updatedAt: "2026-01-02T00:00:00Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useOrdersStore.setState({
      items: [],
      loading: false,
      error: null,
    });
  });

  describe("fetchList", () => {
    it("should populate items and toggle loading", async () => {
      vi.mocked(ordersApi.listOrders).mockResolvedValue(mockOrders);

      const store = useOrdersStore.getState();
      expect(store.items).toEqual([]);
      expect(store.loading).toBe(false);

      await store.fetchList();

      expect(ordersApi.listOrders).toHaveBeenCalledTimes(1);
      expect(useOrdersStore.getState().items).toEqual(mockOrders);
      expect(useOrdersStore.getState().loading).toBe(false);
      expect(useOrdersStore.getState().error).toBe(null);
    });

    it("should handle errors and set error state", async () => {
      const errorMessage = "Network error";
      vi.mocked(ordersApi.listOrders).mockRejectedValue(
        new Error(errorMessage)
      );

      const store = useOrdersStore.getState();
      await store.fetchList();

      expect(useOrdersStore.getState().loading).toBe(false);
      expect(useOrdersStore.getState().error).toBe(errorMessage);
      expect(useOrdersStore.getState().items).toEqual([]);
    });
  });

  describe("cancelOrder", () => {
    it("should call updateOrderByCode with orderCode and CANCELLED status", async () => {
      const cancelledOrder: Order = {
        ...mockOrders[0],
        orderStatus: "CANCELLED",
        updatedAt: "2026-01-03T00:00:00Z",
      };

      vi.mocked(ordersApi.updateOrderByCode).mockResolvedValue(cancelledOrder);
      vi.mocked(ordersApi.listOrders).mockResolvedValue([
        cancelledOrder,
        mockOrders[1],
      ]);

      const store = useOrdersStore.getState();
      await store.cancelOrder("ORD-001");

      expect(ordersApi.updateOrderByCode).toHaveBeenCalledTimes(1);
      expect(ordersApi.updateOrderByCode).toHaveBeenCalledWith("ORD-001", {
        orderStatus: "CANCELLED",
      });
      expect(ordersApi.listOrders).toHaveBeenCalledTimes(1);
      expect(useOrdersStore.getState().items).toEqual([
        cancelledOrder,
        mockOrders[1],
      ]);
      expect(useOrdersStore.getState().loading).toBe(false);
      expect(useOrdersStore.getState().error).toBe(null);
    });

    it("should handle errors and set error state", async () => {
      const errorMessage = "Failed to cancel order";
      vi.mocked(ordersApi.updateOrderByCode).mockRejectedValue(
        new Error(errorMessage)
      );

      const store = useOrdersStore.getState();
      await expect(store.cancelOrder("ORD-001")).rejects.toThrow();

      expect(ordersApi.updateOrderByCode).toHaveBeenCalledTimes(1);
      expect(ordersApi.updateOrderByCode).toHaveBeenCalledWith("ORD-001", {
        orderStatus: "CANCELLED",
      });
      expect(ordersApi.listOrders).not.toHaveBeenCalled();
      expect(useOrdersStore.getState().loading).toBe(false);
      expect(useOrdersStore.getState().error).toBe(errorMessage);
    });
  });

  describe("deleteOne", () => {
    it("should call deleteOrder with orderCode", async () => {
      vi.mocked(ordersApi.deleteOrder).mockResolvedValue(undefined);
      vi.mocked(ordersApi.listOrders).mockResolvedValue([mockOrders[1]]);

      const store = useOrdersStore.getState();
      await store.deleteOne("ORD-001");

      expect(ordersApi.deleteOrder).toHaveBeenCalledTimes(1);
      expect(ordersApi.deleteOrder).toHaveBeenCalledWith("ORD-001");
      expect(ordersApi.listOrders).toHaveBeenCalledTimes(1);
      expect(useOrdersStore.getState().items).toEqual([mockOrders[1]]);
      expect(useOrdersStore.getState().loading).toBe(false);
      expect(useOrdersStore.getState().error).toBe(null);
    });

    it("should handle errors and set error state", async () => {
      const errorMessage = "Failed to delete order";
      vi.mocked(ordersApi.deleteOrder).mockRejectedValue(
        new Error(errorMessage)
      );

      const store = useOrdersStore.getState();
      await store.deleteOne("ORD-001");

      expect(ordersApi.deleteOrder).toHaveBeenCalledTimes(1);
      expect(ordersApi.deleteOrder).toHaveBeenCalledWith("ORD-001");
      expect(ordersApi.listOrders).not.toHaveBeenCalled();
      expect(useOrdersStore.getState().loading).toBe(false);
      expect(useOrdersStore.getState().error).toBe(errorMessage);
    });
  });

  describe("createOne", () => {
    it("should trigger API call then refresh list", async () => {
      const newOrder: Order = {
        id: "3",
        orderCode: "ORD-003",
        customer: {
          customerId: "CUST-003",
          name: "Customer 3",
          phone: "1111111111",
          email: "customer3@example.com",
        },
        items: [
          {
            id: 3,
            productId: "PROD-003",
            productName: "Product 3",
            quantity: 3,
            unitPrice: 3000,
            totalPrice: 9000,
          },
        ],
        pricing: {
          subTotal: 9000,
          shippingFee: 500,
          discount: 0,
          totalAmount: 9500,
          currency: "VND",
        },
        shipping: {
          shippingOrderCode: "SHIP-003",
          status: "NOT_CREATED",
          address: {
            receiverName: "Customer 3",
            receiverPhone: "1111111111",
            fullAddress: "789 Pine Rd",
          },
          shipper: {
            shipperId: "SHIPPER-003",
            name: "Shipper 3",
            phone: "2222222222",
            vehicleType: "BIKE",
          },
          estimatedDeliveryTime: "",
          deliveredAt: "",
          failedReason: "",
        },
        orderStatus: "PENDING",
        paymentMethod: "CASH",
        paymentStatus: "PENDING",
        createdAt: "2026-01-03T00:00:00Z",
        updatedAt: "2026-01-03T00:00:00Z",
      };

      const payload: CreateOrderPayload = {
        customer: newOrder.customer,
        items: newOrder.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        shippingAddress: newOrder.shipping.address,
        paymentMethod: newOrder.paymentMethod,
      };

      vi.mocked(ordersApi.createOrder).mockResolvedValue(newOrder);
      vi.mocked(ordersApi.listOrders).mockResolvedValue([
        ...mockOrders,
        newOrder,
      ]);

      const store = useOrdersStore.getState();
      await store.createOne(payload);

      expect(ordersApi.createOrder).toHaveBeenCalledTimes(1);
      expect(ordersApi.createOrder).toHaveBeenCalledWith(payload);
      expect(ordersApi.listOrders).toHaveBeenCalledTimes(1);
      expect(useOrdersStore.getState().items).toEqual([
        ...mockOrders,
        newOrder,
      ]);
      expect(useOrdersStore.getState().loading).toBe(false);
      expect(useOrdersStore.getState().error).toBe(null);
    });
  });

  describe("updateOne", () => {
    it("should trigger API call then refresh list", async () => {
      const updatedOrder: Order = {
        ...mockOrders[0],
        orderStatus: "CONFIRMED",
        updatedAt: "2026-01-04T00:00:00Z",
      };

      const payload: UpdateOrderPayload = {
        orderStatus: "CONFIRMED",
      };

      vi.mocked(ordersApi.updateOrder).mockResolvedValue(updatedOrder);
      vi.mocked(ordersApi.listOrders).mockResolvedValue([
        updatedOrder,
        mockOrders[1],
      ]);

      const store = useOrdersStore.getState();
      await store.updateOne("1", payload);

      expect(ordersApi.updateOrder).toHaveBeenCalledTimes(1);
      expect(ordersApi.updateOrder).toHaveBeenCalledWith("1", payload);
      expect(ordersApi.listOrders).toHaveBeenCalledTimes(1);
      expect(useOrdersStore.getState().items).toEqual([
        updatedOrder,
        mockOrders[1],
      ]);
      expect(useOrdersStore.getState().loading).toBe(false);
      expect(useOrdersStore.getState().error).toBe(null);
    });
  });
});
