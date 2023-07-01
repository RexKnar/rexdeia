import { db } from '../../../lib/db';
import { UserToRegisterModel } from './models';
import bcrypt from 'bcrypt';

export async function addUser(user: UserToRegisterModel) {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  return await db.user.create({
    data: {
      ...user,
      password: hashedPassword,
    },
  });
}
