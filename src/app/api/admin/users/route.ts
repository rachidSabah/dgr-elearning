import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, isAdmin, hashPassword } from "@/lib/auth";

// GET /api/admin/users - List all users (exclude passwordHash)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const search = searchParams.get("search");

    const users = await db.user.findMany({
      where: {
        ...(role ? { role } : {}),
        ...(search
          ? {
              OR: [
                { email: { contains: search } },
                { name: { contains: search } },
                { employeeId: { contains: search } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        phone: true,
        department: true,
        employeeId: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            enrollments: true,
            certificates: true,
            quizAttempts: true,
            auditLogs: true,
          },
        },
      },
    });

    return NextResponse.json({ data: users });
  } catch (error) {
    console.error("Admin users GET error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// POST /api/admin/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { email, name, password, role, department, phone, employeeId } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing required fields: email, password" },
        { status: 400 }
      );
    }

    // Check email uniqueness
    const existing = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const passwordHash = hashPassword(password);

    const newUser = await db.user.create({
      data: {
        email: email.toLowerCase(),
        name: name || null,
        passwordHash,
        role: role || "STUDENT",
        department: department || null,
        phone: phone || null,
        employeeId: employeeId || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        department: true,
        phone: true,
        employeeId: true,
        isActive: true,
        createdAt: true,
      },
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "CREATE_USER",
        entity: "User",
        entityId: newUser.id,
        details: JSON.stringify({ email: newUser.email, role: newUser.role }),
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
        userAgent: request.headers.get("user-agent") || undefined,
      },
    });

    return NextResponse.json({ data: newUser }, { status: 201 });
  } catch (error) {
    console.error("Admin users POST error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
