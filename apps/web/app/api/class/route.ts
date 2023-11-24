import { NextRequest, NextResponse } from 'next/server';
import { addClass } from './service';
import { StatusCodes } from 'http-status-codes';

export async function POST(request: NextRequest) {
  const payload = await request.json();
  try {
    const createdClass = await addClass(payload);
    return new NextResponse(JSON.stringify(createdClass), {
      status: StatusCodes.CREATED,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
