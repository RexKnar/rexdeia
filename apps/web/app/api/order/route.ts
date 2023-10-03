import { NextRequest, NextResponse } from 'next/server';
import razorpay from 'razorpay';

const instance = new razorpay({
  key_id: 'rzp_test_FgPdhSoHy5q9CO',
  key_secret: 'xt6nQmfxv4bjKZdC0xEU14ei',
});

export async function POST(request: NextRequest) {
  const payload = await request.json();
  try {
    instance.orders
      .create({
        amount: payload.amount * 100,
        currency: 'INR',
        receipt: 'REXCODER-' + Math.random(),
        first_payment_min_amount: 1000000,
      })
      .then(async (paymentResponse) => {
        console.log(paymentResponse);
      })
      .catch((paymentError) => {
        console.log(paymentError);
      });

    return new NextResponse(JSON.stringify('payment success'), {
      status: 201,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: 400,
    });
  }
}
