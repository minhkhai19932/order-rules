import type { UsePaginationReturn } from '../../hooks/usePagination';

/**
 * Pagination controls component props.
 */
export interface PaginationControlsProps {
  readonly pagination: UsePaginationReturn<unknown>;
}

/**
 * Reusable pagination controls component.
 * Displays page information and navigation buttons.
 * Only renders when there are multiple pages.
 */
export function PaginationControls({ pagination }: PaginationControlsProps) {
  const { currentPage, totalPages, goToNextPage, goToPreviousPage, canGoNext, canGoPrevious } =
    pagination;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="text-sm text-gray-700">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex gap-2">
        <button
          onClick={goToPreviousPage}
          disabled={!canGoPrevious}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button
          onClick={goToNextPage}
          disabled={!canGoNext}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}

