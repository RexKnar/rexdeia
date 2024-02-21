export type Student = {
  id: string;
  name: string;
  dob: string;
  gender: string;
  batchId: string;
  emailId: string;
  lastName: string;
  religion: string;
  firstName: string;
  phoneNumber: string;
  fatherName: string;
  bloodGroup: string;
  middleName: string;
  motherName: string;
  nationality: string;
  motherTongue: string;
  guardianName: string;
  maritalStatus: string;
  fatherEmailId: string;
  motherEmailId: string;
  guardianEmailId: string;
  motherOccupation: string;
  aadharCardNumber: string;
  fatherOccupation: string;
  fatherPhoneNumber: string;
  motherPhoneNumber: string;
  guardiansOccupation: string;
  guardianPhoneNumber: string;
  isDeleting?: boolean;
  isUpdating?: boolean;
  isNewlyAdded?: boolean;
  status: 'Active' | 'Rejected' | 'Pending';

  additionalAttributes: any;
};

export type AddStudentModel = Omit<Student, 'id'> & {
  batchId: string;
};

export type GetStudentListModel = {
  page: number;
  total: number;
  data: Student[];
  pageSize: number;
};

export type AssignStudentsToClassModel = {
  studentIds: string[];
  sectionId: string;
  groupId: string;
  academicYear: string;
};
