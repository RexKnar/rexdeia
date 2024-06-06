import { SectionModel } from 'lib/domain/section';
import { SubjectModel } from 'lib/domain/subject';
import { MoreHorizontal } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Avatar,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Text,
} from 'ui';

type StaffCardProps = {
  id: string;
  name: string;
  academicYearId: string;
  subjects?: SubjectModel[];
  sectionsHandled?: SectionModel[];
};

export function StaffCard(props: StaffCardProps) {
  const { id, name, subjects, sectionsHandled, academicYearId } = props;
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className="flex bg-white p-3">
      <div className="w-1/4">
        <Avatar className="h-16 w-16 cursor-pointer">
          <AvatarImage src="https://png.pngtree.com/thumb_back/fh260/background/20230612/pngtree-man-wearing-glasses-is-wearing-colorful-background-image_2905240.jpg" />
        </Avatar>
      </div>

      <div className="my-auto w-2/4 px-2">
        <Text variant="base-bold">{name}</Text>
        {sectionsHandled.map((section, sectionIndex) => (
          <div key={sectionIndex} className="inline-flex items-center">
            <span className="ml-1 rounded bg-red-300 p-2 px-1.5 py-0.5 text-sm font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
              {section.name}
            </span>
            {subjects.length > sectionIndex && (
              <div className="ml-2">
                <Text variant="base-regular">
                  {subjects[sectionIndex].name}
                </Text>
              </div>
            )}
          </div>
        ))}
        {sectionsHandled.length && (
          <Text variant="base-regular">No Sections</Text>
        )}
        {subjects.length && <Text variant="base-regular">No Subjects</Text>}
      </div>
      <div className="my-auto w-3/4 ">
        <div className="float-end my-auto justify-end p-1">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
              <Button variant="mild" size="sm" className="h-8 px-1">
                <MoreHorizontal className="text-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="bg-white"
              align="end"
              sideOffset={15}
            >
              <DropdownMenuItem className="flex cursor-pointer items-center">
                <Button variant="link" className="flex-1 ">
                  Reassign
                </Button>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-100 text-gray-500" />
              <DropdownMenuItem className="flex cursor-pointer items-center">
                <Button
                  variant="link"
                  size="sm"
                  className="flex-1"
                  onClick={async () => {
                    const params = new URLSearchParams(searchParams);
                    params.set('isUnassignStaffFlyoutOpen', 'true');
                    params.set('academicYearId', academicYearId);
                    params.set('staffId', id);

                    router.replace(pathname + '?' + params.toString());
                  }}
                >
                  Remove
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* <UnassignStaffFlyout /> */}
        </div>
      </div>
    </div>
  );
}
