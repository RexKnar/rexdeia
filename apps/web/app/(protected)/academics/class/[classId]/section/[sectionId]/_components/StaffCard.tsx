import { SectionModel } from 'lib/domain/section';
import { SubjectModel } from 'lib/domain/subject';
import { MoreHorizontal } from 'lucide-react';
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
  subjects?: SubjectModel[];
  sectionsHandled?: SectionModel[];
};

export function StaffCard(props: StaffCardProps) {
  return (
    <div className="flex bg-white p-3">
      <div className="w-1/4">
        <Avatar className="h-16 w-16 cursor-pointer">
          <AvatarImage src="https://png.pngtree.com/thumb_back/fh260/background/20230612/pngtree-man-wearing-glasses-is-wearing-colorful-background-image_2905240.jpg" />
        </Avatar>
      </div>

      <div className="my-auto w-2/4 px-2">
        <Text variant="base-bold">{props.name}</Text>
        {props.sectionsHandled.map((section, sectionIndex) => (
          <div key={sectionIndex} className="inline-flex items-center">
            <span className="ml-1 rounded bg-red-300 p-2 px-1.5 py-0.5 text-sm font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
              {section.name}
            </span>
            {props.subjects.length > sectionIndex && (
              <div className="ml-2">
                <Text variant="base-regular">
                  {props.subjects[sectionIndex].name}
                </Text>
              </div>
            )}
          </div>
        ))}
        {props.sectionsHandled.length && (
          <Text variant="base-regular">No Sections</Text>
        )}
        {props.subjects.length && (
          <Text variant="base-regular">No Subjects</Text>
        )}
      </div>
      <div className="my-auto w-3/4 ">
        <div className="float-end my-auto justify-end p-1">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
              <Button variant="mild" className="h-8 px-1">
                <MoreHorizontal className="text-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="bg-white"
              align="end"
              sideOffset={15}
            >
              <DropdownMenuItem className="flex cursor-pointer items-center">
                <span className="flex-1">Reassign</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-100 text-gray-500" />
              <DropdownMenuItem className="flex cursor-pointer items-center">
                <span className="flex-1">Remove</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
