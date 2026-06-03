import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { requireSession } from 'lib/utils/api-auth';
import { NextRequest, NextResponse } from 'next/server';

import { getEnquiryList } from './service';

export async function POST(request: NextRequest) {
  const { session, response } = await requireSession();
  if (response) return response;

  const payload = await request.json();
  try {
    const enquiryList = await getEnquiryList(
      payload.pageValue,
      session.organizationId
    );
    return new NextResponse(JSON.stringify(enquiryList), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
