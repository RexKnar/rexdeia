import { NextRequest, NextResponse } from 'next/server';

import { addRegulation } from './service';
import { validateAddRegulation } from './validator';

export async function POST(request: NextRequest) {
  const payload = await request.json();
  try {
    await validateAddRegulation(payload);
    const createdRegulation = await addRegulation(payload);
    return new NextResponse(JSON.stringify(createdRegulation), {
      status: 201,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: 400,
    });
  }
}
