import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { db } from '../../../lib/db';

export async function addRole(rolePayload: any) {
  const session = await getServerSession(authOptions);
  const createdRole = await db.role.create({
    data: {
      name: rolePayload.name,
      organization: {
        connect: {
          id: session.organizationId,
        },
      },
      branch: {
        connect: {
          id: session.branchId,
        },
      },
    },
  });

  await Promise.all(
    rolePayload.moduleAccess.map((access) =>
      addModuleAccess({
        roleId: createdRole.id,
        module: access.module,
        create: access.create,
        read: access.read,
        update: access.update,
        delete: access.delete,
      })
    )
  );
  return createdRole;
}

export async function getAllRoleList(page: number, limit: number) {
  const session = await getServerSession(authOptions);

  const [total, roleList] = await Promise.all([
    db.role.count({
      where: {
        branchId: session.branchId,
      },
    }),
    db.role.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        organizationId: session.organizationId,
      },
      select: {
        id: true,
        name: true,
        modelAccess: {
          select: {
            module: true,
            create: true,
            read: true,
            update: true,
            delete: true,
          },
        },
      },
    }),
  ]);

  const mappedRoles = roleList.map((role) => ({
    ...role,
    moduleAccess: role.modelAccess,
  }));

  return {
    page,
    total,
    limit,
    data: mappedRoles,
  };
}

export function addModuleAccess(access: any) {
  const createModuleAccess: any = {
    role: {
      connect: {
        id: access.roleId,
      },
    },
    module: access.module,
    create: access.create,
    read: access.read,
    update: access.update,
    delete: access.delete,
  };
  return db.modelAccess.create({
    data: createModuleAccess,
  });
}
