import { db } from '../../../lib/db';
import { OrganizationModel } from './models';

export async function addOrganization(organization: OrganizationModel) {
  const user = await db.user.findFirst({
    where: {
      id: organization.userId,
    },
  });

  const createdOrganization = await db.organization.create({
    data: {
      name: organization.name,
      institute: organization.institute,
      users: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  await db.userOrganization.create({
    data: {
      userId: user.id,
      organizationId: createdOrganization.id,
    },
  });

  return createdOrganization;
}
