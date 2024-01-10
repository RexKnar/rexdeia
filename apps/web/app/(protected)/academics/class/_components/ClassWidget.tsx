import { useRouter } from 'next/navigation';
import {
  parseAsBoolean,
  parseAsString,
  useQueryState,
} from 'next-usequerystate';
import { Button } from 'ui';
import { cn } from 'utils';

export function ClassWidget(props) {
  const router = useRouter();
  const [, isSectionFlyoutOpen] = useQueryState(
    'isSectionFlyoutOpen',
    parseAsBoolean.withDefault(false)
  );
  const [, setClassId] = useQueryState(
    'classId',
    parseAsString.withDefault('')
  );

  return (
    <div className="widget-container space-y-4">
      <div className="widget h-32 min-w-80 rounded-lg border border-primary-200 bg-white p-4 shadow-md">
        <div className="widget-title  flex items-center text-lg font-semibold">
          <Button
            className={cn('ps-0 text-lg font-semibold')}
            variant="ghost"
            onClick={() => {
              router.push(`class/${props.classDetails.id}`);
            }}
          >
            {props.classDetails.name}
          </Button>
          <Button
            variant="outline"
            className={cn(
              'w-18 ml-auto  h-6 rounded-sm border-primary-300  px-2 py-1 text-center text-sm font-medium text-white',
              props.classDetails.isActive ? 'bg-green-600' : 'bg-red-600'
            )}
          >
            {props.classDetails.isActive ? 'Active' : 'Inactive'}
          </Button>
        </div>
        <div className="mt-6 flex flex-wrap content-center items-center gap-2 self-stretch">
          {props.classDetails.Section.map((section, index) => (
            <Button key={index} className="text-center">
              {section.name}
            </Button>
          ))}
          <Button
            variant="outline"
            className="h-7 w-7 gap-1 rounded p-1"
            onClick={() => {
              setClassId(props.classDetails.id);
              isSectionFlyoutOpen(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4 12C4 11.4477 4.44772 11 5 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H5C4.44772 13 4 12.5523 4 12Z"
                fill="#6559FC"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12 4C12.5523 4 13 4.44772 13 5V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V5C11 4.44772 11.4477 4 12 4Z"
                fill="#6559FC"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
