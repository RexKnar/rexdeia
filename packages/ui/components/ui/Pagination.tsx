'use client';

import { useState, useEffect } from 'react';
import { Button } from './Button';
import { cn } from 'utils';

type PaginationProps = {
  pageSize: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
};

export function Pagination({
  pageSize,
  totalRecords,
  onPageChange,
}: Readonly<PaginationProps>) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalRecords / pageSize);

  useEffect(() => {
    onPageChange(currentPage);
  }, [currentPage, onPageChange]);

  const handleClick = (page: number) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const pageNumbersToShow = 5;
    let startPage, endPage;

    if (totalPages <= pageNumbersToShow) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const middle = Math.floor(pageNumbersToShow / 2);
      startPage = Math.max(1, currentPage - middle);
      endPage = Math.min(totalPages, currentPage + middle);

      if (currentPage <= middle) {
        endPage = startPage + pageNumbersToShow - 1;
      } else if (currentPage + middle >= totalPages) {
        startPage = totalPages - pageNumbersToShow + 1;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          variant="outline"
          onClick={() => handleClick(i)}
          className={cn('mr-2', currentPage === i && 'font-bold')}
        >
          {i}
        </Button>
      );
    }

    return pageNumbers;
  };

  return (
    <div>
      <Button
        className="mr-2"
        variant="outline"
        disabled={currentPage === 1}
        onClick={() => handleClick(currentPage - 1)}
      >
        Previous
      </Button>
      {renderPageNumbers()}
      <Button
        variant="outline"
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
}
