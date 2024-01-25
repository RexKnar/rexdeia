'use client';

import { useState, useEffect } from 'react';
import { Button } from './Button';
import { cn } from 'utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './Select';

type PaginationProps = {
  pageSize: number;
  totalRecords: number;
  value: string;
  disabled: boolean;
  onPageChange: (page: number) => void;
  onValueChange: (value: any) => void;
};

export function Pagination({
  pageSize,
  totalRecords,
  value,
  disabled,
  onPageChange,
  onValueChange,
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
          variant="ghost"
          onClick={() => handleClick(i)}
          className={cn('mr-2', currentPage === i && 'font-bold text-primary')}
        >
          {i}
        </Button>,
      );
    }

    return pageNumbers;
  };

  return (
    <section className="mt-5 flex justify-between">
      <div className="justify-left flex w-2/6">
        <label className="w-1/3 py-2 text-center text-sm text-gray-700">
          Entries per page
        </label>
        <div className="w-1/3">
          <Select
            value={value}
            disabled={disabled}
            onValueChange={onValueChange}
          >
            <SelectTrigger className="w-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={'10'}>10</SelectItem>
                <SelectItem value={'25'}>25</SelectItem>
                <SelectItem value={'50'}>50</SelectItem>
                <SelectItem value={'100'}>100</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Button
          className="mr-2"
          variant="ghost"
          disabled={currentPage === 1}
          onClick={() => handleClick(currentPage - 1)}
        >
          Previous
        </Button>
        {renderPageNumbers()}
        <Button
          variant="ghost"
          onClick={() => handleClick(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </section>
  );
}
