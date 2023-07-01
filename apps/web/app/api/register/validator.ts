import { UserToRegisterModel } from './models';
import { db } from '../../../lib/db';
import { z } from 'zod';

const schema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  phoneNumber: z.string().regex(/^[0-9]+$/),
});

export async function validateAddUser(user: UserToRegisterModel) {
  try {
    schema.parse(user);
  } catch (e) {
    throw new Error('VALIDATION_ERROR');
  }

  const existingUser = await db.user.findFirst({
    where: {
      email: user.email,
    },
  });

  if (existingUser) {
    throw new Error('USER_ALREADY_EXISTS');
  }

  return schema.parse(user);
}
