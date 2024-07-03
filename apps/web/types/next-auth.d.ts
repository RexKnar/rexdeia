import { UserRole } from '@prisma/client';
import type { User } from 'next-auth';

type UserId = string;

declare module 'next-auth/jwt' {
  interface JWT {
    id: UserId;
    username?: string | null;
    role: UserRole;
  }
}

declare module 'next-auth' {
  interface Session {
    branchId?: string | null;
    organizationId?: string | null;
    currentBatch?: string | null;

    user: User & {
      id: UserId;
      staffId?: string | null;
      password: string;
      username?: string | null;
      role: UserRole;
      createdBranches?: {
        id: string;
        name: string;
        address: string;
        updatedAt: string;
        createdAt: string;
        createdById: string;
        isActivated: boolean;
        organizationId: string;
      }[];
    };
  }
}
