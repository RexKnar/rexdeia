import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { ClassModel } from '../../domain/class';
import { CreateSectionModel, SectionModel } from '../../domain/section';
import { ADD_SECTION, GET_CLASS_LIST } from '../../endpoints';

export function useCreateSectionMutationQuery() {
  const page = 1;
  const limit = 999;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateSectionModel) => {
      return await makeAPICall<SectionModel>(ADD_SECTION, payload, {}, {});
    },
    onMutate: async (payload: CreateSectionModel) => {
      await queryClient.cancelQueries({
        queryKey: [GET_CLASS_LIST, page, limit],
      });

      const previousSections = queryClient.getQueryData<
        PaginatedResponse<ClassModel>
      >([GET_CLASS_LIST, page, limit]);

      queryClient.setQueryData(
        [GET_CLASS_LIST, page, limit],
        (currentPaginatedClasses) => {
          return produce(
            currentPaginatedClasses,
            (draft: PaginatedResponse<ClassModel>) => {
              if (draft.data) {
                draft.data.forEach((classData) => {
                  if (classData.id === payload.classId) {
                    classData.Section = [
                      ...classData.Section,
                      {
                        ...payload,
                      },
                    ];

                    draft.data = [
                      ...draft.data.filter((data) => data.id !== classData.id),
                      classData,
                    ];
                  }
                });
              }
            }
          );
        }
      );

      return { previousSections: previousSections };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(
        [GET_CLASS_LIST, page, limit],
        context.previousSections
      );
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_CLASS_LIST, page, limit],
      });
    },
  });
}
