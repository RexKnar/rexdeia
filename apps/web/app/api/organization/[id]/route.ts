import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { getOrganizationById, updateOrganizationById } from './service';
import { validateUpdateOrganizationDetails } from './validator';

/**
 * @swagger
 * /api/organization/{id}:
 *     put:
 *       summary: Update organization details
 *       description: Updates details of an organization identified by the provided ID.
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the organization.
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       responses:
 *          content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 */
export async function PUT(request: Request, route: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const payload = await request.json();
    const organizationId = route.params.id;

    await validateUpdateOrganizationDetails(payload);

    const organization = await updateOrganizationById(organizationId, payload);

    return new NextResponse(JSON.stringify(organization), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(JSON.stringify({ error: e.message }), {
      status:
        e.message === 'VALIDATION_ERROR'
          ? StatusCodes.BAD_REQUEST
          : StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

/**
 * @swagger
 * /api/organization/{id}:
 *     get:
 *       summary: Retrieve organization details
 *       description: Retrieves the details of an organization identified by the provided ID.
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the organization.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Organization details retrieved successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of the organization object here
 *         '401':
 *           description: Unauthorized access. Missing or invalid session credentials.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *         '404':
 *           description: Organization not found.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 */
export async function GET(request: Request, route: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.organizationId !== route.params.id) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: 401,
    });
  }
  const organization = await getOrganizationById(route.params.id);

  if (organization) {
    return new NextResponse(JSON.stringify(organization), {
      status: 200,
    });
  } else {
    return new NextResponse(
      JSON.stringify(`Organization ${route.params.id} not Found`),
      {
        status: 404,
      }
    );
  }
}
