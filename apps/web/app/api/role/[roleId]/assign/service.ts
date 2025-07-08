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
