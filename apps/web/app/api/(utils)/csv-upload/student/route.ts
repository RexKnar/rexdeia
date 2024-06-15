import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import multer from 'multer';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import fileHandler from '../service';
import { addStudentCSV } from './service';

const upload = multer({
  storage: multer.memoryStorage(),
});

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
    const dbResponse = await addStudentCSV(data);
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
