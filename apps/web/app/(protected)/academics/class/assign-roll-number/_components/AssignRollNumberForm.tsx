'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useGetClassListQuery } from 'lib/queries/class/useGetClassListQuery';
import { useUpdateRollNumberMutationQuery } from 'lib/queries/roll-number/useUpdateRollNumbersMutationQuery';
import { useGetAllSectionByClassIdQuery } from 'lib/queries/section/useGetAllSectionsByClassIdQuery';
import { useGetStudentListBySectionIdQuery } from 'lib/queries/students/useGetStudentListBySectionIdQuery';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  Button,
  Checkbox,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';

export default function AssignRollNumberForm() {
  const page = 1;
  const limit = 999;
  const filter = {};
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [initialRollNumber, setInitialRollNumber] = useState(0);
  interface StudentFormData {
    students: Array<{
      studentId: string;
      id: string;
      firstName: string;
      lastName: string;
      rollNumber: string | number;
    }>;
  }

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<StudentFormData>({
    mode: 'onChange',
    defaultValues: {
      students: [],
    },
  });

  const { fields, append, remove } = useFieldArray<StudentFormData>({
    control,
    name: 'students',
  });

  const { data: classList } = useGetClassListQuery({
    page,
    limit,
    filter,
  });
  const { data: sectionList } = useGetAllSectionByClassIdQuery(
    {
      filter,
      classId,
    },
    {
      enabled: !!classId,
    }
  );
  const {
    isSuccess: isRollNumberUpdateSuccess,
    isPending: isPendingRollNumberUpdate,
    mutateAsync: updateRollNumberMutation,
  } = useUpdateRollNumberMutationQuery(classId, sectionId);

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleAutoFillRollNumber = () => {
    if (fields.length > 0) {
      fields.forEach((student, index) => {
        setValue(`students.${index}.rollNumber`, initialRollNumber + index);
      });
    }
  };

  const { data: studentLisTableRowesponse } = useGetStudentListBySectionIdQuery(
    sectionId,
    {
      enabled: !!sectionId,
    }
  );

  useEffect(() => {
    if (studentLisTableRowesponse) {
      // Clear existing fields before appending
      remove();

      studentLisTableRowesponse.forEach((student) => {
        append({
          studentId: student.id,
          id: student.academicDetails.id,
          firstName: student.firstName,
          lastName: student.lastName,
          rollNumber: student.academicDetails.rollNumber || '',
        });
      });
    }
  }, [studentLisTableRowesponse, append, remove]);

  const handleRollNumberFormSubmit = (data: StudentFormData) => {
    const changedStudents: StudentFormData = {
      students: data.students.filter((student) => {
        const originalStudent = studentLisTableRowesponse.find(
          (orig) => orig.id === student.studentId
        );

        return (
          originalStudent &&
          originalStudent.academicDetails.rollNumber !== student.rollNumber
        );
      }),
    };

    if (changedStudents.students.length > 0) {
      updateRollNumberMutation(changedStudents);
    }
  };

  const { toast } = useToast();
  useEffect(() => {
    if (isRollNumberUpdateSuccess) {
      toast({
        title: 'Success',
        variant: 'default',
        description: 'Roll Number Updated successfully',
      });
    }
  }, [isRollNumberUpdateSuccess, toast]);

  return (
    <>
      <section className="space-y-2 rounded-md bg-white p-6">
        <div className="flex gap-4">
          <div className="w-4/12">
            <label className="mt-1 block text-sm text-gray-700">Class</label>
            <Select
              autoComplete="off"
              onValueChange={(value) => {
                setClassId(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {classList?.data?.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="w-4/12">
            <label className="mt-1 block text-sm text-gray-700">Section</label>
            <Select
              autoComplete="off"
              onValueChange={(value) => {
                setSectionId(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All</SelectItem>
                  {sectionList?.data?.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-4/12 items-center">
            <div className="flex w-full items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isChecked ? 'checked' : 'unchecked'}
                  initial={{ y: 0 }}
                  animate={{
                    y: isChecked ? -10 : 0,
                    transition: { duration: 0.3 },
                  }}
                  className="flex w-full flex-col items-center space-x-4"
                >
                  <div className="flex items-center">
                    <Checkbox
                      className="me-2 items-center space-x-2 rounded border border-primary-500"
                      checked={isChecked}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <span>Auto Fill Roll Number</span>
                  </div>

                  <AnimatePresence>
                    {isChecked && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center space-x-2"
                      >
                        <Input
                          type="text"
                          placeholder="Enter the starting Number"
                          value={initialRollNumber}
                          onChange={(e) => {
                            setInitialRollNumber(Number(e.target.value));
                          }}
                        />
                        <Button
                          type="submit"
                          onClick={handleAutoFillRollNumber}
                        >
                          Apply
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-10 rounded-md bg-white p-6">
        {studentLisTableRowesponse && (
          <div className="overflow-hidden">
            <form onSubmit={handleSubmit(handleRollNumberFormSubmit)}>
              <Table>
                <TableHeader>
                  <TableRow className="cursor-pointer hover:bg-white">
                    <TableHead>Student Name</TableHead>

                    <TableHead>
                      <Button variant="ghost" className="px-0">
                        Roll Number
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        {student?.firstName + ' ' + student?.lastName}
                      </TableCell>
                      <TableCell>
                        <Input
                          className="mt-2"
                          type="text"
                          {...register(`students.${index}.rollNumber`, {
                            required: 'Roll number is required',
                          })}
                        />
                        {errors.students?.[index]?.rollNumber && (
                          <p className="text-red-500">
                            {errors.students[index]?.rollNumber?.message}
                          </p>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {isPendingRollNumberUpdate ? (
                <Button className="text-center" disabled type="button">
                  <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                  Please Wait...
                </Button>
              ) : (
                <Button className="text-center" type="submit">
                  Save
                </Button>
              )}
            </form>
          </div>
        )}
      </section>
    </>
  );
}
