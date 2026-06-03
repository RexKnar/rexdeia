import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { storage } from 'lib/gcs';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { deleteFileFromGCS, uploadFileToGCS } from './service';

export const runtime = 'nodejs';

// const bucket = process.env.NEXT_GCS_BUCKET_NAME || '';

// const upload = multer({
//   storage: multer.memoryStorage(),
// });

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

  // Check if file is video
  const isVideo = file.type.startsWith('video/');

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    const directoryName = session.organizationId;
    const data = await uploadFileToGCS(
      bucket,
      directoryName,
      file.name,
      buffer,
      file.type,
      isVideo
    );

    return new NextResponse(JSON.stringify(data), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(JSON.stringify({ error: 'UPLOAD_FAILED', e }), {
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

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const url = new URL(request.url);
    const filePath = url.searchParams.get('path');

    if (!filePath) {
      return new NextResponse('File path is required', { status: 400 });
    }

    // Get file from GCS
    const gcs = storage.bucket(bucket);
    const file = gcs.file(filePath);

    // Check if file exists
    const [exists] = await file.exists();
    if (!exists) {
      return new NextResponse('File not found', { status: 404 });
    }

    // Get file metadata
    const [metadata] = await file.getMetadata();
    const contentType = metadata.contentType;
    const contentLength: any = metadata.size;

    // Handle range requests (for streaming)
    const rangeHeader = request.headers.get('range');

    if (rangeHeader) {
      // Parse range header
      const parts = rangeHeader.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : contentLength - 1;
      const chunkSize = end - start + 1;

      // Create readable stream with specified range
      const stream = file.createReadStream({
        start,
        end,
      });

      // Create response headers
      const headers = {
        'Content-Range': `bytes ${start}-${end}/${contentLength}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize.toString(),
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
      };

      // Return a streaming response
      return new NextResponse(stream as any, {
        status: 206,
        headers: headers,
      });
    } else {
      // Handle non-range requests (full file download)
      const stream = file.createReadStream();

      // Create response headers
      const headers = {
        'Content-Length': contentLength.toString(),
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000',
      };

      // Return a streaming response for the entire file
      return new NextResponse(stream as any, {
        status: 200,
        headers: headers,
      });
    }
  } catch (error) {
    captureException(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
