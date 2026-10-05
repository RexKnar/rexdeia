import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { db } from 'lib/db';
import { getAuthSession } from 'lib/mobile-auth';
import { NextRequest, NextResponse } from 'next/server';
import { generateSignedUrl, uploadFileToGCS } from 'app/api/upload/service';
import { verifySectionIncharge } from '../../helpers';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAuthSession(request);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'UNAUTHORIZED' },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  const studentId = params?.id;
  if (!studentId) {
    return NextResponse.json(
      { error: 'STUDENT_ID_REQUIRED' },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  try {
    // 1. Fetch student
    const existingStudent = await db.student.findFirst({
      where: {
        id: studentId,
        branchId: session.branchId,
        organizationId: session.organizationId,
        isDeleted: false,
      },
      include: {
        studentMapping: {
          where: { isCurrent: true },
          select: { sectionId: true, batchId: true },
        },
      },
    });

    if (!existingStudent) {
      return NextResponse.json(
        { error: 'STUDENT_NOT_FOUND' },
        { status: StatusCodes.NOT_FOUND }
      );
    }

    // 2. Authorize section incharge or Admin
    const currentMapping = existingStudent.studentMapping[0] || null;
    const isAuthorized = await verifySectionIncharge(
      session,
      currentMapping?.sectionId,
      currentMapping?.batchId
    );

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'FORBIDDEN_NOT_SECTION_INCHARGE' },
        { status: StatusCodes.FORBIDDEN }
      );
    }

    // 3. Extract image buffer
    const contentType = request.headers.get('content-type') || '';
    let buffer: Buffer;
    let fileName = `student-${studentId}-${Date.now()}.jpg`;

    if (contentType.includes('application/json')) {
      const body = await request.json();
      if (!body?.photoBase64) {
        return NextResponse.json(
          { error: 'PHOTO_BASE64_REQUIRED' },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      const rawBase64 = body.photoBase64.replace(/^data:image\/\w+;base64,/, '');
      buffer = Buffer.from(rawBase64, 'base64');
      if (body.fileName) {
        fileName = body.fileName;
      }
    } else {
      const formData = await request.formData();
      const file = (formData.get('photo') || formData.get('file')) as File | null;
      if (!file) {
        return NextResponse.json(
          { error: 'PHOTO_FILE_REQUIRED' },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
      if (file.name) {
        fileName = file.name;
      }
    }

    // 4. Upload to GCS
    const bucket = process.env.NEXT_GCLOUD_STORAGE_BUCKET;
    if (!bucket) {
      return NextResponse.json(
        { error: 'STORAGE_BUCKET_NOT_CONFIGURED' },
        { status: StatusCodes.INTERNAL_SERVER_ERROR }
      );
    }

    const uploadRes: any = await uploadFileToGCS(
      bucket,
      session.organizationId,
      fileName,
      buffer
    );

    const filePath = uploadRes?.data?.filePath;
    if (!filePath) {
      return NextResponse.json(
        { error: 'UPLOAD_FAILED' },
        { status: StatusCodes.INTERNAL_SERVER_ERROR }
      );
    }

    // 5. Update student record
    await db.student.update({
      where: { id: studentId },
      data: { profileImage: filePath },
    });

    // 6. Generate signed URL for immediate client display
    let signedUrl = filePath;
    try {
      signedUrl = await generateSignedUrl(filePath);
    } catch {
      signedUrl = filePath;
    }

    return NextResponse.json({
      success: true,
      message: 'Student photo updated successfully',
      data: {
        profileImage: signedUrl,
        filePath,
      },
    });
  } catch (error: any) {
    captureException(error);
    return NextResponse.json(
      { error: error.message || 'FAILED_TO_UPLOAD_PHOTO' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
