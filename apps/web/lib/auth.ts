import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { getServerSession, NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { db } from './db';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const cleanEmail = credentials.email.trim();
          const user =
            (await db.user.findUnique({
              where: {
                email: cleanEmail,
              },
            })) ||
            (await db.user.findFirst({
              where: {
                email: {
                  equals: cleanEmail,
                  mode: 'insensitive',
                },
              },
            }));

          if (!user || !user.password) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!passwordMatch) {
            return null;
          }

          return user;
        } catch (error) {
          console.error('[NextAuth] Error in authorize callback:', error);
          return null;
        }
      },
    }),
  ],
  debug: process.env['NODE_ENV'] === 'development',
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.username = token.username;
        session.user.role = token.role;
        session.user.staffId = token.staffId || (null as any);
        session.branchId = token.branchId as string;
        session.organizationId = token.organizationId as string;
        session.currentBatch = token.currentBatch as string;
        session.user.createdBranches = token.createdBranches as any[];
        session.user.organizationRole = (token.organizationRole as any) || null;
        session.organizationName = token.organizationName as string;
        session.institute = token.institute as string;
      }

      return session;
    },

    async jwt({ token, user, trigger, session }) {
      try {
        const dbUser = await db.user.findFirst({
          where: {
            email: token.email,
          },
          include: {
            createdBranches: true,
            userOrganizations: {
              include: {
                role: {
                  include: {
                    moduleAccess: true,
                  },
                },
              },
            },
          },
        });

        if (!dbUser) {
          if (user?.id) {
            token.id = user.id;
          }
          return token;
        }

        if (!dbUser.username) {
          await db.user.update({
            where: {
              id: dbUser.id,
            },
            data: {
              username: nanoid(10),
            },
          });
        }

        // Resolve the staff record for any user that has one (not just
        // TeachingStaff) so role derivation (AHM / class teacher) can rely on it.
        let staffId = null;
        const dbStaff = await db.staff.findFirst({
          where: {
            email: token.email,
          },
        });
        staffId = dbStaff?.id || null;

        if (
          trigger === 'update' &&
          session?.organizationId &&
          session?.branchId
        ) {
          token.branchId = session.branchId;
          token.organizationId = session.organizationId;
          token.organizationName = session.organizationName;
          token.institute = session.institute;
          token.currentBatch = session.currentBatch;
          token.organizationRole = session.organizationRole;
          if (session.currentBatch) {
            token.currentBatch = session.currentBatch;
          } else {
            const academicDetails = await db.batch.findFirst({
              where: {
                currentAcademicYear: true,
                branchId: token.branchId,
              },
            });
            token.currentBatch = academicDetails?.id || null;
          }
        }

        if (token.branchId && !token.currentBatch) {
          const academicDetails = await db.batch.findFirst({
            where: {
              currentAcademicYear: true,
              branchId: token.branchId,
            },
          });
          if (academicDetails?.id) {
            token.currentBatch = academicDetails.id;
          }
        }

        // Ensure organizationRole is hydrated from dbUser if token doesn't have it yet
        if (!token.organizationRole && dbUser.userOrganizations?.length > 0) {
          const activeOrg = token.branchId
            ? dbUser.userOrganizations.find(
                (org) => org.branchId === token.branchId
              ) || dbUser.userOrganizations[0]
            : dbUser.userOrganizations[0];
          if (activeOrg?.role) {
            token.organizationRole = activeOrg.role;
          }
        }

        return {
          ...token,
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          image: dbUser.image,
          username: dbUser.username,
          role: dbUser.role,
          createdBranches: dbUser.createdBranches,
          staffId: staffId || null,
        };
      } catch (error) {
        console.error('[NextAuth] Error in jwt callback:', error);
        return token;
      }
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
