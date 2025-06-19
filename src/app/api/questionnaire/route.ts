import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { serverAuthOptions } from "@/lib/serverAuthOptions";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(serverAuthOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { year, answers } = await req.json();
    // Find user
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // Upsert questionnaire for this year (compound unique key)
    const questionnaire = await prisma.questionnaire.upsert({
      where: { userId_year: { userId: user.id, year } },
      update: { answers },
      create: { year, answers, userId: user.id },
    });
    return NextResponse.json({ success: true, questionnaire });
  } catch (error) {
    console.error("POST /api/questionnaire error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: (error as Error).message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(serverAuthOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const year = Number(req.nextUrl.searchParams.get("year"));
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const questionnaire = await prisma.questionnaire.findUnique({
      where: { userId_year: { userId: user.id, year } },
    });
    return NextResponse.json({ questionnaire });
  } catch (error) {
    console.error("GET /api/questionnaire error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: (error as Error).message }, { status: 500 });
  }
}
