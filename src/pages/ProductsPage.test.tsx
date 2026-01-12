import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Product } from "../types/product";
import { render, screen, cleanup } from "../test/render";
import userEvent from "@testing-library/user-event";
import ProductsPage from "./ProductsPage";

interface MockProductsStoreState {
  items: Product[];
  loading: boolean;
  error: string | null;
  fetchList: () => Promise<void> | void;
  createOne: (payload: unknown) => Promise<void> | void;
  updateOne: () => Promise<void> | void;
  deleteOne: () => Promise<void> | void;
}

const mockFetchList = vi.fn(async () => {});
const mockCreateOne = vi.fn(async () => {});
const mockUpdateOne = vi.fn(async () => {});
const mockDeleteOne = vi.fn(async () => {});

let mockProductsState: MockProductsStoreState = {
  items: [],
  loading: false,
  error: null,
  fetchList: mockFetchList,
  createOne: mockCreateOne,
  updateOne: mockUpdateOne,
  deleteOne: mockDeleteOne,
};

vi.mock("../stores/productsStore", () => {
  return {
    useProductsStore: (selector: (state: MockProductsStoreState) => unknown) => {
      return selector(mockProductsState);
    },
  };
});

describe("ProductsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
    mockProductsState = {
      items: [],
      loading: false,
      error: null,
      fetchList: mockFetchList,
      createOne: mockCreateOne,
      updateOne: mockUpdateOne,
      deleteOne: mockDeleteOne,
    };
  });

  it("renders the Products page title", () => {
    render(<ProductsPage />, { route: "/products" });
    expect(
      screen.getByRole("heading", { name: /products/i })
    ).toBeInTheDocument();
  });

  it("should open Create Product modal when Create Product button is clicked", async () => {
    const user = userEvent.setup();
    render(<ProductsPage />, { route: "/products" });

    const createButtons = screen.getAllByRole("button", { name: /create product/i });
    const createButton = createButtons[0]; // Get the button, not the modal title
    await user.click(createButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /create product/i })).toBeInTheDocument();
  });

  it("should require name field in Create Product modal", async () => {
    const user = userEvent.setup();
    render(<ProductsPage />, { route: "/products" });

    const createButtons = screen.getAllByRole("button", { name: /create product/i });
    await user.click(createButtons[0]);

    const submitButton = screen.getByRole("button", { name: /save/i });
    await user.click(submitButton);

    // Name field should show error
    await screen.findByText(/name is required/i);
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
  });

  it("should require price >= 0 in Create Product modal", async () => {
    const user = userEvent.setup();
    render(<ProductsPage />, { route: "/products" });

    const createButtons = screen.getAllByRole("button", { name: /create product/i });
    await user.click(createButtons[0]);

    const nameInput = screen.getByLabelText(/name/i);
    const priceInput = screen.getByLabelText(/price/i);

    await user.type(nameInput, "Test Product");
    await user.clear(priceInput);
    await user.type(priceInput, "-10");

    const submitButton = screen.getByRole("button", { name: /save/i });
    await user.click(submitButton);

    // Price validation error should appear
    await screen.findByText(/price must be greater than or equal to 0/i);
    expect(
      screen.getByText(/price must be greater than or equal to 0/i)
    ).toBeInTheDocument();
  });

  it("should require stock >= 0 in Create Product modal", async () => {
    const user = userEvent.setup();
    render(<ProductsPage />, { route: "/products" });

    const createButtons = screen.getAllByRole("button", { name: /create product/i });
    await user.click(createButtons[0]);

    const nameInput = screen.getByLabelText(/name/i);
    const stockInput = screen.getByLabelText(/stock/i);

    await user.type(nameInput, "Test Product");
    await user.clear(stockInput);
    await user.type(stockInput, "-5");

    const submitButton = screen.getByRole("button", { name: /save/i });
    await user.click(submitButton);

    // Stock validation error should appear
    await screen.findByText(/stock must be greater than or equal to 0/i);
    expect(
      screen.getByText(/stock must be greater than or equal to 0/i)
    ).toBeInTheDocument();
  });

  it("should call createOne with valid data when submitting Create Product form", async () => {
    const user = userEvent.setup();
    mockCreateOne.mockResolvedValue(undefined);
    mockFetchList.mockResolvedValue(undefined);

    render(<ProductsPage />, { route: "/products" });

    const createButtons = screen.getAllByRole("button", { name: /create product/i });
    await user.click(createButtons[0]);

    const nameInput = screen.getByLabelText(/name/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const priceInput = screen.getByLabelText(/price/i);
    const stockInput = screen.getByLabelText(/stock/i);

    await user.type(nameInput, "New Product");
    await user.type(descriptionInput, "Product description");
    await user.clear(priceInput);
    await user.type(priceInput, "1000");
    await user.clear(stockInput);
    await user.type(stockInput, "10");

    const submitButton = screen.getByRole("button", { name: /save/i });
    await user.click(submitButton);

    // Wait for async operations
    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(mockCreateOne).toHaveBeenCalledTimes(1);
    expect(mockCreateOne).toHaveBeenCalledWith({
      name: "New Product",
      description: "Product description",
      price: 1000,
      currency: "VND",
      stock: 10,
      status: "ACTIVE",
    });
  });

  it("should call fetchList when Refresh button is clicked", async () => {
    const user = userEvent.setup();
    mockFetchList.mockResolvedValue(undefined);

    render(<ProductsPage />, { route: "/products" });

    // fetchList is called on mount via useEffect, so reset the mock
    mockFetchList.mockClear();

    const refreshButton = screen.getByRole("button", { name: /refresh/i });
    await user.click(refreshButton);

    expect(mockFetchList).toHaveBeenCalledTimes(1);
  });
});

