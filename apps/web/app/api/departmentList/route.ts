import { NextRequest, NextResponse } from 'next/server';
import { getDeparmentList } from './service';

export async function GET(request: NextRequest) {
  try {
    const admissionList = await getDeparmentList();
    return new NextResponse(JSON.stringify(admissionList), {
      status: 200,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: 400,
    });
  }
}
