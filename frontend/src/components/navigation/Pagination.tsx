import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IconButton } from '../ui/IconButton';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className = '',
}) => {
  const range = (start: number, end: number) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const getPageNumbers = () => {
    const totalPageNumbers = siblingCount * 2 + 5; // siblingCount + firstPage + lastPage + currentPage + 2*dots

    if (totalPages <= totalPageNumbers) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);
      return [...leftRange, '...', totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [1, '...', ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [1, '...', ...middleRange, '...', totalPages];
    }

    return range(1, totalPages);
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <nav className={`flex items-center justify-center gap-1.5 select-none ${className}`}>
      <IconButton
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-xl border border-border-main text-text-secondary disabled:opacity-30"
      >
        <ChevronLeft size={16} />
      </IconButton>

      {pageNumbers.map((num, idx) => {
        if (num === '...') {
          return (
            <span key={`dots-${idx}`} className="px-3 py-1.5 text-sm text-text-muted">
              &bull;&bull;&bull;
            </span>
          );
        }

        const isCurrent = num === currentPage;

        return (
          <button
            key={`page-${num}`}
            onClick={() => onPageChange(num as number)}
            className={`w-9 h-9 flex items-center justify-center text-sm font-medium rounded-xl transition-main cursor-pointer focus-ring
              ${
                isCurrent
                  ? 'bg-brand-orange text-white'
                  : 'text-text-secondary hover:bg-surface-bg hover:text-text-primary border border-border-main'
              }`}
          >
            {num}
          </button>
        );
      })}

      <IconButton
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-xl border border-border-main text-text-secondary disabled:opacity-30"
      >
        <ChevronRight size={16} />
      </IconButton>
    </nav>
  );
};
