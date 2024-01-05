import { PencilLine, Search } from 'lucide-react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Avatar, AvatarImage, Button, Input, Text } from 'ui';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'ui/components/ui/Tabs';

import { authOptions } from '../../../../lib/auth';
import { PageTitle } from '../../../../lib/components/PageTitle';
import { getStudentById } from '../../../api/student/service';
import { StudentDetail } from './_components/StudentDetail';

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session.branchId || !session.organizationId) {
    return redirect(`/signin?callbackUrl=/students/${params.id}`);
  }

  const studentDetails: any = await getStudentById(params.id, 'form');
  const userDetails: any = studentDetails.formSections[0].sectionFields;

  const firstName = userDetails.filter((x) => x.name === 'firstName')[0].value;
  const middleName = userDetails.filter((x) => x.name === 'middleName')[0]
    .value;
  const lastName = userDetails.filter((x) => x.name === 'lastName')[0].value;
  const phoneNumber = userDetails.filter((x) => x.name === 'phoneNumber')[0]
    .value;

  return (
    <section className="w-full bg-gray-50 p-3">
      <PageTitle title="Student Profile" className="mb-3" />

      <div className="space-between mx-auto my-5 flex justify-between rounded-md bg-white p-6">
        <div className="flex">
          <Avatar className="h-20 w-20 cursor-pointer">
            <AvatarImage src="https://png.pngtree.com/thumb_back/fh260/background/20230612/pngtree-man-wearing-glasses-is-wearing-colorful-background-image_2905240.jpg" />
          </Avatar>
          <div className="my-auto px-5">
            <Text variant="base-bold">{`${firstName} ${middleName} ${lastName}`}</Text>
            <Text variant="base-regular">{phoneNumber}</Text>
          </div>
        </div>
        <div className="my-auto flex gap-4 px-5">
          <div className="relative">
            <Input
              type="text"
              className="border-primary-500 text-sm"
              placeholder="Search"
            />
            <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-2">
              <Search
                className="text-primary-500"
                size={18}
                strokeWidth={1.5}
              />
            </div>
          </div>
          <div className="relative my-auto">
            <Button variant="outline" className="text-primary">
              <PencilLine size={18} strokeWidth={0.5} />
              <span className="pl-2">Edit</span>
            </Button>
          </div>
        </div>
      </div>
      <Tabs defaultValue="profile" className="mt-4">
        <TabsList className="w-full justify-start border-b-2 border-gray-400">
          <TabsTrigger
            value="profile"
            className="mr-2 text-base focus:border-b-4 focus:border-primary"
          >
            Personal Information
          </TabsTrigger>
          <TabsTrigger
            value="document"
            className="mr-2 text-base focus:border-b-4 focus:border-primary"
          >
            Documents
          </TabsTrigger>
        </TabsList>
        <TabsContent className="w-full" value="profile">
          <StudentDetail formSections={studentDetails.formSections} />
        </TabsContent>
        <TabsContent value="document">
          <h1>Page 2</h1>
        </TabsContent>
      </Tabs>
    </section>
  );
}
