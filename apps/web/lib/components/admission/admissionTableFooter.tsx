'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'ui';

export function AdmissionTableFooter(totalCount: { totalCount: number }) {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') ?? '1');
  const tablePaginationLimit = Number(
    searchParams.get('tablePaginationLimit') ?? '5'
  );
  const router = useRouter();
  const buttonCount = Math.ceil(totalCount.totalCount / tablePaginationLimit);
  const buttonValues = Array.from(
    { length: buttonCount },
    (_, index) => index + 1
  );

  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="text-muted-foreground flex text-sm">
        <span className="flex items-center gap-1">
          Entries per page:
          <input
            type="number"
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              router.push(`?tablePaginationLimit=${page + 1}`);
            }}
            className="w-16 rounded border p-1"
          />
        </span>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            router.push(
              `?page=${1}&tablePaginationLimit=${tablePaginationLimit}`
            );
          }}
          disabled={page == 1}
        >
          Start
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            router.push(
              `?page=${page - 1}&tablePaginationLimit=${tablePaginationLimit}`
            );
          }}
          disabled={page == 1}
        >
          Previous
        </Button>
        {buttonValues.map((value, indux) => (
          <Button
            className={value === page ? 'border-blue-500 text-blue-500' : ''}
            variant="outline"
            key={value}
            onClick={() => {
              router.push(
                `?page=${
                  indux + 1
                }&tablePaginationLimit=${tablePaginationLimit}`
              );
            }}
            disabled={value == page}
          >
            {value}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            router.push(
              `?page=${page + 1}&tablePaginationLimit=${tablePaginationLimit}`
            );
          }}
          disabled={buttonCount == page}
        >
          Next
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            router.push(
              `?page=${buttonCount}&tablePaginationLimit=${tablePaginationLimit}`
            );
          }}
          disabled={buttonCount == page}
        >
          End
        </Button>
      </div>
    </div>
  );
}
