import { NextRequest, NextResponse } from 'next/server';
import razorpay from 'razorpay';

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
      receipt: 'ACADX-' + new Date().getTime(),
      first_payment_min_amount: 1000000,
    });
    return new NextResponse(JSON.stringify(paymentResponse), {
      status: 201,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: 400,
    });
  }
}
