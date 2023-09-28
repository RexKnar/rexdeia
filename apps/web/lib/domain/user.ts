import { BranchModal } from './branch';
import { OrganizationModal } from './organization';
import { UserOrganizationModal } from './userOrganization';

type AccountModal = {
  id: string;
  type: string;
  scope: string;
  userId: string;
  user: UserModal;
  provider: string;
  id_token: string;
  token_type: string;
  expires_at: number;
  access_token: string;
  refresh_token: string;
  session_state: string;
  providerAccountId: string;
};

interface SessionModal {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  user: UserModal;
}

export type UserModal = {
  id: string;
  name?: string;
  email: string;
  image?: string;
  password: string;
  username?: string;
  emailVerified?: Date;
  phoneNumber: string;
  accounts: AccountModal[];
  sessions: SessionModal[];
  CreatedBranch: BranchModal[];
  CreatedOrganization: OrganizationModal[];
  userOrganizations: UserOrganizationModal[];
};
