'use client';

import { AssignStudentsToClassModel } from 'lib/domain/student';
import { useGetBatchesListQuery } from 'lib/queries/batches/useGetBatchesListQuery';
import { useGetClassByIdQuery } from 'lib/queries/class/useGetClassByIdQuery';
import { useGetGroupListQuery } from 'lib/queries/group/useGetGroupListQuery';
import { useGetAllSectionByClassIdQuery } from 'lib/queries/section/useGetAllSectionsByClassIdQuery';
import { useCreateStudentMutationByClassIdQuery } from 'lib/queries/students/useCreateStudentMutationByClassIdQuery';
import { useGetStudentListQuery } from 'lib/queries/useGetStudentListQuery';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Avatar,
  AvatarImage,
  Button,
  Checkbox,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'ui';
import { Table, TableBody, TableCell, TableRow } from 'ui/components/ui/Table';

export function AssignStudents() {
  const searchParams = useSearchParams();
  const { classId } = useParams<{ classId: string }>();

  const { watch, setValue, register, handleSubmit } = useForm();

  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;
  const pageSize = parseInt(searchParams.get('limit')) || 10;
  const filter = {};
  const {
    mutateAsync: mutateCreateStudentsAsync,
    isPending: isPendingAssignStudents,
  } = useCreateStudentMutationByClassIdQuery();

  const { data: sectionListResponse } = useGetAllSectionByClassIdQuery(
    { classId, filter },
    {
      enabled: !!classId,
    }
  );

  const { data: groupListResponse } = useGetGroupListQuery({
    page,
    limit,
    filter,
  });

  const { data: getStudentListResponse } = useGetStudentListQuery({
    page,
    pageSize,
  });

  const { data: batchesList } = useGetBatchesListQuery({
    page,
    limit,
    filter,
  });

  const { data: getClassByIdResponse } = useGetClassByIdQuery(classId, {
    enabled: !!classId,
  });
  const handleCheckboxChange = (studentId) => {
    setSelectedStudentIds((prevSelectedStudentIds) => {
      const updatedSelectedStudentIds = prevSelectedStudentIds.includes(
        studentId
      )
        ? prevSelectedStudentIds.filter((id) => id !== studentId)
        : [...prevSelectedStudentIds, studentId];

      updatedSelectedStudentIds.length > 0;
      return updatedSelectedStudentIds;
    });
  };
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const addSelectedStudent = (student) => {
    setSelectedStudents((prevSelectedStudents) => [
      ...prevSelectedStudents,
      student,
    ]);

    const updatedStudentList =
      getStudentListResponse?.data?.filter((s) => s.id !== student.id) || [];
    getStudentListResponse.data = updatedStudentList;
  };

  const handleAssign = () => {
    const selectedStudentsToAdd =
      getStudentListResponse?.data?.filter((student) =>
        selectedStudentIds.includes(student.id)
      ) || [];

    selectedStudentsToAdd.forEach((student) => addSelectedStudent(student));

    selectedStudentIds.forEach((id) => {
      const indexToRemove = getStudentListResponse.data.findIndex(
        (student) => student.id === id
      );
      if (indexToRemove !== -1) {
        getStudentListResponse.data.splice(indexToRemove, 1);
      }
    });
  };
  const handleDeselectAll = () => {
    const updatedStudentList = [
      ...(getStudentListResponse?.data || []),
      ...selectedStudents,
    ];
    setSelectedStudents([]);
    getStudentListResponse.data = updatedStudentList;
  };
  const handleRemoveSelected = () => {
    const updatedStudentList = [...(getStudentListResponse?.data || [])];
    const updatedSelectedStudents = selectedStudents.filter((student) => {
      if (selectedStudentIds.includes(student.id)) {
        updatedStudentList.push(student);
        return false;
      }
      return true;
    });
    setSelectedStudents(updatedSelectedStudents);
    setSelectedStudentIds([]);
    getStudentListResponse.data = updatedStudentList;
  };
  const handleRemoveStudent = (studentId) => {
    const removedStudent = selectedStudents.find(
      (student) => student.id === studentId
    );
    if (removedStudent) {
      const updatedSelectedStudents = selectedStudents.filter(
        (student) => student.id !== studentId
      );
      setSelectedStudents(updatedSelectedStudents);
      getStudentListResponse.data.push(removedStudent);
    }
  };
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);

    const allStudentIds =
      getStudentListResponse?.data?.map((student) => student.id) || [];

    setSelectedStudentIds(selectAll ? [] : allStudentIds);
    !selectAll;
  };

  useEffect(() => {
    register('sectionId');
  }, [register]);

  const assignStudent = async (payload: AssignStudentsToClassModel) => {
    const assignStudentPayload = {
      ...payload,
      classId: classId,
      studentIds: selectedStudents.map((x) => x.id),
    };
    await mutateCreateStudentsAsync(assignStudentPayload);
  };

  useEffect(() => {
    setValue('classId', classId);
  }, [classId, setValue]);
  return (
    <form onSubmit={handleSubmit(assignStudent)}>
      <section className="flex flex-col">
        <section className="flex justify-between gap-8">
          <section className="mr-2 mt-2 w-1/2 rounded-l-lg bg-zinc-50 p-4">
            <section className="p-2">
              <section className="mb-2 flex  justify-between overflow-x-auto rounded-md bg-white p-2">
                <Select
                  autoComplete="off"
                  {...register('classId', { required: true })}
                  value={classId}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('classId', value);
                    }
                  }}
                >
                  <SelectTrigger className=" basis-1/2">
                    <SelectValue
                      className="text-gray-400"
                      placeholder="Class Name"
                    >
                      {getClassByIdResponse?.name || 'Loading...'}
                    </SelectValue>
                    <ChevronDown className="text-gray-400" />
                  </SelectTrigger>
                  <SelectContent className="border border-primary-200">
                    {' '}
                    <SelectGroup>
                      <SelectItem key={classId} value={classId}>
                        {getClassByIdResponse?.name || 'Loading...'}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select
                  autoComplete="off"
                  {...register('sectionId', { required: true })}
                  value={watch('sectionId')}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('sectionId', value);
                    }
                  }}
                >
                  <SelectTrigger className="ml-4 basis-1/2">
                    <SelectValue
                      className="text-gray-400"
                      placeholder="Section"
                    />{' '}
                    <ChevronDown className="text-gray-400" />
                  </SelectTrigger>
                  <SelectContent className="border border-primary-200">
                    {' '}
                    <SelectGroup>
                      {sectionListResponse?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </section>
              <section className="mb-2 flex  justify-between overflow-x-auto rounded-md bg-white p-2">
                <Select
                  autoComplete="off"
                  {...register('groupId', { required: true })}
                  value={watch('groupId')}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('groupId', value);
                    }
                  }}
                >
                  <SelectTrigger className=" basis-1/2">
                    <SelectValue
                      className="text-gray-400"
                      placeholder="Group"
                    />{' '}
                    <ChevronDown className="text-gray-400" />
                  </SelectTrigger>
                  <SelectContent className="border border-primary-200">
                    {' '}
                    <SelectGroup>
                      {groupListResponse?.data?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select
                  autoComplete="off"
                  {...register('academicYear', { required: true })}
                  value={watch('academicYear')}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('academicYear', value);
                    }
                  }}
                >
                  <SelectTrigger className="ml-4 basis-1/2">
                    <SelectValue
                      className="text-gray-400"
                      placeholder="Academic year"
                    />{' '}
                    <ChevronDown className="text-gray-400" />
                  </SelectTrigger>
                  <SelectContent className="border border-primary-200">
                    {' '}
                    <SelectGroup>
                      {batchesList?.data?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </section>
            </section>
            <section className="flex justify-between p-2">
              <div className="mt-2 text-sm text-gray-800">All Students</div>
              <div className="flex">
                <Button variant="outline" className="h-8 px-2" type="button">
                  <Checkbox
                    className="mr-3 h-4 w-4  border-2 border-dashed"
                    onCheckedChange={handleSelectAll}
                  />
                  Select All
                </Button>
                {getStudentListResponse &&
                  getStudentListResponse.data.some((x) =>
                    selectedStudentIds.includes(x.id)
                  ) && (
                    <Button
                      className="ml-3 h-8 px-2"
                      onClick={handleAssign}
                      type="button"
                    >
                      Assign Selected
                    </Button>
                  )}
              </div>
            </section>
            <section>
              <Table>
                <TableBody>
                  {getStudentListResponse?.data?.map((student) => (
                    <TableRow key={student.id} className="py-0">
                      <TableCell className="py-0">
                        <div className="mb-2 flex items-center">
                          <Checkbox
                            className="mt-2"
                            onCheckedChange={() => {
                              handleCheckboxChange(student.id);
                            }}
                          />
                          <Avatar className="ml-3  mt-2 h-8 w-8 cursor-pointer ">
                            <AvatarImage src="https://png.pngtree.com/thumb_back/fh260/background/20230612/pngtree-man-wearing-glasses-is-wearing-colorful-background-image_2905240.jpg" />
                          </Avatar>
                          <div className="ml-4 mt-2">
                            <p className="font-semibold">{student.firstName}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="flex items-center justify-end p-1">
                        <Button
                          className="h-8 w-8 rounded-full p-0"
                          onClick={() => addSelectedStudent(student)}
                          type="button"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                  {(!getStudentListResponse ||
                    getStudentListResponse.data.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        <p>No Student found</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </section>
          </section>

          <section className="ml-2 mt-2 w-1/2 rounded-l-lg bg-zinc-50 p-4">
            <section className="flex justify-between p-2">
              <div className="mt-2 text-sm text-gray-800">
                Selected Students
              </div>
              <div className="flex">
                <Button
                  className="h-8 border border-red-500 bg-zinc-50 px-2 text-red-500 hover:bg-zinc-50"
                  onClick={handleDeselectAll}
                  type="button"
                >
                  <Checkbox className="mr-3 h-4 w-4  border-2 border-dashed border-red-500 data-[state=checked]:bg-red-500" />
                  Deselect All
                </Button>
                <Button
                  className="ml-3 h-8 border bg-red-500 px-2 text-white hover:bg-red-500"
                  onClick={handleRemoveSelected}
                  type="button"
                  style={{
                    display: selectedStudents.some((x) =>
                      selectedStudentIds.includes(x.id)
                    )
                      ? 'block'
                      : 'none',
                  }}
                >
                  Remove Selected
                </Button>
              </div>
            </section>
            <section>
              <Table>
                <TableBody>
                  {selectedStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="py-0">
                        <div className="mb-2 flex items-center">
                          <Checkbox
                            className="mt-2"
                            onCheckedChange={() => {
                              handleCheckboxChange(student.id);
                            }}
                            checked={selectedStudentIds.includes(student.id)}
                          />
                          <Avatar className="ml-3 mt-2 h-8 w-8 cursor-pointer">
                            <AvatarImage src="https://png.pngtree.com/thumb_back/fh260/background/20230612/pngtree-man-wearing-glasses-is-wearing-colorful-background-image_2905240.jpg" />
                          </Avatar>
                          <div className="ml-4 mt-2">
                            <p className="font-semibold">{student.firstName}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="flex items-center justify-end p-1">
                        <Button
                          className="h-8 w-8 rounded-full bg-red-500 p-0 hover:bg-red-500"
                          onClick={() => handleRemoveStudent(student.id)}
                          type="button"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </section>
          </section>
        </section>
        <div className="mt-8 flex items-center justify-center">
          <Button
            size="lg"
            variant="default"
            disabled={isPendingAssignStudents}
            aria-disabled={isPendingAssignStudents}
            className="mx-auto flex justify-center px-12 py-4"
          >
            {isPendingAssignStudents ? (
              <div className="flex items-center justify-center">Saving</div>
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </section>
    </form>
  );
}
