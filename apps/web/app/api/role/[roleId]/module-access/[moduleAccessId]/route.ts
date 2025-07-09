import { deleteRoleModuleById } from 'app/api/role/service';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
/**
 * @swagger
 * /api/role/{roleId}:
 *   delete:
 *     summary: Update a role
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
 *               name:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               moduleAccess:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Role updated
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { moduleAccessId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { moduleAccessId } = params;

    const deletedAccess = await deleteRoleModuleById(moduleAccessId);

    return NextResponse.json(deletedAccess, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
