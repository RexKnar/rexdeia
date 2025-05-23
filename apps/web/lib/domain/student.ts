import { BatchModel } from './batch';
import { ClassModel } from './class';
import { CommunityModel } from './community';
import { GroupModel } from './group';
import { LanguageModel } from './language';
import { MediumModel } from './medium';
import { SectionModel } from './section';
import { UserModal } from './user';

export type Student = {
  id: string;
  name: string;
  dob: string;
  gender: string;
  batchId: string;
  emailId: string;
  emisNumber: string;
  admissionNumber: string;
  lastName: string;
  religion: string;
  firstName: string;
  phoneNumber: string;
  profileImage?: string;
  fatherName: string;
  bloodGroup: string;
  middleName: string;
  motherName: string;
  nationality: string;
  motherTongueId: string;
  motherTongue?: LanguageModel;
  communityId: string;
  community?: CommunityModel;
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
  class: ClassModel;
  group: GroupModel;
  medium: MediumModel;
  batch: BatchModel;
  section: SectionModel;
  status: 'Active' | 'Rejected' | 'Pending';
  user?: UserModal;
  additionalAttributes: any;
  studentMapping?: StudentMappingModel[];
  academicDetails?: any;
  courseDetails?: any;
};

export type AddStudentModel = Omit<
  Student,
  'id' | 'motherTongue' | 'community' | 'batch' | 'studentMapping ' | 'section'
> & {
  batchId: string;
  communityId: string;
  motherTongueId: string;
};

export type UpdateStudentModel = Pick<Student, 'id'>;

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

export type SwitchStudentsToClassModel = {
  studentId: string;
  sectionId: string;
  groupId: string;
  classId: string;
  academicYear: string;
};

export type StudentMappingModel = {
  student?: Student;
  class?: ClassModel;
  section?: SectionModel;
  classId?: string;
  sectionId?: string;
  batchId?: string;
  remark?: string;
};

export type PromoteStudentsToNewClassModel = {
  studentIds: string[];
  classId: string;
  sectionId: string;
  groupId: string;
  mediumId: string;
  academicYear: string;
};
