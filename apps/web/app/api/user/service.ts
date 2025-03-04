import { db } from '../../../lib/db';

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
      userOrganizations: {
        include: {
          branch: true,
          organization: true,
        },
      },
    },
  });
}

export async function getUserById(id: string) {
  return db.user.findFirst({
    where: {
      id,
    },
    select:{
      name:true,
      email:true,
      password:false,
      image:true,
      phoneNumber:true,
    }
  });
}