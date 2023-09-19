import { NextRequest, NextResponse } from 'next/server';

import { addAdmission } from './service';
import { validateAddUser } from './validator';

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
