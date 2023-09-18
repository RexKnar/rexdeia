import type { User } from 'next-auth';

type UserId = string;

declare module 'next-auth/jwt' {
  interface JWT {
    id: UserId;
    username?: string | null;
  }
}

declare module 'next-auth' {
  interface Session {
    user: User & {
      id: UserId;
      password: string;
      username?: string | null;
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
