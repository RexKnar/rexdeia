'use client';

import { AssignStudentsToClassModel } from 'lib/domain/student';
import { useGetBatchesListQuery } from 'lib/queries/batches/useGetBatchesListQuery';
import { useGetClassListQuery } from 'lib/queries/class/useGetClassListQuery';
import { useGetGroupListQuery } from 'lib/queries/group/useGetGroupListQuery';
import { useGetAllSectionByClassIdQuery } from 'lib/queries/section/useGetAllSectionsByClassIdQuery';
import { useCreateStudentMutationByClassIdQuery } from 'lib/queries/students/useCreateStudentMutationByClassIdQuery';
import { useGetStudentListForAssignQuery } from 'lib/queries/students/useGetStudentListForAssignQuery';
import { ChevronDown, ChevronRight, Loader2, X } from 'lucide-react';
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

  const {
    watch,
    setValue,
    register,
    setError,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm();

  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;
  const filter = { isActive: true };
  const {
    isPending: isPendingAssignStudents,
    mutateAsync: mutateCreateStudentsAsync,
  } = useCreateStudentMutationByClassIdQuery();

  const [groupIdToGetStudent, setGroupIdToGetStudent] = useState('');
  const [classIdToGetStudent, setClassIdToGetStudent] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [deselectedStudentIds, setDeselectedStudentIds] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [studentListMaster, setStudentListMaster] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [allSelectedForDeselection, setAllSelectedForDeselection] =
    useState(false);

  useEffect(() => {
    if (classId) setClassIdToGetStudent(classId);
  }, [classId]);

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

  const { data: getStudentListResponse } = useGetStudentListForAssignQuery(
    classIdToGetStudent,
    groupIdToGetStudent,
    {
      enabled: !!classIdToGetStudent || !!groupIdToGetStudent,
    }
  );

  useEffect(() => {
    const selectedStudentsToAdd = getStudentListResponse?.filter((student) => {
      const studentIndex = selectedStudents.findIndex(
        (obj) => obj.id == student.id
      );

      if (studentIndex < 0) {
        return true;
      } else {
        return false;
      }
    });

    setStudentListMaster(selectedStudentsToAdd);
  }, [getStudentListResponse, selectedStudents]);

  const { data: batchesList } = useGetBatchesListQuery({
    page,
    limit,
    filter,
  });

  const { data: getAllClassListResponse } = useGetClassListQuery({
    page,
    limit,
    filter,
  });

  const handleActualStudentCheckboxChange = (studentId) => {
    setSelectedStudentIds((prevSelectedStudentIds) => {
      const updatedSelectedStudentIds = prevSelectedStudentIds.includes(
        studentId
      )
        ? prevSelectedStudentIds.filter((id) => id !== studentId)
        : [...prevSelectedStudentIds, studentId];

      return updatedSelectedStudentIds;
    });
  };

  const handleSelectedStudentCheckboxChange = (studentId) => {
    setDeselectedStudentIds((prevSelectedStudentIds) => {
      const updatedSelectedStudentIds = prevSelectedStudentIds.includes(
        studentId
      )
        ? prevSelectedStudentIds.filter((id) => id !== studentId)
        : [...prevSelectedStudentIds, studentId];

      return updatedSelectedStudentIds;
    });
  };

  const addSelectedStudent = (student) => {
    setSelectedStudents((prevSelectedStudents) => [
      ...prevSelectedStudents,
      student,
    ]);
  };

  const handleBulkAssign = () => {
    const selectedStudentsToAdd = studentListMaster?.filter((student) => {
      if (selectedStudentIds.includes(student.id)) return student;
    });

    setSelectedStudents([...selectedStudents, ...selectedStudentsToAdd]);

    setStudentListMaster((prevMaster) =>
      prevMaster.filter((student) => !selectedStudentIds.includes(student.id))
    );

    setSelectedStudentIds([]);
    setSelectAll(false);
  };

  useEffect(() => {
    const selectedStudentsToAdd = getStudentListResponse?.filter((student) => {
      const studentIndex = selectedStudents.findIndex(
        (obj) => obj.id == student.id
      );
      if (studentIndex < 0) {
        return student;
      } else {
        return null;
      }
    });

    setStudentListMaster(selectedStudentsToAdd);
  }, [selectedStudents, getStudentListResponse]);

  const handleDeselectAll = (checked: boolean) => {
    const allIds = selectedStudents.map((s) => s.id);
    if (checked) {
      setDeselectedStudentIds(allIds);
    } else {
      setDeselectedStudentIds([]);
    }
  };

  useEffect(() => {
    const allStudentIdsInSelectedList = selectedStudents.map((s) => s.id);
    setAllSelectedForDeselection(
      allStudentIdsInSelectedList.length > 0 &&
        allStudentIdsInSelectedList.every((id) =>
          deselectedStudentIds.includes(id)
        )
    );
  }, [selectedStudents, deselectedStudentIds]);

  const handleRemoveSelected = () => {
    const updated = selectedStudents.filter(
      (student) => !deselectedStudentIds.includes(student.id)
    );
    setSelectedStudents(updated);
    setDeselectedStudentIds([]);
    setAllSelectedForDeselection(false);
  };

  const handleRemoveStudent = (studentId) => {
    const updatedSelectedStudents = selectedStudents.filter(
      (student) => student.id !== studentId
    );
    setSelectedStudents(updatedSelectedStudents);
    setDeselectedStudentIds((prev) => prev.filter((id) => id !== studentId));
  };

  const handleSelectAll = () => {
    const allStudentIds = studentListMaster?.map((student) => student.id) || [];

    const shouldSelectAll = !selectAll;

    setSelectAll(shouldSelectAll);
    setSelectedStudentIds(shouldSelectAll ? allStudentIds : []);
  };
  useEffect(() => {
    const allStudentIds = studentListMaster?.map((s) => s.id) || [];
    setSelectAll(
      allStudentIds.length > 0 &&
        allStudentIds.every((id) => selectedStudentIds.includes(id))
    );
  }, [selectedStudentIds, studentListMaster]);

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

    setSelectedStudents([]);
    setSelectedStudentIds([]);
    setDeselectedStudentIds([]);
    setSelectAll(false);
    setAllSelectedForDeselection(false);
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
              <section className="mb-2 flex justify-between overflow-x-auto rounded-md bg-white p-2">
                <Select
                  defaultValue={classId}
                  autoComplete="off"
                  onValueChange={(value) => {
                    if (value) {
                      setClassIdToGetStudent(value);
                    }
                  }}
                >
                  <SelectTrigger className=" basis-1/2">
                    <SelectValue
                      className="text-gray-400"
                      placeholder="Class"
                    ></SelectValue>
                    <ChevronDown className="text-gray-400" />
                  </SelectTrigger>
                  <SelectContent className="border border-primary-200">
                    {' '}
                    <SelectGroup>
                      {getAllClassListResponse?.data?.map((classDetails) => (
                        <SelectItem
                          key={classDetails.id}
                          value={classDetails.id}
                        >
                          {classDetails.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select
                  autoComplete="off"
                  onValueChange={(value) => {
                    if (value) {
                      setGroupIdToGetStudent(value);
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
              </section>
            </section>
            <section className="flex justify-between p-2">
              <div className="mt-2 text-sm text-gray-800">All Students</div>
              <div className="border-input hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring ring-offset-background inline-flex h-8 items-center justify-center rounded-md border border-primary px-2 text-sm font-medium text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                <Checkbox
                  className="mr-3 h-4 w-4 border-2 border-dashed"
                  onCheckedChange={handleSelectAll}
                  checked={selectAll}
                  id="selectAllStudentsAssign"
                />
                <label htmlFor="selectAllStudentsAssign">Select All</label>
              </div>
              {studentListMaster &&
                studentListMaster.some((x) =>
                  selectedStudentIds.includes(x.id)
                ) && (
                  <Button
                    className="ml-3 h-8 px-2"
                    onClick={handleBulkAssign}
                    type="button"
                  >
                    Assign Selected
                  </Button>
                )}
            </section>
            <section>
              <Table>
                <TableBody>
                  {studentListMaster?.map((student) => (
                    <TableRow key={student.id} className="py-0">
                      <TableCell className="py-0">
                        <div className="mb-2 flex items-center">
                          <Checkbox
                            className="mt-2"
                            checked={selectedStudentIds.includes(student.id)}
                            onCheckedChange={() => {
                              handleActualStudentCheckboxChange(student.id);
                            }}
                          />
                          <Avatar className="ml-3 mt-2 h-8 w-8 cursor-pointer ">
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

                  {(!studentListMaster || studentListMaster.length === 0) && (
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
            <section className="p-2">
              <section className="mb-2 flex justify-between rounded-md bg-white p-2">
                <div className=" basis-1/2">
                  <Select
                    autoComplete="off"
                    disabled
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
                        placeholder="Class"
                      ></SelectValue>
                      <ChevronDown className="text-gray-400" />
                    </SelectTrigger>
                    <SelectContent className="border border-primary-200">
                      {' '}
                      <SelectGroup>
                        {getAllClassListResponse?.data?.map((classDetails) => (
                          <SelectItem
                            key={classDetails.id}
                            value={classDetails.id}
                          >
                            {classDetails.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className=" basis-1/2">
                  <Select
                    autoComplete="off"
                    {...register('sectionId', {
                      required: ' Section is Required',
                    })}
                    value={watch('sectionId')}
                    onValueChange={(value) => {
                      if (value) {
                        setValue('sectionId', value);
                      } else {
                        setError('sectionId', {
                          type: 'manual',
                          message: 'Section is required',
                        });
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
                        {sectionListResponse?.data?.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>

                    {fieldErrors.sectionId && (
                      <p className="ml-4 text-red-500">
                        {fieldErrors.sectionId.message.toString()}
                      </p>
                    )}
                  </Select>
                </div>
              </section>
              <section className="mb-2 flex justify-between rounded-md bg-white p-2">
                <div className=" basis-1/2">
                  <Select
                    autoComplete="off"
                    {...register('groupId', {
                      required: 'Group is Required',
                    })}
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
                    {fieldErrors.groupId && (
                      <p className="text-red-500">
                        {fieldErrors.groupId.message.toString()}
                      </p>
                    )}
                  </Select>
                </div>
                <div className=" basis-1/2">
                  <Select
                    autoComplete="off"
                    {...register('academicYear', {
                      required: 'Academic year is Required',
                    })}
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
                  {fieldErrors.academicYear && (
                    <p className="ml-4 text-red-500 ">
                      {fieldErrors.academicYear.message.toString()}
                    </p>
                  )}
                </div>
              </section>
            </section>
            <section className="flex justify-between p-2">
              <div className="mt-2 text-sm text-gray-800">
                Selected Students
              </div>
              <div className="flex">
                <div className="inline-flex h-8 items-center justify-center rounded-md border border-red-500 bg-zinc-50 px-2 text-sm font-medium text-red-500 transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                  <Checkbox
                    className="mr-3 h-4 w-4  border-2 border-dashed border-red-500 data-[state=checked]:bg-red-500"
                    checked={allSelectedForDeselection}
                    onCheckedChange={handleDeselectAll}
                    id="deselectAllStudentsAssign"
                  />
                  <label htmlFor="deselectAllStudentsAssign">
                    Deselect All
                  </label>
                </div>
                {selectedStudents &&
                  selectedStudents.some((x) =>
                    deselectedStudentIds.includes(x.id)
                  ) && (
                    <Button
                      className="ml-3 h-8 border bg-red-500 px-2 text-white hover:bg-red-500"
                      onClick={handleRemoveSelected}
                      type="button"
                    >
                      Remove Selected
                    </Button>
                  )}
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
                              handleSelectedStudentCheckboxChange(student.id);
                            }}
                            checked={deselectedStudentIds.includes(student.id)}
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
            <div className="mt-8 flex items-center justify-center">
              <Button
                size="lg"
                variant="default"
                disabled={isPendingAssignStudents}
                aria-disabled={isPendingAssignStudents}
                className="mx-auto flex justify-center px-12 py-4"
              >
                {isPendingAssignStudents ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                    Saving
                  </div>
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          </section>
        </section>
      </section>
    </form>
  );
}
