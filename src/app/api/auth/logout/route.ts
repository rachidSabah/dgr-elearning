import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(/session-token=([^;]+)/);
    if (tokenMatch) {
      await db.session.deleteMany({ where: { token: tokenMatch[1] } });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete("session-token");
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
