import { NextRequest, NextResponse } from 'next/server';

import { getEnquiryList } from './service';
import { StatusCodes } from 'http-status-codes';

export async function POST(request: NextRequest) {
  const payload = await request.json();
  try {
    const enquiryList = await getEnquiryList(payload.pageValue);
    return new NextResponse(JSON.stringify(enquiryList), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    console.log('error');
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
