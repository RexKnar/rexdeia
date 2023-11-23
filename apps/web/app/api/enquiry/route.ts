import { NextRequest, NextResponse } from 'next/server';

import { addEnquiry } from './service';
import { validateAddEnquiry } from './validator';
import { StatusCodes } from 'http-status-codes';

export async function POST(request: NextRequest) {
  const payload = await request.json();
  try {
    await validateAddEnquiry(payload);
    const formId = request.nextUrl.searchParams.get('formId');

    const createdEnquiry = await addEnquiry(formId, payload);
    return new NextResponse(JSON.stringify(createdEnquiry), {
      status: StatusCodes.CREATED,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
