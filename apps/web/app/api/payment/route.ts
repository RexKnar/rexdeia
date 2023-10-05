import { NextRequest, NextResponse } from 'next/server';
import razorpay from 'razorpay';

import { AddPayment, addPaymentAssociation } from './service';

const instance = new razorpay({
  key_id: 'rzp_test_FgPdhSoHy5q9CO',
  key_secret: 'xt6nQmfxv4bjKZdC0xEU14ei',
});

export async function POST(request: NextRequest) {
  const payload = await request.json();
  try {
    const paymentResponse = await instance.orders.create({
      amount: payload.amount * 100,
      currency: 'INR',
      receipt: `${payload.organization}-${new Date().getTime()}`,
      first_payment_min_amount: 1000000,
    });
    const paymentData = {
      transactionId: paymentResponse.id,
      receipt: paymentResponse.receipt,
      amount: JSON.stringify(paymentResponse.amount),
      paymentDate: JSON.stringify(paymentResponse.created_at),
    };
    const createdPayment = await AddPayment(paymentData);
    const paymentAssociation = {
      associationType: payload.associationType,
      associationEntityId: payload.associationEntityId,
      paymentId: createdPayment.id,
    };
    const createdPaymentAssociation =
      await addPaymentAssociation(paymentAssociation);
    return new NextResponse(JSON.stringify(createdPaymentAssociation), {
      status: 201,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: 400,
    });
  }
}
