import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { validate as validateUuid } from 'uuid';

import { assignUsersToRoleById } from './service';

/**
 * @swagger
 * /api/role/{roleId}/assign:
 *   post:
 *     summary: Add user to the Role
 *     description: Add users to the role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
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
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the role to retrieve
 *     responses:
 *       200:
 *         description: Role Assigned successfully.
 *       400:
 *         description: Invalid role ID.
 *       401:
 *         description: Unauthorized access.
 *       404:
 *         description: Role not found.
 *       500:
 *         description: Internal server error.
 */

export async function POST(
  request: NextRequest,
  { params }: { params: { roleId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const roleId = params.roleId;
    if (!validateUuid(roleId)) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid role ID format' }),
        {
          status: StatusCodes.BAD_REQUEST,
        }
      );
    }

    const payload = await request.json();

    const role = await assignUsersToRoleById(roleId, payload);

    return new NextResponse(JSON.stringify(role), {
      status: StatusCodes.OK,
    });
  } catch (e: any) {
    captureException(e);
    return new NextResponse(JSON.stringify({ error: e.message }), {
      status:
        e.message === 'Role not found'
          ? StatusCodes.NOT_FOUND
          : StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
