import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { addRegulation, deleteRegulation, getRegulationList } from './service';
import { validateAddRegulation } from './validator';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  try {
    const classListResponse = await getRegulationList();
    return new NextResponse(JSON.stringify(classListResponse), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
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
