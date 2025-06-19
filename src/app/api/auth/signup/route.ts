import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }
    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered." }, { status: 409 });
    }
    // Hash password
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed },
    });
    // Create an initial empty questionnaire for the current year (2025)
    await prisma.questionnaire.create({
      data: {
        year: 2025,
        answers: {},
        userId: user.id,
      },
    });
    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error", details: (error as Error).message }, { status: 500 });
  }
}
