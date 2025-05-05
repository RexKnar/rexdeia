'use client';
import { CreateCourseChapterItemRequestModel } from 'lib/domain/institute/chapterItem';
import { useCreateChapterItemMutationQuery } from 'lib/queries/institute/course/chapterItem/useCreateChapterItemMutationQuery';
import { useGetLanguageListQuery } from 'lib/queries/language/useGetLanguageListQurey';
import { Loader2, PlusCircle } from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Spinner,
  Text,
  Textarea,
} from 'ui';

import { useQueryParams } from '@/hooks/useQueryParams';

export function AddChapterItemFlyout() {
  const { getParam, removeParams, setParams } = useQueryParams();
  const searchParams = useSearchParams();

  const routeParams = useParams<{
    courseId: string;
    chapterId: string;
    moduleId: string;
  }>();

  const courseId = searchParams.get('courseId') || routeParams.courseId;

  const isOpen = getParam('isAddChapterItemFlyoutOpen') === 'true';
  const chapterId = getParam('chapterId');

  const {
    isPending: isPendingCreateChapterItem,
    mutateAsync: mutateCreateChapterItemAsync,
  } = useCreateChapterItemMutationQuery(courseId);

  const { data: languageList } = useGetLanguageListQuery();
  const closeFlyout = async () => {
    removeParams(['isAddChapterItemFlyoutOpen', 'chapterId']);
  };

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      closeFlyout();
    }
  };
  const {
    reset,
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      chapterId: '',
      itemType: 'text',
      languageId: '',
    },
  });

  useEffect(() => {
    if (chapterId) {
      setValue('chapterId', chapterId);
    }
  }, [chapterId]);
  const saveCourseChapter = async (
    payload: CreateCourseChapterItemRequestModel
  ) => {
    try {
      const requestPayload = {
        ...payload,
      };

      const response = await mutateCreateChapterItemAsync(requestPayload);
      if (response?.id) {
        // closeFlyout();
        setParams({
          chapterItemId: response.id,
          isAddChapterItemFlyoutOpen: 'false',
        });
        reset();
        // closeFlyout();
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <section>
      <Sheet open={isOpen} onOpenChange={handleOnOpenChange}>
        <SheetContent
          side="right"
          widthSize="sm"
          className="bg-white p-10"
          onCloseClick={() => {
            removeParams(['isAddCourseChapterFlyoutOpen']);
          }}
        >
          {courseId == '2' ? (
            <section className="flex h-96 w-full flex-col items-center justify-center gap-4">
              <Spinner />
              <p>No data found</p>
            </section>
          ) : (
            <form onSubmit={handleSubmit(saveCourseChapter)}>
              <SheetHeader>
                <SheetTitle className="mb-5">
                  <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:grid  lg:grid-cols-[1fr_100px]">
                    <div className="flex items-center">
                      <PlusCircle size={20} strokeWidth={1.5} />
                      <Text variant="lg-semibold" className="ml-2">
                        Add Chapter Item
                      </Text>
                    </div>
                  </div>
                </SheetTitle>
                <hr className="border-t border-gray-300"></hr>
              </SheetHeader>

              {courseId == '2' ? (
                <div className="flex h-96 w-full flex-col items-center justify-center gap-4">
                  <Spinner />
                  <p>Loading...</p>
                </div>
              ) : (
                <div className="mt-5">
                  <div className="mt-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Title
                    </label>
                    <Input
                      value={watch('name')}
                      {...register('name', {
                        required: 'Name is Required',
                      })}
                      id="name"
                      autoFocus
                      type="text"
                      className="mt-2"
                      placeholder="Enter Exam Name"
                      errorMessage={fieldErrors?.name?.message.toString()}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Description
                    </label>
                    <Textarea
                      {...register('description')}
                      autoFocus
                      className="mt-2"
                      id="description"
                      errorMessage={fieldErrors?.description?.message.toString()}
                    />
                  </div>
                  <div>
                    <label>Content Type</label>
                    <div>
                      <Select
                        autoComplete="off"
                        {...register('itemType', {
                          required: 'Content Type is required',
                        })}
                        value={watch('itemType')}
                        onValueChange={(value) => {
                          if (value) {
                            setValue('itemType', value);
                          }
                        }}
                      >
                        <SelectTrigger className="mt-2 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value={'text'}>Text Content</SelectItem>
                            <SelectItem value={'pdf'}>PDF Content</SelectItem>
                            <SelectItem value={'video'}>
                              Video Content
                            </SelectItem>
                            <SelectItem value={'image'}>
                              Image Content
                            </SelectItem>
                            <SelectItem value={'quiz'}>Quiz</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label>Language of Content</label>
                    <div>
                      <Select
                        autoComplete="off"
                        {...register('languageId', {
                          required: 'Language is required',
                        })}
                        value={watch('languageId')}
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
                            {languageList?.map((item, index) => (
                              <SelectItem value={item.id} key={index}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-10">
                    <Button
                      size="lg"
                      variant="default"
                      disabled={isPendingCreateChapterItem}
                      aria-disabled={isPendingCreateChapterItem}
                      className="mx-auto flex justify-center px-12 py-4"
                    >
                      {isPendingCreateChapterItem ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                          Saving
                        </div>
                      ) : (
                        ` Save`
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}
