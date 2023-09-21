import { NextRequest, NextResponse } from 'next/server';

import { deleteDeparment } from './service';

export async function DELETE(request: NextRequest) {
  const payload = await request.json();
  try {
    const deleteResponse = await deleteDeparment(payload.departmentId);
    return new NextResponse(JSON.stringify(deleteResponse), {
      status: 200,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: 400,
    });
  }
}
