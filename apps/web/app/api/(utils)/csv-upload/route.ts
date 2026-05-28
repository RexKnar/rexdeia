import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { requireSession } from 'lib/utils/api-auth';
import multer from 'multer';
import { NextRequest, NextResponse } from 'next/server';

import fileHandler from './service';

const upload = multer({
  storage: multer.memoryStorage(),
});

export async function POST(request: NextRequest) {
  const { response } = await requireSession();
  if (response) return response;

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
        const response = await fileHandler(file.name, buffer);

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
