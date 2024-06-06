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
        if (!credentials.email || !credentials.password) {
          throw new Error('EMAIL_PASSWORD_NOT_PROVIDED');
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          throw new Error('INVALID_PASSWORD');
        }
        return user;
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
        session.branchId = token.branchId as string;
        session.organizationId = token.organizationId as string;
        session.user.createdBranches = token.createdBranches as any[];
      }

      return session;
    },

    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update' && session.organizationId && session.branchId) {
        token.branchId = session.branchId;
        token.organizationId = session.organizationId;
      }

      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
        include: {
          createdBranches: true,
          userOrganizations: true,
        },
      });

      if (!dbUser) {
        token.id = user!.id;
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
      } else {
        const academicDetails = await db.batch.findFirst({
          where: {
            currentAcademicYear: true,
            branchId: token.branchId,
          },
        });
        user['academicDetails'] = academicDetails;
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
      };
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
