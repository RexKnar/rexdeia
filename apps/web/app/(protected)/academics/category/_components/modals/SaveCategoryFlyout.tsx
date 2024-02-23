'use client';

import { Loader2, PlusCircle } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
  Switch,
  Text,
} from 'ui';

import { CreateCategoryModel } from '../../../../../../lib/domain/category';
import { useGetCategoryList } from '../../../../../../lib/queries/category/useCategoryList';
import { useCreateCategoryMutationQuery } from '../../../../../../lib/queries/category/useCreateCategoryMutationQuery';
import { useCreateCategoryWithParentMutationQuery } from '../../../../../../lib/queries/category/useCreateCategoryWithParentMutationQuery';

export function CategoryFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get('isCategoryFlyoutOpen') === 'true';

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { errors: fieldErrors },
  } = useForm({
    defaultValues: {
      name: null,
      isActive: false,
      parentId: null,
    },
  });

  const { data: categoryList } = useGetCategoryList({
    page: 1,
    limit: 999,
  });

  const {
    isPending: isPendingCreateCategory,
    mutateAsync: mutateCreateCategoryAsync,
  } = useCreateCategoryMutationQuery();

  const {
    isPending: isPendingCreateCategoryWithParent,
    mutateAsync: mutateCreateCategoryWithParentAsync,
  } = useCreateCategoryWithParentMutationQuery();

  const closeFlyout = async () => {
    const params = new URLSearchParams(searchParams);
    params.set('isCategoryFlyoutOpen', 'false');
    reset();
    params.delete('parentId');
    router.replace(pathname + '?' + params.toString());
  };

  async function saveCategory(payload: CreateCategoryModel) {
    try {
      if (!payload.parentId) {
        await mutateCreateCategoryAsync(payload);
      } else {
        await mutateCreateCategoryWithParentAsync(payload);
      }
    } catch (error) {
      console.error(error);
    } finally {
      await closeFlyout();
      reset();
    }
  }

  return (
    <section>
      <Sheet open={isOpen}>
        <SheetContent
          side="right"
          widthSize="sm"
          className="bg-white p-10"
          onCloseClick={() => closeFlyout()}
        >
          <form onSubmit={handleSubmit(saveCategory)}>
            <SheetHeader>
              <SheetTitle className="mb-5">
                <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:grid  lg:grid-cols-[1fr_100px]">
                  <div className="flex items-center">
                    <PlusCircle size={20} strokeWidth={1.5} />
                    <Text variant="lg-semibold" className="ml-2">
                      Add Category
                    </Text>
                  </div>
                  <div className="flex items-center">
                    <Switch
                      id="isActive"
                      {...register('isActive')}
                      onCheckedChange={(value) => {
                        setValue('isActive', value);
                      }}
                      checked={watch('isActive')}
                    />
                    <label
                      htmlFor="isActive"
                      className="ml-2 text-sm font-semibold"
                    >
                      {watch('isActive') ? 'Active' : 'Inactive'}
                    </label>
                  </div>
                </div>
              </SheetTitle>
              <hr className="border-t border-gray-300"></hr>
            </SheetHeader>

            <div className="mt-5">
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-gray-700"
                >
                  Parent Category Name
                </label>
                <Select
                  autoComplete="off"
                  {...register('parentId')}
                  value={watch('parentId')}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('parentId', value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categoryList?.data?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-5">
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-gray-700"
                >
                  Category Name
                </label>
                <Input
                  {...register('name', {
                    required: 'Category Name is Required',
                  })}
                  id="name"
                  autoFocus
                  type="text"
                  className="mt-2"
                  placeholder="Enter Category Name"
                  errorMessage={fieldErrors?.name?.message.toString()}
                />
              </div>
              <div className="mt-10">
                <Button
                  size="lg"
                  variant="default"
                  className="mx-auto flex justify-center px-12 py-4"
                  disabled={
                    isPendingCreateCategory || isPendingCreateCategoryWithParent
                  }
                  aria-disabled={
                    isPendingCreateCategory || isPendingCreateCategoryWithParent
                  }
                >
                  {isPendingCreateCategory ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                      Saving
                    </div>
                  ) : (
                    'Save'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </section>
  );
}
