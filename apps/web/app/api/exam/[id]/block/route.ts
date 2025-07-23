import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { updateBlockExam } from '../service';

const BlockSchema = z.object({
  blockMarkEntry: z.boolean(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { examId: string } }
) {
  try {
    const { examId } = params;
    const body = await req.json();
    const { blockMarkEntry } = BlockSchema.parse(body);

    const updatedExam = await updateBlockExam(examId, blockMarkEntry);

    return NextResponse.json({ success: true, data: updatedExam });
  } catch (error) {
    console.error('[PUT /exam/[examId]/block]', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update blockMarkEntry' },
      { status: 400 }
    );
  }
}
