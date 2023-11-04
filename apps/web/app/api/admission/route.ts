import { NextRequest, NextResponse } from 'next/server';

import { addAdmission, getAdmissionsList } from './service';
import { validateAddUser } from './validator';

export async function GET(request: NextRequest) {
  try {
    const page = parseInt(request.nextUrl.searchParams.get('page')) || 1;
    const pageSize =
      parseInt(request.nextUrl.searchParams.get('pageSize')) || 10;

    const admission = await getAdmissionsList(page, pageSize);
    return new NextResponse(JSON.stringify(admission), {
      status: 200,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: 400,
    });
  }
}

export async function POST(request: NextRequest) {
  const payload = await request.json();

  try {
    await validateAddUser(payload);
    const formId = request.nextUrl.searchParams.get('formId');

    const admission = await addAdmission(formId, payload);
    return new NextResponse(JSON.stringify(admission), {
      status: 201,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: 400,
    });
  }
}
