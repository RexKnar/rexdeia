import { NextRequest, NextResponse } from 'next/server';

import { addCourse } from './service';
import { validateAddCourse } from './validator';

export async function POST(request: NextRequest) {
  const payload = await request.json();
  try {
    await validateAddCourse(payload);
    const createdDepartment = await addCourse(payload);
    return new NextResponse(JSON.stringify(createdDepartment), {
      status: 201,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: 400,
    });
  }
}
