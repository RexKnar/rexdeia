'use client';
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

export default function CourseSettings() {
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
  return (
    <section className="grid justify-start w-full grid-cols-11 gap-2 mt-10">
      <section className="relative col-span-3">
        <Card className="sticky top-0 bg-white rounded-md w-72">
          <CardHeader>
            <div className="relative flex items-center justify-center bg-gray-100 rounded-md ">
              <label className="absolute z-50 p-2 transition-colors bg-white rounded-full shadow-lg cursor-pointer right-2 top-2 hover:bg-gray-100">
                <Camera className="w-5 h-5" />
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
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-auto bg-gray-200 min-h-60">
                        <span className="text-xl font-bold">
                          {courseDetail.courseName[0] || 'C'}
                        </span>
                      </div>
                    )}
                  </span>
                ) : (
                  <div className="flex items-center justify-center w-full bg-gray-200 aspect-square">
                    <span className="font-bold text-normal">Uploading...</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="pl-3 mt-5 ">
              <div className="grid grid-cols-3 ml-5 ">
                <Text className="pt-1 text-xs text-gray-800 w-18">
                  {'Learners'}
                </Text>
              </div>
              <div className="grid grid-cols-3 pt-3 ml-5 ">
                <Text className="pt-1 text-xs text-gray-800 w-18">
                  {'Completed'}
                </Text>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      <section className="col-span-8">
        <Tabs defaultValue="pricing" className="border-0 ">
          <TabsList className="justify-start w-full border-b-2 border-gray-100">
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
                        <SelectTrigger className="w-full mt-2">
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

                    <div className="flex justify-center gap-3 mt-10">
                      <div className="flex justify-center gap-3 px-12 py-4 mx-auto">
                        <Button
                          size="lg"
                          variant="outline"
                          className="flex justify-center px-12 py-4 mx-auto"
                        >
                          Move to Draft{' '}
                        </Button>
                        <Button
                          size="lg"
                          variant="default"
                          disabled={isPendingUpdateCourse}
                          aria-disabled={isPendingUpdateCourse}
                          className="flex justify-center px-12 py-4 mx-auto"
                        >
                          {isPendingUpdateCourse ? (
                            <div className="flex items-center justify-center">
                              <Loader2 className="w-6 h-6 mr-2 text-white animate-spin" />
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
            <section className="p-5 bg-white ">SEO</section>
          </TabsContent>
        </Tabs>
      </section>
    </section>
  );
}
