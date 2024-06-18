import { Student } from '../domain';

/**
 * Formats the input data to conform to the Student type.
 *
 * @param {Record<string, unknown>} data - The input data to be formatted.
 * @returns {Student} An object that conforms to the Student interface.
 *
 * @description This function takes an input object and separates its properties
 * into those that match the keys defined in the Student type, and all others.
 * Matching keys are directly assigned to the resulting object, while non-matching
 * keys are grouped under `additionalAttributes`.
 */
export function formatStudentPayload(data: Record<string, unknown>) {
  const studentKeys: Set<keyof Student> = new Set<keyof Student>([
    'id',
    'dob',
    'status',
    'gender',
    'emailId',
    'emisNumber',
    'admissionNumber',
    'batchId',
    'lastName',
    'religion',
    'firstName',
    'fatherName',
    'bloodGroup',
    'middleName',
    'motherName',
    'nationality',
    'motherTongue',
    'phoneNumber',
    'motherTongueId',
    'communityId',
    'guardianName',
    'fatherEmailId',
    'motherEmailId',
    'guardianEmailId',
    'motherOccupation',
    'aadharCardNumber',
    'fatherOccupation',
    'fatherPhoneNumber',
    'motherPhoneNumber',
    'guardiansOccupation',
    'guardianPhoneNumber',
  ]);

  function isStudentKey(key: string): key is keyof Student {
    return studentKeys.has(key as keyof Student);
  }

  const student: Partial<Student> = { additionalAttributes: {} };

  Object.keys(data).forEach((key) => {
    if (isStudentKey(key)) {
      student[key] = data[key] as never;
    } else {
      student.additionalAttributes[key] = data[key];
    }
  });

  return student as Student;
}

export function toTitleCase(str: string) {
  return str.toLowerCase().replace(/\b\w/g, function (match) {
    return match.toUpperCase();
  });
}
