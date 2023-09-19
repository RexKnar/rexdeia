import { NextRequest, NextResponse } from 'next/server';
import { getRegulationList } from './service';

export async function GET(request: NextRequest) {
  try {
    const regulationList = await getRegulationList();
    return new NextResponse(JSON.stringify(regulationList), {
      status: 200,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: 400,
    });
  }
}
