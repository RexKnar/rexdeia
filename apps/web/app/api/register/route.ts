import { z } from 'zod';
import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "./service";

export async function POST(request: NextRequest){
  const schema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    phoneNumber: z.string().regex(/^[0-9]+$/),
  });

  const { name, phoneNumber, email, password } = await request.json();

  try {
    schema.parse({ name, phoneNumber, email, password })
    const createdUser = await registerUser({ name, phoneNumber, email, password });
    return new NextResponse(JSON.stringify({ user: createdUser }), {
      status: 201,
    });
  } catch (e) {
    console.log(e);
    return new NextResponse(JSON.stringify({ error: e.message }), {
      status: 400,
    });
  }
}