import { db } from 'lib/db';

type ModuleAccessInput = {
  module: string;
  create?: boolean;
  read?: boolean;
  update?: boolean;
  delete?: boolean;
};

export async function addRoleModuleAccess(
  roleId: string,
  moduleAccessList: ModuleAccessInput[]
) {
  if (!moduleAccessList || !Array.isArray(moduleAccessList)) {
    throw new Error('Invalid moduleAccess array');
  }

  const result = await db.moduleAccess.createMany({
    data: moduleAccessList.map((access) => ({
      ...access,
      roleId,
    })),
  });

  return result;
}
