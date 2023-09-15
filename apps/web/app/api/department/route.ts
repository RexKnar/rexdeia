import { NextRequest, NextResponse } from 'next/server';
import { getDeparment } from './service';

export async function POST(request: NextRequest) {
  const payload = await request.json();
  try {
    const department = await getDeparment(payload.departmentId);   
    return new NextResponse(JSON.stringify(department), {
      status: 200,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: 400,
    });
  }
}
