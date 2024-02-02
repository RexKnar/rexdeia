import { AddSubjectsToSectionRequestModel } from '../../../../../lib/domain/section';
import { CreateSubjectModel } from '../../../../../lib/domain/subject';

export function hasSubjectIds(
  data: AddSubjectsToSectionRequestModel
): data is { subjectIds: string[] } {
  return 'subjectIds' in data;
}

export function hasSubjects(
  data: AddSubjectsToSectionRequestModel
): data is { subjects: CreateSubjectModel[] } {
  return 'subjects' in data;
}
