import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { requireSession } from 'lib/utils/api-auth';
import { NextRequest, NextResponse } from 'next/server';
import razorpay from 'razorpay';

import { getOrganizationById } from '../organization/[id]/service';
import { AddPayment, addPaymentAssociation } from './service';
import { validateAddPayment } from './validator';

const instance = new razorpay({
  key_id: `${process.env['NEXT_RAZORPAY_KEY_ID']}`,
  key_secret: `${process.env['NEXT_RAZORPAY_KEY_SECRET']}`,
});

export async function POST(request: NextRequest) {
  const { session, response } = await requireSession();
  if (response) return response;

  try {
    const payload = await request.json();
    const validated = await validateAddPayment(payload);

    // Organization comes from the authenticated session, never from the client,
    // so a caller cannot create payment orders against another tenant.
    const organizationId = session.organizationId;
    const organization = await getOrganizationById(organizationId);
    if (!organization) {
      return NextResponse.json(
        { error: 'ORGANIZATION_NOT_FOUND' },
        { status: StatusCodes.NOT_FOUND }
      );
    }

    const paymentResponse = await instance.orders.create({
      amount: Math.round(validated.amount * 100),
      currency: 'INR',
      receipt: `${organization.name}-${Date.now()}`,
      notes: {
        organizationId,
        associationType: validated.associationType,
        associationEntityId: validated.associationEntityId,
      },
    });

    const createdPayment = await AddPayment({
      transactionId: paymentResponse.id,
      receipt: paymentResponse.receipt,
      amount: JSON.stringify(paymentResponse.amount),
      paymentDate: JSON.stringify(paymentResponse.created_at),
    });

    const createdPaymentAssociation = await addPaymentAssociation({
      associationType: validated.associationType,
      associationEntityId: validated.associationEntityId,
      paymentId: createdPayment.id,
    });

    return NextResponse.json(createdPaymentAssociation, {
      status: StatusCodes.CREATED,
    });
  } catch (e) {
    captureException(e);
    return NextResponse.json(
      { error: 'PAYMENT_ORDER_FAILED' },
      { status: StatusCodes.BAD_REQUEST }
    );
  }
}
