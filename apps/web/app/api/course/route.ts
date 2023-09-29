import { NextRequest, NextResponse } from 'next/server';

import { addCourse, deletCourse } from './service';
import { validateAddCourse } from './validator';

export async function POST(request: NextRequest) {
  const payload = await request.json();
  try {
    await validateAddCourse(payload);
    const createdCourse = await addCourse(payload);
    return new NextResponse(JSON.stringify(createdCourse), {
      status: 201,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: 400,
    });
  }
}

export async function DELETE(request: NextRequest) {
  const payload = await request.json();
  try {
    const deleteResponse = await deletCourse(payload.courseId);
    return new NextResponse(JSON.stringify(deleteResponse), {
      status: 200,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: 400,
    });
  }
}
