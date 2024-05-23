'use client';

// eslint-disable-next-line import/no-namespace
import * as Dialog from '@radix-ui/react-dialog';
import { Contact, Edit, Loader2, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Else, If, Then } from 'react-if';
import { Button, Text } from 'ui';

import { AddStaffModel } from '../../../../../lib/domain/staff';
import { useCreateStaffMutationQuery } from '../../../../../lib/queries/staff/useCreateStaffMutationQuery';
import { staffFormSectionType } from '../data/onboard-staff-fields';

type AddStaffPreviewModalProps = {
  open: boolean;
  formData: AddStaffModel;
  onOpenChange(open: boolean): void;
  formSections: staffFormSectionType[];
};

export function StaffPreviewModal({
  open,
  formData,
  formSections,
  onOpenChange,
}: AddStaffPreviewModalProps) {
  const router = useRouter();

  const { mutateAsync: createStaffMutationAsync, isPending: isCreatingStaff } =
    useCreateStaffMutationQuery();

  useEffect(() => {
    formSections.forEach((section) => {
      section.sectionFields.forEach((field) => {
        field.value =
          formData[field.name] == undefined ? 'N/A' : formData[field.name];
      });
    });
  }, [formData, formSections]);

  const handleOnSaveClick = async () => {
    try {
      const addStaffResponse = await createStaffMutationAsync({
        ...formData,
        differentlyAbled: Boolean(formData.differentlyAbled),
        dateOfJoining: new Date(formData.dateOfJoining),
        dateOfDetainment: new Date(formData.dateOfDetainment),
        dateOfRetirement: new Date(formData.dateOfRetirement),
        dateOfRegularization: new Date(formData.dateOfRegularization),
        passOutYear: new Date(formData.passOutYear),
        dateOfBirth: new Date(formData.dateOfBirth),
      });

      if (addStaffResponse) {
        router.push(`/staffs/list`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 backdrop-blur-sm backdrop-brightness-95" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] z-50 h-[85vh] w-[80vw] translate-x-[-50%] translate-y-[-50%]  rounded-[6px] bg-gray-50 p-[25px] focus:outline-none">
          <Dialog.Title className="flex items-center justify-between m-0">
            <section className="relative flex items-center">
              <section className="absolute top-0 bottom-0 left-0 flex items-center justify-center">
                <div className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-gray-300 text-primary">
                  <Contact className="w-5 h-5" />
                </div>
              </section>
              <Text className="ml-12" variant="base-medium">
                Preview
              </Text>
            </section>
            <Dialog.Close asChild>
              <Button
                variant="ghost"
                aria-label="Close"
                disabled={isCreatingStaff}
                aria-disabled={isCreatingStaff}
                onClick={() => onOpenChange?.(false)}
                className="w-8 h-8 p-2 bg-gray-400 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </Dialog.Close>
          </Dialog.Title>
          <Dialog.Description className="mb-5 mt-[10px] text-[15px] leading-normal">
            You&apos;re almost done! Take a moment to review the new
            Staff&apos;s information. If everything looks correct, click
            &apos;Submit&apos; to proceed.
          </Dialog.Description>
          <section className="max-h-[50vh] overflow-y-auto">
            {formSections.map((section) => (
              <div
                key={section.sectionTitle}
                className="p-6 mt-4 bg-white rounded-md"
              >
                <Text variant="sm-semibold">{section.sectionTitle}</Text>
                <div className="flex flex-wrap gap-12 mt-8">
                  {section.sectionFields.map((field) => (
                    <div key={field.name}>
                      <label className="text-sm font-semibold text-gray-700">
                        {field.label}
                      </label>
                      <Text variant="base-regular">
                        {formData[field.name] ? formData[field.name] : 'N/A'}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
          <section className="flex justify-center gap-4 mt-10">
            <Button
              variant="outline"
              disabled={isCreatingStaff}
              aria-disabled={isCreatingStaff}
              onClick={() => onOpenChange(false)}
            >
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                <Text variant="base-regular">Edit</Text>
              </div>
            </Button>
            <Button type="submit" variant="default" onClick={handleOnSaveClick}>
              <div className="flex items-center gap-2">
                <If condition={isCreatingStaff}>
                  <Then>
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </Then>
                  <Else>
                    <Save className="w-4 h-4" />
                  </Else>
                </If>
                <Text variant="base-regular">Submit</Text>
              </div>
            </Button>
          </section>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
