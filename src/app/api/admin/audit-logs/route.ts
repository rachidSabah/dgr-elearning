import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, isAdmin } from "@/lib/auth";

// GET /api/admin/audit-logs - List audit logs (with user info, pagination, filter by action)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const userId = searchParams.get("userId");
    const entity = searchParams.get("entity");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const skip = (page - 1) * limit;

    const where = {
      ...(action ? { action } : {}),
      ...(userId ? { userId } : {}),
      ...(entity ? { entity } : {}),
      ...(search
        ? {
            OR: [
              { action: { contains: search } },
              { entity: { contains: search } },
              { details: { contains: search } },
              { user: { name: { contains: search } } },
              { user: { email: { contains: search } } },
            ],
          }
        : {}),
    };

    const [logs, total] = await Promise.all([
      db.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              avatar: true,
            },
          },
        },
      }),
      db.auditLog.count({ where }),
    ]);

    const data = logs.map((log) => ({
      ...log,
      details: log.details ? safeParse(log.details) : null,
    }));

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin audit-logs GET error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

function safeParse(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return s;
  }
}
