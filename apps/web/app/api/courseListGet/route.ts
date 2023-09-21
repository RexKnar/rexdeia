import { NextRequest, NextResponse } from 'next/server';

import { getCourseList } from './service';

export async function GET(request: NextRequest) {
  try {
    const regulationList = await getCourseList();
    return new NextResponse(JSON.stringify(regulationList), {
      status: 200,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: 400,
    });
  }
}
