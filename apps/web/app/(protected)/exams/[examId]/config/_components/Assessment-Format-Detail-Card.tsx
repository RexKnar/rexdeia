'use client';
import { Pencil, Trash } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'ui';
import { formatDate } from 'utils';

export function AssessmentFormatDetailCard(props) {
  const {
    assessmentFormat,
    dateToConduct,
    totalMarks,
    convertTo,
    minMark,
    excludeSubjectValidation,
    order,
    id: configId,
  } = props;
  const pathname = usePathname();
  const router = useRouter();

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  return (
    <div className="rounded-2 border-2 border-white bg-green-200 p-2 ">
      <div className="flex items-center justify-center gap-3">
        <h4 className="text-center">{assessmentFormat?.name || ''}</h4>
        <label htmlFor="order" className="text-sm font-semibold text-gray-700">
          Order: {order}
        </label>
      </div>
      <div className="flex flex-wrap text-left">
        <span className="w-1/2">Date</span>
        <span className="w-1/2">{formatDate(dateToConduct, 'dd/mm/yyyy')}</span>
      </div>
      <div className="flex flex-wrap text-left">
        <span className="w-1/2">Conduct</span>
        <span className="w-1/2">{totalMarks}</span>
      </div>
      <div className="flex flex-wrap text-left">
        <span className="w-1/2">Pass</span>
        <span className="w-1/2">{minMark}</span>
      </div>
      <div className="flex flex-wrap text-left">
        <span className="w-1/2">Covert To</span>
        <span className="w-1/2">{convertTo}</span>
      </div>
      <div className="flex flex-wrap text-left">
        <span className="w-1/2">Override Pass Criteria</span>
        <span className="w-1/2">{excludeSubjectValidation ? 'Yes' : 'No'}</span>
      </div>
      <div className="item-center flex justify-center gap-2">
        <Button
          className="h-auto bg-primary-600 px-3 py-1 text-white"
          variant="mild"
          onClick={() => {
            params.set('isEditExamPartitionFlyoutOpen', 'true');
            params.set('configId', configId);
            router.replace(pathname + '?' + params.toString());
          }}
        >
          <Pencil size={12} className="text-center" />
        </Button>
        <Button
          className="h-auto bg-red-600 px-3 py-1 text-white"
          variant="mild"
          onClick={() => {
            params.set('isDeleteConfigModal', 'true');
            params.set('configId', configId);
            router.replace(pathname + '?' + params.toString());
          }}
        >
          <Trash size={12} className="text-center" />
        </Button>
      </div>
    </div>
  );
}
