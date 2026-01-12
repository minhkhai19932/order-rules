import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Order } from "../types/order";
import { render, screen, cleanup } from "../test/render";
import userEvent from "@testing-library/user-event";
import OrdersPage from "./OrdersPage";

interface MockOrdersStoreState {
  items: Order[];
  loading: boolean;
  error: string | null;
  fetchList: () => Promise<void> | void;
  createOne: () => Promise<void> | void;
  cancelOrder: (orderCode: string) => Promise<void> | void;
  deleteOne: (orderCode: string) => Promise<void> | void;
}

const mockFetchList = vi.fn(async () => {});
const mockCancelOrder = vi.fn(async () => {});
const mockDeleteOne = vi.fn(async () => {});

let mockOrdersState: MockOrdersStoreState = {
  items: [],
  loading: false,
  error: null,
  fetchList: mockFetchList,
  createOne: async () => {},
  cancelOrder: mockCancelOrder,
  deleteOne: mockDeleteOne,
};

vi.mock("../stores/ordersStore", () => {
  return {
    useOrdersStore: (selector: (state: MockOrdersStoreState) => unknown) => {
      return selector(mockOrdersState);
    },
  };
});

vi.mock("../stores/productsStore", () => {
  return {
    useProductsStore: (selector?: (state: unknown) => unknown) => {
      const state = {
        items: [],
        loading: false,
        error: null,
        fetchList: async () => {},
      };
      return selector ? selector(state) : state;
    },
  };
});

describe("OrdersPage", () => {
  const createMockOrder = (
    id: string,
    orderCode: string,
    orderStatus: string
  ): Order => ({
    id,
    orderCode,
    customer: {
      customerId: `CUST-${id}`,
      name: `Customer ${id}`,
      phone: "1234567890",
      email: `customer${id}@example.com`,
    },
    items: [
      {
        id: 1,
        productId: "PROD-001",
        productName: "Product 1",
        quantity: 1,
        unitPrice: 1000,
        totalPrice: 1000,
      },
    ],
    pricing: {
      subTotal: 1000,
      shippingFee: 500,
      discount: 0,
      totalAmount: 1500,
      currency: "VND",
    },
    shipping: {
      shippingOrderCode: `SHIP-${id}`,
      status: "NOT_CREATED",
      address: {
        receiverName: `Customer ${id}`,
        receiverPhone: "1234567890",
        fullAddress: "123 Main St",
      },
      shipper: {
        shipperId: `SHIPPER-${id}`,
        name: "Shipper",
        phone: "0987654321",
        vehicleType: "BIKE",
      },
      estimatedDeliveryTime: "",
      deliveredAt: "",
      failedReason: "",
    },
    orderStatus,
    paymentMethod: "CASH",
    paymentStatus: "PENDING",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  });

  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
    mockOrdersState = {
      items: [],
      loading: false,
      error: null,
      fetchList: mockFetchList,
      createOne: async () => {},
      cancelOrder: mockCancelOrder,
      deleteOne: mockDeleteOne,
    };
  });

  it("renders the Orders page title", () => {
    render(<OrdersPage />, { route: "/orders" });
    expect(
      screen.getByRole("heading", { name: /orders/i })
    ).toBeInTheDocument();
  });

  it("should enable Edit and Delete buttons for PENDING orders", () => {
    const pendingOrder = createMockOrder("1", "ORD-001", "PENDING");
    const confirmedOrder = createMockOrder("2", "ORD-002", "CONFIRMED");

    mockOrdersState.items = [pendingOrder, confirmedOrder];

    render(<OrdersPage />, { route: "/orders" });

    // Find Edit buttons by aria-label
    const editButtons = screen.getAllByRole("button", {
      name: /edit order/i,
    });
    expect(editButtons).toHaveLength(2);

    // PENDING order Edit button should be enabled
    const pendingEditButton = editButtons.find((btn) =>
      btn.getAttribute("aria-label")?.includes("ORD-001")
    );
    expect(pendingEditButton).not.toBeDisabled();

    // CONFIRMED order Edit button should be disabled
    const confirmedEditButton = editButtons.find((btn) =>
      btn.getAttribute("aria-label")?.includes("ORD-002")
    );
    expect(confirmedEditButton).toBeDisabled();

    // Find Delete buttons by aria-label
    const deleteButtons = screen.getAllByRole("button", {
      name: /delete order/i,
    });
    expect(deleteButtons).toHaveLength(2);

    // PENDING order Delete button should be enabled
    const pendingDeleteButton = deleteButtons.find((btn) =>
      btn.getAttribute("aria-label")?.includes("ORD-001")
    );
    expect(pendingDeleteButton).not.toBeDisabled();

    // CONFIRMED order Delete button should be disabled
    const confirmedDeleteButton = deleteButtons.find((btn) =>
      btn.getAttribute("aria-label")?.includes("ORD-002")
    );
    expect(confirmedDeleteButton).toBeDisabled();
  });

  it("should show Cancel Order button when Edit modal is opened", async () => {
    const user = userEvent.setup();
    const pendingOrder = createMockOrder("1", "ORD-001", "PENDING");

    mockOrdersState.items = [pendingOrder];

    render(<OrdersPage />, { route: "/orders" });

    // Click Edit button for PENDING order
    const editButton = screen.getByRole("button", {
      name: /edit order ORD-001/i,
    });
    await user.click(editButton);

    // Cancel Order button should be visible
    expect(
      screen.getByRole("button", { name: /cancel order/i })
    ).toBeInTheDocument();
  });

  it("should call cancelOrder with orderCode and refresh list when Cancel Order is clicked", async () => {
    const user = userEvent.setup();
    const pendingOrder = createMockOrder("1", "ORD-001", "PENDING");

    mockOrdersState.items = [pendingOrder];
    mockCancelOrder.mockResolvedValue(undefined);
    mockFetchList.mockResolvedValue(undefined);

    render(<OrdersPage />, { route: "/orders" });

    // Click Edit button
    const editButton = screen.getByRole("button", {
      name: /edit order ORD-001/i,
    });
    await user.click(editButton);

    // Click Cancel Order button
    const cancelButton = screen.getByRole("button", { name: /cancel order/i });
    await user.click(cancelButton);

    // Confirm dialog should appear - find confirm button
    const confirmButtons = screen.getAllByRole("button", {
      name: /cancel order/i,
    });
    // The last one should be the confirm button in the dialog
    const confirmButton = confirmButtons[confirmButtons.length - 1];
    await user.click(confirmButton);

    // Wait for async operations
    await new Promise((resolve) => setTimeout(resolve, 100));

    // cancelOrder should be called with orderCode
    expect(mockCancelOrder).toHaveBeenCalledTimes(1);
    expect(mockCancelOrder).toHaveBeenCalledWith("ORD-001");

    // fetchList should be called to refresh the list
    expect(mockFetchList).toHaveBeenCalled();
  });
});


