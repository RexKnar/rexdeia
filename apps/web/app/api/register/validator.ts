import { z } from 'zod';

import { db } from '../../../lib/db';
import { UserToRegisterModel } from './models';

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
    return Promise.reject(e);
  }

  const existingUser = await db.user.findFirst({
    where: {
      email: user.email,
    },
  });

  if (existingUser) {
    let errorResponse = [
      {
        code: 'user_exists',
        message: 'Email id is already in use',
        path: ['email'],
      },
    ];
    return Promise.reject(JSON.stringify(errorResponse));
  }

  return schema.parse(user);
}
