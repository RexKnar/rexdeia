'use client';
/* eslint-disable react-hooks/exhaustive-deps */
import { PromoteStudentsToNewClassModel } from 'lib/domain/student';
import { useGetBatchesListQuery } from 'lib/queries/batches/useGetBatchesListQuery';
import { useGetClassListQuery } from 'lib/queries/class/useGetClassListQuery';
import { useGetGroupListQuery } from 'lib/queries/group/useGetGroupListQuery';
import { useGetMediumListQuery } from 'lib/queries/medium/useGetMediumListQuery';
import { useUpdateStudentStatusMutation } from 'lib/queries/promotion/useUpdateStudentStatusMutationQuery';
import { useGetAllSectionByClassIdQuery } from 'lib/queries/section/useGetAllSectionsByClassIdQuery';
import { useGetStudentListForPromoteQuery } from 'lib/queries/students/useGetStudentListForPromoteQuery';
import { usePromoteStudentsMutationQuery } from 'lib/queries/students/usePromoteStudentMutationQuery';
import { ChevronDown, ChevronRight, Loader2, X } from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  useToast,
} from 'ui';
import { Table, TableBody, TableCell, TableRow } from 'ui/components/ui/Table';

export function AssignPromotion() {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState('promote');
  const { classId } = useParams<{ classId: string }>();
  const [remark, setRemark] = useState('');
  const { toast } = useToast();
  const { data: session } = useSession();
  const academicYearId =
    searchParams.get('academicYearId') || session?.currentBatch;

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
  } = usePromoteStudentsMutationQuery();

  const [groupIdToGetStudent, setGroupIdToGetStudent] = useState('');
  const [statusToGetStudent, setStatusToGetStudent] = useState('');
  const [classIdToGetStudent, setClassIdToGetStudent] = useState('');
  const [sectionIdToGetStudent, setSectionIdToGetStudent] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [deselectedStudentIds, setDeselectedStudentIds] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [studentListMaster, setStudentListMaster] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  // const [requestAcademicYearId, setAcademicYearId] = useState();

  useEffect(() => {
    if (classId) setClassIdToGetStudent(classId);
  }, [classId]);

  useEffect(() => {
    setValue('classId', classId);
  }, [classId, setValue]);

  const { data: sectionListResponse } = useGetAllSectionByClassIdQuery(
    {
      classId: classIdToGetStudent,
      filter: {
        ...filter,
        academicYearId: academicYearId,
      },
    },
    { enabled: !!classIdToGetStudent }
  );

  const { data: promotionSectionList } = useGetAllSectionByClassIdQuery(
    {
      classId: watch('classId'),
      filter: {
        isActive: true,
        academicYearId: watch('academicYear'),
      },
    },
    {
      enabled: !!watch('classId') && !!watch('academicYear'),
    }
  );

  const { data: groupListResponse } = useGetGroupListQuery({
    page,
    limit,
    filter,
  });

  const { data: getStudentListResponse } = useGetStudentListForPromoteQuery(
    classIdToGetStudent,
    sectionIdToGetStudent,
    groupIdToGetStudent,
    statusToGetStudent,
    {
      enabled:
        !!classIdToGetStudent ||
        !!sectionIdToGetStudent ||
        !!groupIdToGetStudent ||
        !!statusToGetStudent,
    }
  );
  useEffect(() => {
    const availableStudents = getStudentListResponse?.filter(
      ({ student }: any) => {
        return !selectedStudents.some(
          (selected) => selected.student.id === student.id
        );
      }
    );
    setStudentListMaster(availableStudents || []);
  }, [getStudentListResponse, selectedStudents]);

  const { data: allBatchesList } = useGetBatchesListQuery({
    page,
    limit,
    filter,
  });
  const batchesList = allBatchesList?.data?.filter(
    (batch) => batch.id !== academicYearId
  );

  const { data: getAllClassListResponse } = useGetClassListQuery({
    page,
    limit,
    filter,
  });
  const { data: mediumListResponse } = useGetMediumListQuery({
    page,
    limit,
    filter,
  });
  const { mutateAsync: updateStudentStatus } = useUpdateStudentStatusMutation();

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
    if (!selectedStudents.some((s) => s.student.id === student.student.id)) {
      setSelectedStudents((prevSelectedStudents) => [
        ...prevSelectedStudents,
        student,
      ]);
    }
  };

  const handleBulkAssign = () => {
    const studentsToMove = studentListMaster?.filter((student) => {
      return selectedStudentIds.includes(student.student.id);
    });

    setSelectedStudents((prevSelectedStudents) => [
      ...prevSelectedStudents,
      ...studentsToMove,
    ]);

    setStudentListMaster((prevStudentListMaster) =>
      prevStudentListMaster.filter(
        (student) => !selectedStudentIds.includes(student.student.id)
      )
    );

    setSelectedStudentIds([]);
    setSelectAll(false);
  };

  const handleDeselectAll = (checked: boolean) => {
    if (checked) {
      setDeselectedStudentIds(selectedStudents.map((s) => s.student.id));
    } else {
      setDeselectedStudentIds([]);
    }
  };

  const handleRemoveSelected = () => {
    const updatedSelectedStudents = selectedStudents.filter((student) => {
      return !deselectedStudentIds.includes(student.student.id);
    });
    setSelectedStudents(updatedSelectedStudents);
    setDeselectedStudentIds([]);
  };

  const handleRemoveStudent = (studentId) => {
    const studentToRemove = selectedStudents.find(
      (student) => student.student.id === studentId
    );
    if (studentToRemove) {
      const updatedSelectedStudents = selectedStudents.filter(
        (student) => student.student.id !== studentId
      );
      setSelectedStudents(updatedSelectedStudents);
      setDeselectedStudentIds((prev) => prev.filter((id) => id !== studentId));
    }
  };

  const handleSelectAll = () => {
    const newSelectAllState = !selectAll;
    setSelectAll(newSelectAllState);

    const allStudentIds =
      studentListMaster?.map((student) => student.student.id) || [];
    setSelectedStudentIds(newSelectAllState ? allStudentIds : []);
  };

  useEffect(() => {
    register('sectionId');
  }, [register]);

  const assignStudent = async (payload: PromoteStudentsToNewClassModel) => {
    const assignStudentPayload = {
      ...payload,
      classId: watch('classId'),
      sectionId: watch('sectionId'),
      groupId: watch('groupId'),
      academicYear: watch('academicYear'),
      mediumId: watch('mediumId'),
      studentIds: selectedStudents.map((x) => x.student.id),
    };
    try {
      await mutateCreateStudentsAsync(assignStudentPayload);
      toast({
        title: 'Success',
        description: 'Students promoted successfully',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong during promotion',
        variant: 'destructive',
      });
    }
  };

  const handleArchiveStudents = async () => {
    const studentIds = selectedStudents.map((x) => x.student.id);

    if (studentIds.length === 0) return;

    await updateStudentStatus({
      studentIds,
      data: {
        isCurrent: false,
        remark,
      },
    });
    setSelectedStudents([]);
    setSelectedStudentIds([]);
    setDeselectedStudentIds([]);
    setSelectAll(false);
    setRemark('');
  };

  return (
    <form onSubmit={handleSubmit(assignStudent)}>
      <section className="flex flex-col">
        <section className="flex justify-between gap-8">
          <section className="mr-2 mt-2 w-1/2 rounded-l-lg bg-zinc-50 p-4">
            <section className="p-2">
              <section className="mb-2 flex justify-between rounded-md bg-white p-2">
                <div className=" basis-1/2">
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
                            key={`classList_section_${classDetails.id}`}
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
                      required: 'Section is Required',
                    })}
                    onValueChange={(value) => {
                      if (value) {
                        setSectionIdToGetStudent(value);
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
                          <SelectItem
                            key={`sectionList_left_${item.id}`}
                            value={item.id}
                          >
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </section>
              <section className="mb-2 flex justify-between rounded-md bg-white p-2">
                <div className=" basis-1/2">
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
                </div>
                <div className="basis-1/2">
                  <Select
                    value={watch('action')}
                    onValueChange={(value) => {
                      if (value) {
                        setValue('action', value);
                        setStatusToGetStudent(value);
                      } else {
                        setError('action', {
                          type: 'manual',
                          message: 'Action is required',
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="ml-4 w-full border-gray-300">
                      <SelectValue
                        placeholder="Select Action"
                        className="text-gray-500"
                      />
                      <ChevronDown className="ml-auto text-gray-400" />
                    </SelectTrigger>
                    <SelectContent className="border border-gray-200 shadow-md">
                      <SelectGroup>
                        <SelectItem value="current">Current</SelectItem>
                        <SelectItem value="archive">Archive</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                    {fieldErrors?.action && (
                      <p className="ml-4 mt-1 text-sm text-red-500">
                        {fieldErrors.action.message.toString()}
                      </p>
                    )}
                  </Select>
                </div>
              </section>
              <section className="mb-2 flex flex-wrap items-center justify-evenly gap-4 rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
                <p className="text-base font-medium text-gray-700">
                  Total Students:{' '}
                  <span className="font-semibold text-blue-600">
                    {studentListMaster.length + selectedStudents.length}
                  </span>
                </p>
                <p className="text-base font-medium text-gray-700">
                  Selected:{' '}
                  <span className="font-semibold text-green-600">
                    {selectedStudents.length}
                  </span>
                </p>
                <p className="text-base font-medium text-gray-700">
                  Pending:{' '}
                  <span className="font-semibold text-orange-500">
                    {studentListMaster.length - selectedStudentIds.length}
                  </span>
                </p>
              </section>
            </section>
            <section className="flex justify-between p-2">
              <div className="mt-2 text-sm text-gray-800">All Students</div>
              <div className="flex">
                <div className="border-input hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring ring-offset-background inline-flex h-8 items-center justify-center rounded-md border border-primary px-2 text-sm font-medium text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                  <Checkbox
                    className="mr-3 h-4 w-4 border-2 border-dashed"
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                  />
                  Select All
                </div>
                {studentListMaster &&
                  studentListMaster.some((x) =>
                    selectedStudentIds.includes(x.student.id)
                  ) && (
                    <Button
                      className="ml-3 h-8 px-2"
                      onClick={handleBulkAssign}
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
                  {studentListMaster?.map((student, index) => (
                    <TableRow
                      key={`studentRow_${student.student.id}_${index}`}
                      className="py-0"
                    >
                      <TableCell className="py-0">
                        <div className="mb-2 flex items-center">
                          <Checkbox
                            className="mt-2"
                            onCheckedChange={() => {
                              handleActualStudentCheckboxChange(
                                student.student.id
                              );
                            }}
                            checked={selectedStudentIds.includes(
                              student.student.id
                            )}
                          />
                          <Avatar className="ml-3 mt-2 h-8 w-8 cursor-pointer ">
                            <AvatarImage src={student.student.profileImage} />
                            <AvatarFallback className="bg-red-300">
                              {student.student.firstName
                                .charAt(0)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-4 mt-2">
                            <p className="font-semibold">
                              {student.student.firstName}
                              {student.student.middleName}
                              {student.student.lastName}
                            </p>
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
            <RadioGroup
              value={selected}
              onValueChange={setSelected}
              defaultValue="promote"
              className="mb-5 flex justify-evenly gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="promote" id="promote" />
                <label htmlFor="promote" className="text-black">
                  Promote
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="archive" id="archive" />
                <label htmlFor="archive" className="text-black">
                  Archive
                </label>
              </div>
            </RadioGroup>
            {selected === 'promote' && (
              <>
                <section className="p-2">
                  <section className="mb-2 flex justify-between gap-5 rounded-md bg-white p-2">
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
                            {batchesList?.map((item) => (
                              <SelectItem
                                key={`batchList_${item.id}`}
                                value={item.id}
                              >
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                        {fieldErrors.academicYear && (
                          <p className="ml-4 text-red-500 ">
                            {fieldErrors.academicYear.message.toString()}
                          </p>
                        )}
                      </Select>
                    </div>
                    <div className=" basis-1/2">
                      <Select
                        autoComplete="off"
                        {...register('classId', {
                          required: 'Class is Required',
                        })}
                        value={watch('classId')}
                        onValueChange={(value) => {
                          if (value) {
                            setValue('classId', value);
                          } else {
                            setError('classId', {
                              type: 'manual',
                              message: 'Class is required',
                            });
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
                            {getAllClassListResponse?.data?.map(
                              (classDetails) => (
                                <SelectItem
                                  key={`classList_${classDetails.id}`}
                                  value={classDetails.id}
                                >
                                  {classDetails.name}
                                </SelectItem>
                              )
                            )}
                          </SelectGroup>
                        </SelectContent>
                        {fieldErrors.classId && (
                          <p className="ml-4 text-red-500">
                            {fieldErrors.classId.message.toString()}
                          </p>
                        )}
                      </Select>
                    </div>
                  </section>
                  <section className="mb-2 flex justify-between rounded-md bg-white p-2">
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
                            {promotionSectionList?.data?.map((item) => (
                              <SelectItem
                                key={`sectionList_${item.id}`}
                                value={item.id}
                              >
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {fieldErrors.sectionId && (
                        <p className="ml-4 text-red-500">
                          {fieldErrors.sectionId.message.toString()}
                        </p>
                      )}
                    </div>
                    <div className=" basis-1/2">
                      <Select
                        autoComplete="off"
                        {...register('groupId', {
                          required: 'Group is  Required',
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
                              <SelectItem
                                key={`groupList_${item.id}`}
                                value={item.id}
                              >
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
                  </section>
                  <section className="mb-2 flex justify-between rounded-md bg-white p-2">
                    <div className=" basis-1/2">
                      <Select
                        autoComplete="off"
                        {...register('mediumId', {
                          required: 'Medium is  Required',
                        })}
                        value={watch('mediumId')}
                        onValueChange={(value) => {
                          if (value) {
                            setValue('mediumId', value);
                          }
                        }}
                      >
                        <SelectTrigger className=" basis-1/2">
                          <SelectValue
                            className="text-gray-400"
                            placeholder="Medium"
                          />{' '}
                          <ChevronDown className="text-gray-400" />
                        </SelectTrigger>
                        <SelectContent className="border border-primary-200">
                          {' '}
                          <SelectGroup>
                            {mediumListResponse?.data?.map((item) => (
                              <SelectItem
                                key={`mediumList_${item.id}`}
                                value={item.id}
                              >
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                        {fieldErrors.mediumId && (
                          <p className="text-red-500">
                            {fieldErrors.mediumId.message.toString()}
                          </p>
                        )}
                      </Select>
                    </div>
                  </section>
                </section>
                <section className="flex justify-between p-2">
                  <div className="mt-2 text-sm text-gray-800">
                    Selected Students
                  </div>
                  <div className="flex">
                    <div className="border-input hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring ring-offset-background inline-flex h-8 items-center justify-center rounded-md border border-red-500 bg-zinc-50 px-2 text-sm font-medium text-red-500 transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                      <Checkbox
                        checked={
                          deselectedStudentIds.length ===
                            selectedStudents.length &&
                          selectedStudents.length > 0
                        }
                        onCheckedChange={handleDeselectAll}
                        className="mr-3 h-4 w-4  border-2 border-dashed border-red-500 data-[state=checked]:bg-red-500"
                      />
                      Deselect All
                    </div>
                    {selectedStudents &&
                      selectedStudents.some((x) =>
                        deselectedStudentIds.includes(x.student.id)
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
              </>
            )}
            {selected === 'archive' && (
              <>
                <Textarea
                  className="w-full rounded-md border border-gray-400 p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder="Enter the reason..."
                  onChange={(e) => setRemark(e.target.value)}
                />
                <section className="flex justify-between p-2">
                  <div className="mt-2 text-sm text-gray-800">
                    Selected Students
                  </div>
                  <div className="flex">
                    <div className="border-input hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring ring-offset-background inline-flex h-8 items-center justify-center rounded-md border border-red-500 bg-zinc-50 px-2 text-sm font-medium text-red-500 transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                      <Checkbox
                        checked={
                          deselectedStudentIds.length ===
                            selectedStudents.length &&
                          selectedStudents.length > 0
                        }
                        onCheckedChange={handleDeselectAll}
                        className="mr-3 h-4 w-4  border-2 border-dashed border-red-500 data-[state=checked]:bg-red-500"
                      />
                      Deselect All
                    </div>
                    {selectedStudents &&
                      selectedStudents.some((x) =>
                        deselectedStudentIds.includes(x.student.id)
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
              </>
            )}
            <section>
              <Table>
                <TableBody>
                  {selectedStudents.map((student, index) => (
                    <TableRow key={`${student.student.id}-${index}`}>
                      <TableCell className="py-0">
                        <div className="mb-2 flex items-center">
                          <Checkbox
                            className="mt-2"
                            onCheckedChange={() => {
                              handleSelectedStudentCheckboxChange(
                                student.student.id
                              );
                            }}
                            checked={deselectedStudentIds.includes(
                              student.student.id
                            )}
                          />
                          <Avatar className="ml-3 mt-2 h-8 w-8 cursor-pointer ">
                            <AvatarImage src={student.student.profileImage} />
                            <AvatarFallback className="bg-red-300">
                              {student.student.firstName
                                .charAt(0)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-4 mt-2">
                            <p className="font-semibold">
                              {student.student.firstName}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="flex items-center justify-end p-1">
                        <Button
                          className="h-8 w-8 rounded-full bg-red-500 p-0 hover:bg-red-500"
                          onClick={() =>
                            handleRemoveStudent(student.student.id)
                          }
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
            {selected === 'archive' && selectedStudents.length > 0 && (
              <Button
                size="lg"
                variant="default"
                disabled={isPendingAssignStudents}
                aria-disabled={isPendingAssignStudents}
                className="mx-auto flex justify-center px-12 py-4"
                onClick={handleArchiveStudents}
              >
                {isPendingAssignStudents ? 'Archiving...' : 'Archive'}
              </Button>
            )}
            {selected === 'promote' && selectedStudents.length > 0 && (
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
            )}
          </section>
        </section>
      </section>
    </form>
  );
}
