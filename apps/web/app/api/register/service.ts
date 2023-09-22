import bcrypt from 'bcrypt';

import { db } from '../../../lib/db';
import { UserToRegisterModel } from './models';

export async function onBoardUserAndOrganization(user: UserToRegisterModel) {
  const hashedPassword = await bcrypt.hash(user.password, 10);

  const createdUser = await db.user.create({
    data: {
      ...user,
      username: user.email,
      password: hashedPassword,
    },
  });

  const createdOrganization = await db.organization.create({
    data: {
      name: '',
      image: '',
      institute: '',
      description: '',
      createdBy: {
        connect: {
          id: createdUser.id,
        },
      },
    },
  });

  const createdBranch = await db.branch.create({
    data: {
      name: '',
      address: '',
      organization: {
        connect: {
          id: createdOrganization.id,
        },
      },
      createdBy: {
        connect: {
          id: createdUser.id,
        },
      },
    },
  });

  await db.userOrganization.create({
    data: {
      user: {
        connect: {
          id: createdUser.id,
        },
      },
      organization: {
        connect: {
          id: createdOrganization.id,
        },
      },
      branch: {
        connect: {
          id: createdBranch.id,
        },
      },
    },
  });

  return {
    ...createdUser,
    createdBranchId: createdBranch.id,
    createdOrganizationId: createdOrganization.id,
  };
}
