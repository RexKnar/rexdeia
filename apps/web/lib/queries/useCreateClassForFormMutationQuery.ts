import { useMutation } from '@tanstack/react-query';

import { makeAPICall } from '../api';
import { ClassModel, CreateClassModel } from '../domain/class';
import { ADD_CLASS } from '../endpoints';

export function useCreateClassForFormMutationQuery() {
  return useMutation({
    mutationFn: async (classDetails: CreateClassModel) => {
      return await makeAPICall<ClassModel>(ADD_CLASS, classDetails, {}, {});
    },
  });
}
