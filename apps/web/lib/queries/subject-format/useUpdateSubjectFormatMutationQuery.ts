import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import {
  SubjectFormatModel,
  UpdateSubjectFormatModel,
} from '../../domain/subject';
import {
  GET_SUBJECT_FORMAT_LIST,
  UPDATE_SUBJECT_FORMAT_BY_ID,
} from '../../endpoints';

export function useUpdateSubjectFormatMutationQuery(
  page: number,
  limit: number
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateSubjectFormatModel) => {
      return await makeAPICall<SubjectFormatModel>(
        UPDATE_SUBJECT_FORMAT_BY_ID,
        payload,
        {},
        { id: payload.id }
      );
    },
    onMutate: async (payload: UpdateSubjectFormatModel) => {
      await queryClient.cancelQueries({
        queryKey: [GET_SUBJECT_FORMAT_LIST, page, limit],
      });

      const previousSubjectFormat = queryClient.getQueryData<
        PaginatedResponse<SubjectFormatModel>
      >([GET_SUBJECT_FORMAT_LIST, page, limit]);

      queryClient.setQueryData(
        [GET_SUBJECT_FORMAT_LIST, page, limit],
        (existingSubjectFormat: PaginatedResponse<SubjectFormatModel>) => {
          return {
            ...existingSubjectFormat,
            data: [
              ...existingSubjectFormat.data.map((subjectFormat) => {
                if (subjectFormat.id === payload.id) {
                  return { ...payload, isUpdating: true };
                }
                return subjectFormat;
              }),
            ],
          };
        }
      );

      return { previousSubjectFormat };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(
        [GET_SUBJECT_FORMAT_LIST],
        context.previousSubjectFormat
      );
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_SUBJECT_FORMAT_LIST, page, limit],
      });
    },
  });
}
