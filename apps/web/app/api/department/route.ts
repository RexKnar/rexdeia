import { NextRequest, NextResponse } from 'next/server';

import { addDepartment, deleteDeparment, editDepartment } from './service';
import { validateAddDepartment } from './validator';

export async function POST(request: NextRequest) {
  const payload = await request.json();
  try {
    await validateAddDepartment(payload);
    const createdDepartment = await addDepartment(payload);
    return new NextResponse(JSON.stringify(createdDepartment), {
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

export async function PUT(request: NextRequest) {
  const payload = await request.json();
  try {
    await validateAddDepartment(payload);
    const updateResponse = await editDepartment(payload);
    return new NextResponse(JSON.stringify(updateResponse), {
      status: 201,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: 400,
    });
  }
}
