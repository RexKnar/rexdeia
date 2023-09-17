import bcrypt from 'bcrypt';

import { db } from '../../../lib/db';
import { UserToRegisterModel } from './models';

export async function addUser(user: UserToRegisterModel) {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  return await db.user.create({
    data: {
      ...user,
      username: user.email,
      password: hashedPassword,
    },
  });
}
