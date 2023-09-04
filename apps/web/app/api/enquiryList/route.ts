import { NextRequest, NextResponse } from 'next/server';
import { getEnquiryList } from './service';

export async function POST(request: NextRequest) {
  const payload = await request.json();
  try {
    const enquiryList = await getEnquiryList(payload.pageValue);
    return new NextResponse(JSON.stringify(enquiryList), {
      status: 200,
    });
  } catch (e) {
    console.log("error");
    return new NextResponse(e, {
      status: 400,
    });
  }
}
