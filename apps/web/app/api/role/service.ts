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
        moduleAccess: {
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
    moduleAccess: role.moduleAccess,
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
  return db.moduleAccess.create({
    data: createModuleAccess,
  });
}

export async function getRoleById(roleId: string) {
  const session = await getServerSession(authOptions);

  const role = await db.role.findFirst({
    where: {
      id: roleId,
      organizationId: session.organizationId,
      branchId: session.branchId,
    },
    select: {
      id: true,
      name: true,
      moduleAccess: {
        select: {
          module: true,
          create: true,
          read: true,
          update: true,
          delete: true,
        },
      },
      UserOrganization: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
              phoneNumber: true,
              role: true,
            },
          },
        },
      },
    },
  });

  if (!role) {
    throw new Error('Role not found');
  }

  return role;
}

export async function editRoleById(
  roleId: string,
  data: {
    name: string;
    isActive: boolean;
    moduleAccess: {
      module: string;
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    }[];
  }
) {
  const session = await getServerSession(authOptions);

  const role = await db.role.update({
    where: {
      id: roleId,
      organizationId: session.organizationId,
      branchId: session.branchId,
    },
    data: {
      name: data.name,
      moduleAccess: {
        deleteMany: {},
        create: data.moduleAccess.map((access) => ({
          module: access.module,
          create: access.create,
          read: access.read,
          update: access.update,
          delete: access.delete,
        })),
      },
    },
  });

  return role;
}
