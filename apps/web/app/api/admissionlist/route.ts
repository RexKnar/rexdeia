import { NextRequest, NextResponse } from 'next/server';

import { getAdmissionList } from './service';

export async function POST(request: NextRequest) {
  const payload = await request.json();
  try {
    const admissionList = await getAdmissionList(
      payload.pageValue,
      payload.tablePaginationLimit
    );
    return new NextResponse(JSON.stringify(admissionList), {
      status: 200,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: 400,
    });
  }
}
