import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import multer from 'multer';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import fileHandler from '../service';
import { addSubjectMasterCSV } from './service';

const upload = multer({
  storage: multer.memoryStorage(),
});
/**
 * @swagger
 * /api/csv-upload/subject-master:
 *   post:
 *     summary: Add new SubjectMaster
 *     description: Add New SubjectMaster by uploading a CSV file
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The CSV file to upload.
 *     responses:
 *       '200':
 *         description: SubjectMaster details added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 # Define the schema of your SubjectMaster object here
 *       '400':
 *         description: Bad request due to validation error.
 *       '401':
 *         description: Unauthorized access.
 *       '500':
 *         description: Internal server error.
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

  const csvResponse = new Promise((resolve, reject) => {
    // @ts-ignore
    upload.single('file')(request, null, async (error: any) => {
      if (error) {
        return reject();
      }

      try {
        const csvResponse = await fileHandler(file.name, buffer);

        return resolve(csvResponse);
      } catch (error) {
        captureException(error);
        return reject();
      }
    });
  });

  try {
    const data = await csvResponse;
    const dbResponse = await addSubjectMasterCSV(data);
    return new NextResponse(JSON.stringify(dbResponse), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(JSON.stringify({}), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
