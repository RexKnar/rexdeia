import { Check, FileEdit, FileText } from 'lucide-react';
import { useState } from 'react';
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Text,
} from 'ui';

export function AdmissionPreviewFlyout() {
  const [isOpen, setIsOpen] = useState(false);
  const sections = [
    {
      title: 'Personal Details',
      fields: [
        { label: 'First Name', value: 'John' },
        { label: 'Middle Name', value: 'JD' },
        { label: 'Last Name', value: 'Doe' },
        { label: 'Date of birth', value: '12/09/1995' },
        { label: 'Gender', value: 'Male' },
        { label: 'Marital Status', value: 'Single' },
        { label: 'Phone Number', value: '+91-7373833328' },
        { label: 'Mobile Number', value: '+91-7373833328' },
        { label: 'Email', value: 'mtprabhusaravanan@gmail.com' },
        { label: 'Aadhar Card Number', value: '1234 5678 9875 2264' },
        { label: 'Mother Tongue', value: 'Tamil' },
        { label: 'Blood Group', value: 'O+' },
        { label: 'Religion', value: 'NA' },
        { label: 'Community', value: 'NA' },
        { label: 'Caste', value: 'NA' },
      ],
    },
    {
      title: 'Parents Details',
      fields: [
        { label: 'First Name', value: 'John' },
        { label: 'Middle Name', value: 'JD' },
        { label: 'Last Name', value: 'Doe' },
        { label: 'Date of birth', value: '12/09/1995' },
        { label: 'Gender', value: 'Male' },
        { label: 'Marital Status', value: 'Single' },
        { label: 'Phone Number', value: '+91-7373833328' },
        { label: 'Mobile Number', value: '+91-7373833328' },
        { label: 'Email', value: 'mtprabhusaravanan@gmail.com' },
        { label: 'Aadhar Card Number', value: '1234 5678 9875 2264' },
        { label: 'Mother Tongue', value: 'Tamil' },
        { label: 'Blood Group', value: 'O+' },
        { label: 'Religion', value: 'NA' },
        { label: 'Community', value: 'NA' },
        { label: 'Caste', value: 'NA' },
      ],
    },
  ];

  return (
    <Sheet open={isOpen}>
      <SheetTrigger onClick={() => setIsOpen(true)} asChild>
        <Button>Preview & Submit</Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        widthSize="lg"
        className="bg-gray-50 p-10"
        onCloseClick={() => setIsOpen(false)}
      >
        <SheetHeader>
          <SheetTitle className="flex items-center pb-6">
            <FileText size={18} className="text-primary" />
            <Text variant="lg-semibold" className="ml-3">
              Preview admission form
            </Text>
          </SheetTitle>
        </SheetHeader>
        <SheetDescription>
          {sections.map((section) => (
            <div key={section.title} className="mt-4 rounded-md bg-white p-6">
              <Text variant="sm-semibold">{section.title}</Text>
              <div className="mt-8 flex flex-wrap gap-12">
                {section.fields.map((field, index) => (
                  <div key={index}>
                    <label className="text-sm font-semibold text-gray-700">
                      {field.label}
                    </label>
                    <Text variant="base-regular">{field.value}</Text>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-6 flex justify-center gap-2">
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              size="sm"
              className="text-primary"
            >
              <FileEdit size={18} className="mr-2" />
              Edit
            </Button>
            <Button size="sm">
              <Check size={18} className="mr-2" />
              Submit
            </Button>
          </div>
        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
}
