import { compare, hash } from 'bcrypt';
import { db } from 'lib/db';

export async function getUserDetailsById(userId: string) {
  return db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      phoneNumber: true,
      userOrganizations: {
        include: {
          branch: true,
          organization: true,
        },
      },
    },
  });
}

export async function updateUserDetails(
  sessionUser: { id: string },
  updateData: { name?: string; phoneNumber?: string }
) {
  return db.user.update({
    where: { id: sessionUser.id },
    data: { ...updateData },
  });
}

export async function updateUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user || !(await compare(currentPassword, user.password))) {
    throw new Error('INVALID_CREDENTIALS');
  }

  return db.user.update({
    where: { id: userId },
    data: { password: await hash(newPassword, 10) },
  });
}
