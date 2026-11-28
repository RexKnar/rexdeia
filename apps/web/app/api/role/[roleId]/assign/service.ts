import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

export async function assignUsersToRoleById(roleId: string, payload: any) {
  // Fetch the session data
  const session = await getServerSession(authOptions);

  // Fetch the role
  const role = await db.role.findFirst({
    where: {
      id: roleId,
      organizationId: session.organizationId,
      branchId: session.branchId,
    },
    select: {
      id: true,
      name: true,
      moduleAccess: true,
    },
  });

  if (!role) {
    throw new Error('Role not found');
  }

  // Check if userIds are provided
  const userIds = payload.userIds;

  if (!Array.isArray(userIds) || userIds.length === 0) {
    throw new Error('User IDs are required');
  }

  // Query and update users in parallel
  const users = await Promise.all(
    userIds.map(async (userId) => {
      // Fetch the user
      const user = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }

      // Fetch the user's organization data
      const userOrg = await db.userOrganization.findFirst({
        where: {
          userId: userId,
          organizationId: session.organizationId,
          branchId: session.branchId,
        },
      });

      if (!userOrg) {
        throw new Error(`User organization with ID ${userId} not found`);
      }

      // Close out any current active role history for this user
      await db.userRoleHistory.updateMany({
        where: {
          userId: userId,
          organizationId: session.organizationId,
          branchId: session.branchId,
          isCurrent: true,
        },
        data: {
          isCurrent: false,
          endDate: new Date(),
        },
      });

      // Record new role history entry for the active academic year
      await db.userRoleHistory.create({
        data: {
          userId: userId,
          roleId: role.id,
          academicYearId: session.currentBatch || null,
          organizationId: session.organizationId,
          branchId: session.branchId,
          startDate: new Date(),
          isCurrent: true,
          assignedById: session.user?.id || null,
        },
      });

      // Update the user organization with the new roleId
      return await db.userOrganization.update({
        where: {
          id: userOrg.id,
        },
        data: {
          roleId: role.id,
        },
      });
    })
  );

  return users;
}

export async function unassignUserFromRole(roleId: string, userId: string) {
  const session = await getServerSession(authOptions);

  // Close out the current active role history record
  await db.userRoleHistory.updateMany({
    where: {
      userId: userId,
      roleId: roleId,
      organizationId: session.organizationId,
      branchId: session.branchId,
      isCurrent: true,
    },
    data: {
      isCurrent: false,
      endDate: new Date(),
    },
  });

  return await db.userOrganization.updateMany({
    where: {
      userId: userId,
      roleId: roleId,
      organizationId: session.organizationId,
      branchId: session.branchId,
    },
    data: {
      roleId: null,
    },
  });
}

