import { AddSubjectsToClassRequestModel } from '../../../../../lib/domain/class';
import { CreateSubjectModel } from '../../../../../lib/domain/subject';

export function hasSubjectIds(
  data: AddSubjectsToClassRequestModel
): data is { subjectIds: string[] } {
  return 'subjectIds' in data;
}

export function hasSubjects(
  data: AddSubjectsToClassRequestModel
): data is { subjects: CreateSubjectModel[] } {
  return 'subjects' in data;
}
