import { NextRequest, NextResponse } from 'next/server';
import { addUser } from './service';
import { validateAddUser } from './validator';

export async function POST(request: NextRequest) {
  const payload = await request.json();

  try {
    await validateAddUser(payload);
    const createdUser = await addUser(payload);

    return new NextResponse(JSON.stringify(createdUser), {
      status: 201,
    });
  } catch (e) {
    return new NextResponse(JSON.stringify({ error: e.message }), {
      status:
        e.message === 'VALIDATION_ERROR' || e.message === 'USER_ALREADY_EXISTS'
          ? 400
          : 500,
    });
  }
}
