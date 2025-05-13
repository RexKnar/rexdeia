'use client';
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useGetInstituteCourseDetailByIdQuery } from 'lib/queries/institute/course/useGetInstituteCourseDetailByIdQuery';
import { useUpdateCourseMutationQuery } from 'lib/queries/institute/course/useUpdateCourseMutationQuery';
import { useGetLanguageListQuery } from 'lib/queries/language/useGetLanguageListQurey';
import { Camera, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
  Textarea,
} from 'ui';

import SortableFAQItem from './SortableFAQItem';

const initialFaqs = [
  {
    id: 'faq-1',
    question: 'What is this course about?',
    answer:
      'This course covers essential topics to help learners understand and master the subject in a structured way.',
  },
  {
    id: 'faq-2',
    question: 'Do I need any prior knowledge?',
    answer:
      'No prior experience is required. We start from the basics and gradually move to advanced topics.',
  },
  {
    id: 'faq-3',
    question: 'Will I get a certificate?',
    answer:
      'Yes, you will receive a certificate upon successful completion of the course.',
  },
];

export default function CourseSettings() {
  const [faqs, setFaqs] = useState(initialFaqs);
  const [openId, setOpenId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));
  const searchParams = useSearchParams();
  const routeParams = useParams<{
    courseId: string;
    chapterItemId: string;
  }>();
  const courseId = searchParams.get('courseId') || routeParams.courseId;
  const [languageList, setLanguageList] = useState([]);

  const {
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { errors: fieldErrors },
  } = useForm({
    defaultValues: {
      courseName: '',
      description: '',
      price: '',
      discountPrice: '',
      languageId: '',
      isActive: false,
    },
  });
  const {
    isPending: isPendingUpdateCourse,
    mutateAsync: mutateUpdateCourseAsync,
  } = useUpdateCourseMutationQuery(courseId);

  const { data: getLanguageListResponse } = useGetLanguageListQuery();
  useEffect(() => {
    if (getLanguageListResponse) {
      setLanguageList(getLanguageListResponse as any[]);
    }
  }, [getLanguageListResponse]);

  const UpdateCourse = async (payload) => {
    try {
      const requestPayload = payload;
      await mutateUpdateCourseAsync(requestPayload);
    } catch (error) {
      console.error(error);
    }
  };
  const { data: courseDetail, isLoading: isCourseDetailLoading } =
    useGetInstituteCourseDetailByIdQuery(courseId);

  useEffect(() => {
    if (courseDetail) {
      setValue('courseName', courseDetail.courseName);
      setValue('description', courseDetail.description);
      setValue('price', courseDetail.price);
      setValue('discountPrice', courseDetail.discountPrice);
      setValue('languageId', courseDetail.languageId);
    }
  }, [courseDetail]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = faqs.findIndex((item) => item.id === active.id);
      const newIndex = faqs.findIndex((item) => item.id === over?.id);
      setFaqs(arrayMove(faqs, oldIndex, newIndex));
    }
  };
  const handleAddFAQ = () => {
    const newId = `faq-${Date.now()}`;
    setFaqs([
      ...faqs,
      {
        id: newId,
        question: 'New Question',
        answer: 'New answer goes here...',
      },
    ]);
    setOpenId(newId);
  };
  return (
    <section className="mt-10 grid w-full grid-cols-11 justify-start gap-2">
      <section className="relative col-span-3">
        <Card className="sticky top-0 w-72 rounded-md bg-white">
          <CardHeader>
            <div className="relative flex items-center justify-center rounded-md bg-gray-100 ">
              <label className="absolute right-2 top-2 z-50 cursor-pointer rounded-full bg-white p-2 shadow-lg transition-colors hover:bg-gray-100">
                <Camera className="h-5 w-5" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  // onChange={handleImageUpload}
                />
              </label>
              <div className="relative">
                {!isCourseDetailLoading ? (
                  <span>
                    {courseDetail?.coverImage ? (
                      <Image
                        src={`${courseDetail?.coverImage}`}
                        objectFit="cover"
                        layout="fill"
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-auto min-h-60 w-full items-center justify-center bg-gray-200">
                        <span className="text-xl font-bold">
                          {courseDetail.courseName[0] || 'C'}
                        </span>
                      </div>
                    )}
                  </span>
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center bg-gray-200">
                    <span className="text-normal font-bold">Uploading...</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="mt-5 pl-3 ">
              <div className="ml-5 grid grid-cols-3 ">
                <Text className="w-18 pt-1 text-xs text-gray-800">
                  {'Learners'}
                </Text>
              </div>
              <div className="ml-5 grid grid-cols-3 pt-3 ">
                <Text className="w-18 pt-1 text-xs text-gray-800">
                  {'Completed'}
                </Text>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      <section className="col-span-8">
        <Tabs defaultValue="pricing" className="border-0 ">
          <TabsList className="w-full justify-start border-b-2 border-gray-100">
            <TabsTrigger
              value="pricing"
              className="mr-2 text-base focus:border-b-4 focus:border-primary"
            >
              Pricing
            </TabsTrigger>

            <TabsTrigger
              value="seo"
              className="mr-2 text-base focus:border-b-4 focus:border-primary"
            >
              SEO
            </TabsTrigger>

            <TabsTrigger
              value="faq"
              className="mr-2 text-base focus:border-b-4 focus:border-primary"
            >
              FAQ
            </TabsTrigger>
          </TabsList>
          <TabsContent className="w-full" value="pricing">
            <section className="overflow-y-auto bg-white ">
              <div>
                <form onSubmit={handleSubmit(UpdateCourse)}>
                  <div className="mt-5">
                    <div>
                      <label
                        htmlFor="courseName"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Course Title
                      </label>
                      <Input
                        {...register('courseName', {
                          required: 'Title is Required',
                        })}
                        autoFocus
                        className="mt-2"
                        id="courseName"
                        errorMessage={fieldErrors?.courseName?.message.toString()}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="price"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Price
                      </label>
                      <Input
                        {...register('price', {
                          required: 'Price is Required',
                        })}
                        autoFocus
                        className="mt-2"
                        id="price"
                        errorMessage={fieldErrors?.price?.message.toString()}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="discountPrice"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Discount Price
                      </label>
                      <Input
                        {...register('discountPrice', {
                          required: 'Discount Price is Required',
                        })}
                        autoFocus
                        className="mt-2"
                        id="discountPrice"
                        errorMessage={fieldErrors?.discountPrice?.message.toString()}
                      />
                    </div>
                    <div className="mt-4">
                      <label
                        htmlFor="type"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Language
                      </label>
                      <Select
                        autoComplete="off"
                        value={watch('languageId')}
                        {...register('languageId')}
                        onValueChange={(value) => {
                          if (value) {
                            setValue('languageId', value);
                          }
                        }}
                      >
                        <SelectTrigger className="mt-2 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {languageList.map((item, index) => (
                              <SelectItem value={item.id} key={index}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {fieldErrors['regulationId'] && (
                        <p className="h-2 p-1 text-sm text-red-600">
                          {fieldErrors['regulationId'].message as string}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="description"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Description
                      </label>
                      <Textarea
                        {...register('description', {
                          required: 'Description is Required',
                        })}
                        autoFocus
                        className="mt-2"
                        id="description"
                        errorMessage={fieldErrors?.description?.message.toString()}
                      />
                    </div>

                    <div className="mt-10 flex justify-center gap-3">
                      <div className="mx-auto flex justify-center gap-3 px-12 py-4">
                        <Button
                          size="lg"
                          variant="outline"
                          className="mx-auto flex justify-center px-12 py-4"
                        >
                          Move to Draft{' '}
                        </Button>
                        <Button
                          size="lg"
                          variant="default"
                          disabled={isPendingUpdateCourse}
                          aria-disabled={isPendingUpdateCourse}
                          className="mx-auto flex justify-center px-12 py-4"
                        >
                          {isPendingUpdateCourse ? (
                            <div className="flex items-center justify-center">
                              <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                              Saving
                            </div>
                          ) : (
                            'Save Changes'
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </section>
          </TabsContent>
          <TabsContent className="w-full min-w-full" value="seo">
            <section className="bg-white p-5 ">SEO</section>
          </TabsContent>
          <TabsContent className="w-full min-w-full" value="faq">
            <section className="rounded-md bg-white p-6 shadow-sm">
              <DndContext
                collisionDetection={closestCenter}
                sensors={sensors}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={faqs.map((faq) => faq.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {faqs.map((faq) => (
                      <SortableFAQItem
                        key={faq.id}
                        faq={faq}
                        openId={openId}
                        setOpenId={setOpenId}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              <div className="mt-6 w-full">
                <Button
                  variant="outline"
                  onClick={handleAddFAQ}
                  className="w-full text-sm"
                >
                  + Add New Question
                </Button>
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </section>
    </section>
  );
}
