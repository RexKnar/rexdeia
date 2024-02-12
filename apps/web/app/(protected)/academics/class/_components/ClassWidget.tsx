import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'ui';
import { cn } from 'utils';

export function ClassWidget(props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className="flex flex-wrap content-start items-start gap-6 self-stretch md:gap-24 md:space-x-24">
      <div className="widget h-full w-full rounded-xl border border-primary-200 bg-white p-4 shadow-md shadow-primary-200">
        <div className="widget-title  flex items-center justify-between text-lg font-semibold">
          <Button
            className={cn('ps-0 text-lg font-semibold')}
            variant="ghost"
            onClick={() => {
              router.push(`class/${props.classDetails.id}`);
            }}
          >
            {props.classDetails.name}
          </Button>
          <div>
            <Button
              variant="outline"
              className={cn(
                'w-18 ml-2 h-5 rounded-lg border-none  bg-blue-100 px-2 py-1 text-center text-sm font-medium text-indigo-700'
              )}
            >
              Students
            </Button>
            <Button
              variant="outline"
              className={cn(
                'w-18 ml-2 h-5 rounded-lg border-none  px-2 py-1 text-center text-sm font-medium text-teal-800',
                props.classDetails.isActive ? 'bg-teal-100' : 'bg-red-300'
              )}
            >
              {props.classDetails.isActive ? 'Active' : 'Inactive'}
            </Button>
          </div>
        </div>
        <div className="mb-2 mt-4 flex flex-wrap content-center items-center gap-2 self-stretch">
          {props.classDetails.Section.map((section, index) => (
            <Button
              key={index}
              className="h-7 w-7 bg-primary-200 text-center text-black"
              onClick={() => {
                router.push(
                  `/academics/class/${props.classDetails.id}/section/${section.id}`
                );
              }}
            >
              {section.name}
            </Button>
          ))}
          <Button
            variant="outline"
            className="h-7 w-7 rounded p-1"
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.set('isSectionFlyoutOpen', 'true');
              params.set('classId', props.classDetails.id);

              router.replace(pathname + '?' + params.toString());
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
