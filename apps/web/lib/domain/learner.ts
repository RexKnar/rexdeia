import { LanguageModel } from './language';
import { UserModal } from './user';

export type LearnerModel = {
  id: string;
  name: string;
  dob?: string;
  gender?: string;
  emailId: string;
  emisNumber?: string;
  lastName?: string;
  firstName: string;
  phoneNumber: string;
  profileImage?: string;
  middleName?: string;
  motherTongueId?: string;
  motherTongue?: LanguageModel;
  aadharCardNumber?: string;
  isDeleting?: boolean;
  isUpdating?: boolean;
  isNewlyAdded?: boolean;
  status: 'Active' | 'Rejected' | 'Pending';
  user?: UserModal;
  additionalAttributes: any;
  courseDetails?: any;
};

export type AssignLearnerModel = Pick<
  LearnerModel,
  | 'emailId'
  | 'phoneNumber'
  | 'firstName'
  | 'middleName'
  | 'lastName'
  | 'gender'
  | 'courseDetails'
>;

export type UpdateLearnerModel = Pick<LearnerModel, 'id'>;

export type GetLearnerListModel = {
  page: number;
  total: number;
  data: LearnerModel[];
  pageSize: number;
};
