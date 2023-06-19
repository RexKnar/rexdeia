import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { db } from './db';
import { getServerSession, NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/signin',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log(credentials);
        if(!credentials.email || !credentials.password) {
          throw new Error('Please enter an email and password')
        }
        
        const user = await db.user.findFirst({
          where: {
            email: credentials.email
          }
        });

        console.log(user);

        if (!user || !user?.password) {
          console.log(user);
          const hashedPassword = await bcrypt.hash(credentials.password, 10);

          const createdUser = await db.user.create({
            data: {
              name: credentials.name,
              email: credentials.email,
              password: hashedPassword,
            }
          });

          console.log(createdUser);

          return createdUser;
        }

        // check to see if password matches
        const passwordMatch = await bcrypt.compare(credentials.password, user.password)

        // if password does not match
        if (!passwordMatch) {
          throw new Error('Incorrect password')
        }

        return user;
      },
    }),
  ],
  debug: true,
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.username = token.username;
      }

      return session;
    },

    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
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
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        username: dbUser.username,
      };
    },
    redirect() {
      return '/';
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
