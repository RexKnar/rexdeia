import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { db } from 'lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils';

export const runtime = 'nodejs';

// Razorpay calls this endpoint server-to-server. It is authenticated by the
// HMAC signature over the raw request body, NOT by a user session, so a payment
// can only be marked paid once Razorpay confirms it.
export async function POST(request: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    captureException(new Error('RAZORPAY_WEBHOOK_SECRET is not configured'));
    return NextResponse.json(
      { error: 'WEBHOOK_NOT_CONFIGURED' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }

  const signature = request.headers.get('x-razorpay-signature') || '';
  const rawBody = await request.text();

  let isValidSignature = false;
  try {
    isValidSignature = validateWebhookSignature(rawBody, signature, secret);
  } catch {
    isValidSignature = false;
  }

  if (!isValidSignature) {
    return NextResponse.json(
      { error: 'INVALID_SIGNATURE' },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  try {
    const event = JSON.parse(rawBody);
    const orderId: string | undefined =
      event?.payload?.payment?.entity?.order_id ??
      event?.payload?.order?.entity?.id;

    if (
      (event?.event === 'payment.captured' || event?.event === 'order.paid') &&
      orderId
    ) {
      // transactionId stores the Razorpay order id created in /api/payment.
      await db.payment.updateMany({
        where: { transactionId: orderId },
        data: { isPaid: true },
      });
    }

    return NextResponse.json({ received: true }, { status: StatusCodes.OK });
  } catch (e) {
    captureException(e);
    return NextResponse.json(
      { error: 'WEBHOOK_PROCESSING_FAILED' },
      { status: StatusCodes.BAD_REQUEST }
    );
  }
}
