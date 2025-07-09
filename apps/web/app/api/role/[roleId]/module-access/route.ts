import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { addRoleModuleAccess } from './service';

/**
 * @swagger
 * /api/role/{roleId}/module-access:
 *   post:
 *     summary: Add module access to a role
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               moduleAccess:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     module:
 *                       type: string
 *                     create:
 *                       type: boolean
 *                     read:
 *                       type: boolean
 *                     update:
 *                       type: boolean
 *                     delete:
 *                       type: boolean
 *     responses:
 *       201:
 *         description: Module access added successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

export async function POST(
  req: NextRequest,
  { params }: { params: { roleId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const roleId = params.roleId;
    const body = await req.json();
    const { moduleAccess } = body;

    const result = await addRoleModuleAccess(roleId, moduleAccess);

    return NextResponse.json(
      { message: 'Module access added successfully', result },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
