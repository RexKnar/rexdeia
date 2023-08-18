import { NextRequest, NextResponse } from 'next/server';
import { getAdmissionList } from './service';


export async function GET(request: NextRequest) {
  try {
    const admissionList = await getAdmissionList();
    return new NextResponse(JSON.stringify(admissionList), {
      status: 200,
    });
  } catch (e) {
    console.log("error");
    return new NextResponse(e, {
      status: 400,
    });
  }
}


