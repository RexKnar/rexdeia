import { NextRequest, NextResponse } from 'next/server';

import { editDepartment } from './service';
import { validateAddUser } from './validator';

export async function PUT(request: NextRequest) {
  const payload = await request.json();
  try {
    await validateAddUser(payload);
    const createdUser = await editDepartment(payload);
    return new NextResponse(JSON.stringify(createdUser), {
      status: 201,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: 400,
    });
  }
}
