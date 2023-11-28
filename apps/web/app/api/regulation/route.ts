import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { addRegulation, deleteRegulation } from './service';
import { validateAddRegulation } from './validator';

export async function POST(request: NextRequest) {
  const payload = await request.json();
  try {
    await validateAddRegulation(payload);
    const createdRegulation = await addRegulation(payload);
    return new NextResponse(JSON.stringify(createdRegulation), {
      status: StatusCodes.CREATED,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}

export async function DELETE(request: NextRequest) {
  const payload = await request.json();
  try {
    const deleteResponse = await deleteRegulation(payload.regulationId);
    return new NextResponse(JSON.stringify(deleteResponse), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
