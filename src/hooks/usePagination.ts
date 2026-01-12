import { useState, useMemo } from "react";

/**
 * Pagination hook return type.
 */
export interface UsePaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  paginatedItems: T[];
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

/**
 * Encapsulates pagination logic for arrays.
 * Handles page navigation and ensures current page stays in valid range.
 *
 * @param items - Array of items to paginate
 * @param itemsPerPage - Number of items per page (default: 10)
 * @returns Pagination state and navigation functions
 */
export function usePagination<T>(
  items: T[],
  itemsPerPage: number = 10
): UsePaginationReturn<T> {
  const [pageState, setPageState] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  // Ensure current page stays in valid range when items change
  const currentPage = useMemo(() => {
    return Math.min(pageState, totalPages);
  }, [pageState, totalPages]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setPageState(validPage);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setPageState(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setPageState(currentPage - 1);
    }
  };

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    canGoNext: currentPage < totalPages,
    canGoPrevious: currentPage > 1,
  };
}
