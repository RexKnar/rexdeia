'use client';
import { Pencil, Trash } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'ui';
import { formatDate } from 'utils';

export function AssessmentFormatDetailCard(props) {
  const {
    assessmentFormat,
    dateToConduct,
    markToConduct,
    markToConvert,
    minPassMark,
    id: configId,
  } = props;
  const pathname = usePathname();
  const router = useRouter();

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  return (
    <div
      className="rounded-2 border border-2 border-white bg-green-200 p-2 "
      onClick={() => {
        // params.set(type, queryValue);

        // openFlyout ? params.set('isExamConfigureFlyoutOpen', 'true') : null;
        router.replace(pathname + '?' + params.toString());
      }}
    >
      <h4 className="text-center">{assessmentFormat?.name || ''}</h4>
      <div className="flex flex-wrap text-left">
        <span className="w-1/2">Date</span>
        <span className="w-1/2">{formatDate(dateToConduct)}</span>
      </div>
      <div className="flex flex-wrap text-left">
        <span className="w-1/2">Conduct</span>
        <span className="w-1/2">{markToConduct}</span>
      </div>
      <div className="flex flex-wrap text-left">
        <span className="w-1/2">Pass</span>
        <span className="w-1/2">{minPassMark}</span>
      </div>
      <div className="flex flex-wrap text-left">
        <span className="w-1/2">Covert To</span>
        <span className="w-1/2">{markToConvert}</span>
      </div>
      <div className="item-center flex justify-center gap-2">
        <Button
          className="h-auto bg-primary-600 px-3 py-1 text-white"
          variant="mild"
        >
          <Pencil size={12} className="text-center" />
        </Button>
        <Button
          className="h-auto bg-red-600 px-3 py-1 text-white"
          variant="mild"
          onClick={() => {
            const localParams = new URLSearchParams(searchParams);
            localParams.set('isDeleteConfigModal', 'true');
            localParams.set('configId', configId);
            router.replace(pathname + '?' + localParams.toString());
          }}
        >
          <Trash size={12} className="text-center" />
        </Button>
      </div>
    </div>
  );
}
