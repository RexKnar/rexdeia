import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../../lib/auth';
import { getServerSession } from 'next-auth';
import { validateAddForm } from './validator';
import { addForm } from './service';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: 401,
    });
  }

  try {
    const payload = await request.json();

    await validateAddForm(payload);
    const createdForm = await addForm({
      ...payload,
    });

    return new NextResponse(JSON.stringify(createdForm), {
      status: 201,
    });
  } catch (e) {
    console.error(e);
    return new NextResponse(JSON.stringify({ error: e.message }), {
      status: e.message === 'VALIDATION_ERROR' ? 400 : 500,
    });
  }
}
