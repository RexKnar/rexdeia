import { StatusCodes } from 'http-status-codes';
import { NextRequest } from 'next/server';

import { getStudentById } from '../service';

export async function GET(_: NextRequest, { params: { id } }) {
  try {
    const student = await getStudentById(id);

    if (student) {
      return new Response(JSON.stringify(student), {
        status: StatusCodes.OK,
      });
    } else {
      return new Response(JSON.stringify({ error: 'STUDENT_NOT_FOUND' }), {
        status: StatusCodes.NOT_FOUND,
      });
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
