import { db } from '../../../../lib/db';
import { OrganizationModel } from './models';

export async function updateOrganizationById(
  id: string,
  organization: OrganizationModel
) {
  return await db.organization.update({
    data: {
      isActivated: true,
      name: organization.name,
      institute: organization.institute,
      description: organization.description,
    },
    where: {
      id: id,
    },
  });
}

export async function getOrganizationById(id: string) {
  return await db.organization.findUnique({
    where: {
      id: id,
    },
  });
}
