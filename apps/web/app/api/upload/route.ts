import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import multer from 'multer';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { deleteFileFromGCS, uploadFileToGCS } from './service';

const upload = multer({
  storage: multer.memoryStorage(),
});

const bucket = process.env.NEXT_GCLOUD_STORAGE_BUCKET;

/**
 * @swagger
 * /api/upload:
 *     post:
 *       summary: Uploads a file to a specific folder
 *       description: >
 *         This endpoint allows for uploading a file to a given folder. It requires
 *         a valid session and a folder name specified in the request body.
 *       security:
 *         - sessionAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               required:
 *                 - file
 *               properties:
 *                 file:
 *                   type: string
 *                   format: binary
 *                   description: The file to be uploaded.
 *       responses:
 *         '200':
 *           description: File successfully uploaded
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *         '400':
 *           description: Bad request due to missing folder name or file
 *         '401':
 *           description: Unauthorized access due to missing or invalid session
 *         '500':
 *           description: Internal Server Error
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  const formData = await request.formData();
  const file: File | null = formData.get('file') as unknown as File;

  if (!file) {
    return new NextResponse(JSON.stringify({ error: 'NO_FILE_IN_REQUEST' }), {
      status: StatusCodes.BAD_REQUEST,
    });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const response = new Promise((resolve, reject) => {
    // @ts-ignore
    upload.single('file')(request, null, async (error: any) => {
      if (error) {
        return reject();
      }

      try {
        const directoryName = session.organizationId;

        const response = await uploadFileToGCS(
          bucket,
          directoryName,
          file.name,
          buffer
        );

        return resolve(response);
      } catch (error) {
        captureException(error);
        return reject();
      }
    });
  });

  try {
    const data = await response;
    return new NextResponse(JSON.stringify(data), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(JSON.stringify({}), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

/**
 * @swagger
 * /api/upload:
 *     delete:
 *       summary: Delete a file
 *       description: >
 *         This endpoint deletes a file from cloud storage. It requires
 *         a valid session and the file path as a query parameter.
 *       security:
 *         - sessionAuth: []
 *       parameters:
 *         - name: filePath
 *           in: query
 *           required: true
 *           description: The path of the file to be deleted.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: File successfully deleted
 *         '400':
 *           description: Bad request due to invalid file path
 *         '401':
 *           description: Unauthorized access due to missing or invalid session
 *         '500':
 *           description: Internal Server Error
 */

export async function DELETE(request: NextRequest) {
  try {
    const filePath = request.nextUrl.searchParams.get('filePath');
    // Check for session
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
        status: StatusCodes.UNAUTHORIZED,
      });
    }
    const response = await deleteFileFromGCS(bucket, filePath);

    return new NextResponse(JSON.stringify(response), {
      status: StatusCodes.OK,
    });
  } catch (error) {
    captureException(error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
