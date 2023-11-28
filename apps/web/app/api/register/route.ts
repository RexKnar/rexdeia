import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { onBoardUserAndOrganization } from './service';
import { validateAddUser } from './validator';

export async function POST(request: NextRequest) {
  const payload = await request.json();

  try {
    await validateAddUser(payload);
    const createdUser = await onBoardUserAndOrganization(payload);
    return new NextResponse(JSON.stringify(createdUser), {
      status: StatusCodes.CREATED,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
