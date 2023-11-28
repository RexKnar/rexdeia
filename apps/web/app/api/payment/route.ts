import { StatusCodes } from 'http-status-codes';
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
  const payload = await request.json();
  try {
    const organization = await getOrganizationById(payload.organizationId);
    const paymentResponse = await instance.orders.create({
      amount: payload.amount * 100,
      currency: 'INR',
      receipt: `${organization.name}-${new Date().getTime()}`,
      first_payment_min_amount: 1000000,
    });
    const paymentData = {
      transactionId: paymentResponse.id,
      receipt: paymentResponse.receipt,
      amount: JSON.stringify(paymentResponse.amount),
      paymentDate: JSON.stringify(paymentResponse.created_at),
    };
    await validateAddPayment(payload);
    const createdPayment = await AddPayment(paymentData);
    const paymentAssociation = {
      associationType: payload.associationType,
      associationEntityId: payload.associationEntityId,
      paymentId: createdPayment.id,
    };
    const createdPaymentAssociation =
      await addPaymentAssociation(paymentAssociation);
    return new NextResponse(JSON.stringify(createdPaymentAssociation), {
      status: StatusCodes.CREATED,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
