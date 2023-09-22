import { NextResponse } from 'next/server';

import { getAdmissionList } from './service';

export async function GET() {
  try {
    const admissionList = await getAdmissionList();
    return new NextResponse(JSON.stringify(admissionList), {
      status: 200,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: 400,
    });
  }
}
