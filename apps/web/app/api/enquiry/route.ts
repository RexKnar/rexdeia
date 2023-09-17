import { NextRequest, NextResponse } from 'next/server';

import { addEnquiry } from './service';
import { validateAddUser } from './validator';

export async function POST(request: NextRequest) {
  const payload = await request.json();
  try {
    await validateAddUser(payload);
    const createdEnquiry = await addEnquiry(payload);
    return new NextResponse(JSON.stringify(createdEnquiry), {
      status: 201,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: 400,
    });
  }
}
