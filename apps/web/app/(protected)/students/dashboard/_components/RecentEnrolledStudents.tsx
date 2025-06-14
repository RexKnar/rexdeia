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
      className="mt-4 w-full cursor-pointer rounded-md border-l-2 border-transparent p-4 transition-all duration-150 hover:border-primary hover:bg-gray-50"
    >
      <div className="flex flex-col items-start gap-4 md:grid md:grid-cols-[auto_1fr_1fr_1fr_auto]">
        <div className="flex justify-center md:justify-start">
          <Avatar className="h-14 w-14">
            <AvatarImage src="https://png.pngtree.com/thumb_back/fh260/background/20230612/pngtree-man-wearing-glasses-is-wearing-colorful-background-image_2905240.jpg" />
            <AvatarFallback className="bg-red-300">
              {firstName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div>
          <div className="font-semibold text-primary">
            {firstName} {middleName} {lastName}
          </div>
          <div className="text-sm text-gray-900">
            Aadhar: {aadharCardNumber}
          </div>
          <div className="text-sm text-gray-800">Father: {fatherName}</div>
          <div className="text-sm text-gray-800">Mother: {motherName}</div>
          <div className="text-sm text-gray-800">Phone: {phoneNumber}</div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <MailOpen className="mr-1 text-red-500" size={18} />
            <span className="text-sm text-gray-800">{emailId}</span>
          </div>
          <div className="flex items-center">
            <PhoneCall className="mr-1 text-teal-800" size={18} />
            <span className="text-sm text-gray-800">{phoneNumber}</span>
          </div>
        </div>

        <div className="flex items-center">
          <HeartPulse className="mr-1 text-red-600" size={18} />
          <span className="text-sm text-gray-800">{bloodGroup}</span>
        </div>

        <div className="flex items-center justify-start md:justify-center">
          <span className="rounded bg-green-600 px-2 py-1 text-sm text-white">
            {status}
          </span>
        </div>
      </div>
    </section>
  );
}
