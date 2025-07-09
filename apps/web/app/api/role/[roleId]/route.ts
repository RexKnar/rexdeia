import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { deleteRoleModuleById, editRoleById, getRoleById } from '../service';

/**
 * @swagger
 * /api/role/{roleId}:
 *   get:
 *     summary: Get a Role by ID
 *     description: Fetch a single role with module access
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the role to retrieve
 *     responses:
 *       200:
 *         description: Role fetched successfully.
 *       400:
 *         description: Invalid role ID.
 *       401:
 *         description: Unauthorized access.
 *       404:
 *         description: Role not found.
 *       500:
 *         description: Internal server error.
 */
export async function GET(
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

    if (!roleId) {
      return new NextResponse(JSON.stringify({ error: 'Invalid role ID' }), {
        status: StatusCodes.BAD_REQUEST,
      });
    }

    const role = await getRoleById(roleId);

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

/**
 * @swagger
 * /api/role/{roleId}:
 *   put:
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
export async function PUT(
  request: NextRequest,
  { params }: { params: { roleId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const roleId = params.roleId;
    const body = await request.json();

    const updatedRole = await editRoleById(roleId, body);

    return NextResponse.json(updatedRole, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

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
  { params }: { params: { roleId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const roleId = params.roleId;

    const updatedRole = await deleteRoleModuleById(roleId);

    return NextResponse.json(updatedRole, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
