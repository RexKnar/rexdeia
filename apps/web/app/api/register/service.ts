import { db } from '../../../lib/db';
import { RegisterUserModel } from './models';
import bcrypt from "bcrypt";

export async function registerUser(user: RegisterUserModel) {
  const existingUser = await db.user.findFirst({
    where: {
      email: user.email,
    },
  });

  if (existingUser) {
    throw new Error('USER_ALREADY_EXISTS');
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);
  return await db.user.create({
    data: {
      ...user,
      password: hashedPassword,
    },
  });
}