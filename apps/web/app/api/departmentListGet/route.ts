import { NextRequest, NextResponse } from 'next/server';

import { getDeparmentList } from './service';

export async function GET(request: NextRequest) {
  try {
    const departmentList = await getDeparmentList();
    return new NextResponse(JSON.stringify(departmentList), {
      status: 200,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: 400,
    });
  }
}
