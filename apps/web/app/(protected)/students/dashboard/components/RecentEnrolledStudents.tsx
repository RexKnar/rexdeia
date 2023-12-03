import { HeartPulse, MailOpen, PhoneCall } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from 'ui';

type RecentEnrolledStudentsProps = {
  readonly id: string;
  readonly status: string;
  readonly emailId: string;
  readonly lastName: string;
  readonly firstName: string;
  readonly fatherName: string;
  readonly motherName: string;
  readonly middleName: string;
  readonly bloodGroup: string;
  readonly phoneNumber: string;
  readonly aadharCardNumber: string;
};

export function RecentEnrolledStudents({
  id,
  status,
  emailId,
  firstName,
  lastName,
  bloodGroup,
  fatherName,
  motherName,
  middleName,
  phoneNumber,
  aadharCardNumber,
}: RecentEnrolledStudentsProps) {
  return (
    <section
      key={id}
      className="mt-4 grid w-full cursor-pointer grid-cols-5 gap-4 rounded-md border-l-2 border-transparent p-2 hover:border-l-2 hover:border-primary hover:bg-gray-50"
      style={{
        gridTemplateColumns: 'auto 1fr 1fr 1fr auto',
      }}
    >
      <div className="p-2">
        <Avatar className="h-14 w-14 cursor-pointer">
          <AvatarImage src="https://png.pngtree.com/thumb_back/fh260/background/20230612/pngtree-man-wearing-glasses-is-wearing-colorful-background-image_2905240.jpg" />
          <AvatarFallback className="bg-red-300">
            {firstName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      <div>
        <div className="text-primary">
          {firstName} {middleName}
          {lastName}
        </div>
        <div className="text-sm text-gray-900">Aadhar: {aadharCardNumber}</div>
        <div className="text-sm text-gray-800">Father Name: {fatherName}</div>
        <div className="text-sm text-gray-800">Mother Name: {motherName}</div>
        <div className="text-sm text-gray-800">
          Contact Number: {phoneNumber}
        </div>
      </div>
      <div className="flex flex-col gap-2 align-bottom">
        <div className="flex items-center">
          <MailOpen className="mr-1 text-red-500" size={18} />
          <div className="text-sm text-gray-800">{emailId}</div>
        </div>
        <div className="flex items-center">
          <PhoneCall className="mr-1 text-teal-800" size={18} />
          <div className="text-sm text-gray-800">{phoneNumber}</div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center">
          <HeartPulse className="mr-1 text-red-600" size={18} />
          <div className="text-sm text-gray-800">{bloodGroup}</div>
        </div>
      </div>
      <div className="flex h-full flex-col justify-center">
        <div className="rounded-md bg-green-600 px-2 py-1 text-white">
          {status}
        </div>
      </div>
    </section>
  );
}
