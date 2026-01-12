import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePagination } from "./usePagination";

describe("usePagination", () => {
  const createItems = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
    }));
  };

  describe("10 items/page behavior", () => {
    it("should show first 10 items on page 1", () => {
      const items = createItems(25);
      const { result } = renderHook(() => usePagination(items, 10));

      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(3);
      expect(result.current.paginatedItems).toHaveLength(10);
      expect(result.current.paginatedItems[0].id).toBe(1);
      expect(result.current.paginatedItems[9].id).toBe(10);
    });

    it("should show next 10 items on page 2", () => {
      const items = createItems(25);
      const { result } = renderHook(() => usePagination(items, 10));

      act(() => {
        result.current.goToPage(2);
      });

      expect(result.current.currentPage).toBe(2);
      expect(result.current.paginatedItems).toHaveLength(10);
      expect(result.current.paginatedItems[0].id).toBe(11);
      expect(result.current.paginatedItems[9].id).toBe(20);
    });

    it("should show remaining items on last page", () => {
      const items = createItems(25);
      const { result } = renderHook(() => usePagination(items, 10));

      act(() => {
        result.current.goToPage(3);
      });

      expect(result.current.currentPage).toBe(3);
      expect(result.current.totalPages).toBe(3);
      expect(result.current.paginatedItems).toHaveLength(5);
      expect(result.current.paginatedItems[0].id).toBe(21);
      expect(result.current.paginatedItems[4].id).toBe(25);
    });
  });

  describe("next/prev boundaries", () => {
    it("should not go to next page when on last page", () => {
      const items = createItems(15);
      const { result } = renderHook(() => usePagination(items, 10));

      act(() => {
        result.current.goToPage(2);
      });

      expect(result.current.currentPage).toBe(2);
      expect(result.current.canGoNext).toBe(false);

      act(() => {
        result.current.goToNextPage();
      });

      expect(result.current.currentPage).toBe(2);
    });

    it("should not go to previous page when on first page", () => {
      const items = createItems(15);
      const { result } = renderHook(() => usePagination(items, 10));

      expect(result.current.currentPage).toBe(1);
      expect(result.current.canGoPrevious).toBe(false);

      act(() => {
        result.current.goToPreviousPage();
      });

      expect(result.current.currentPage).toBe(1);
    });

    it("should allow navigation between pages", () => {
      const items = createItems(25);
      const { result } = renderHook(() => usePagination(items, 10));

      expect(result.current.currentPage).toBe(1);
      expect(result.current.canGoNext).toBe(true);
      expect(result.current.canGoPrevious).toBe(false);

      act(() => {
        result.current.goToNextPage();
      });

      expect(result.current.currentPage).toBe(2);
      expect(result.current.canGoNext).toBe(true);
      expect(result.current.canGoPrevious).toBe(true);

      act(() => {
        result.current.goToPreviousPage();
      });

      expect(result.current.currentPage).toBe(1);
      expect(result.current.canGoNext).toBe(true);
      expect(result.current.canGoPrevious).toBe(false);
    });
  });

  describe("items length change clamps current page", () => {
    it("should clamp to last page when items decrease", () => {
      const items = createItems(25);
      const { result, rerender } = renderHook(
        ({ items }) => usePagination(items, 10),
        { initialProps: { items } }
      );

      act(() => {
        result.current.goToPage(3);
      });

      expect(result.current.currentPage).toBe(3);

      // Reduce items to 5 (only 1 page)
      rerender({ items: createItems(5) });

      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(1);
      expect(result.current.paginatedItems).toHaveLength(5);
    });

    it("should stay on current page when items increase", () => {
      const items = createItems(5);
      const { result, rerender } = renderHook(
        ({ items }) => usePagination(items, 10),
        { initialProps: { items } }
      );

      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(1);

      // Increase items to 25 (3 pages)
      rerender({ items: createItems(25) });

      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(3);
    });

    it("should clamp when on page beyond new total pages", () => {
      const items = createItems(25);
      const { result, rerender } = renderHook(
        ({ items }) => usePagination(items, 10),
        { initialProps: { items } }
      );

      act(() => {
        result.current.goToPage(3);
      });

      expect(result.current.currentPage).toBe(3);

      // Reduce to 15 items (2 pages)
      rerender({ items: createItems(15) });

      expect(result.current.currentPage).toBe(2);
      expect(result.current.totalPages).toBe(2);
    });
  });

  describe("resetPage (goToPage(1))", () => {
    it("should reset page to 1 using goToPage(1)", () => {
      const items = createItems(25);
      const { result } = renderHook(() => usePagination(items, 10));

      act(() => {
        result.current.goToPage(3);
      });

      expect(result.current.currentPage).toBe(3);

      act(() => {
        result.current.goToPage(1);
      });

      expect(result.current.currentPage).toBe(1);
      expect(result.current.paginatedItems[0].id).toBe(1);
    });

    it("should handle empty items array", () => {
      const { result } = renderHook(() => usePagination([], 10));

      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(1);
      expect(result.current.paginatedItems).toHaveLength(0);
      expect(result.current.canGoNext).toBe(false);
      expect(result.current.canGoPrevious).toBe(false);
    });

    it("should handle single page", () => {
      const items = createItems(5);
      const { result } = renderHook(() => usePagination(items, 10));

      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(1);
      expect(result.current.paginatedItems).toHaveLength(5);
      expect(result.current.canGoNext).toBe(false);
      expect(result.current.canGoPrevious).toBe(false);
    });
  });
});
