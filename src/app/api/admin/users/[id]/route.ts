import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, isAdmin, hashPassword } from "@/lib/auth";

// GET /api/admin/users/[id] - Get user details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;

    const target = await db.user.findUnique({
      where: { id },
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
            examAttempts: true,
            auditLogs: true,
            createdCourses: true,
            createdLessons: true,
          },
        },
      },
    });

    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ data: target });
  } catch (error) {
    console.error("Admin user GET error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// PUT /api/admin/users/[id] - Update user (hash password if provided)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const existing = await db.user.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent non-super-admins from editing super-admins
    if (existing.role === "SUPER_ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Only super admins can edit super admin accounts" },
        { status: 403 }
      );
    }

    // Check email uniqueness if changing
    if (body.email && body.email.toLowerCase() !== existing.email) {
      const emailExists = await db.user.findUnique({
        where: { email: body.email.toLowerCase() },
      });
      if (emailExists) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 });
      }
    }

    const updateData: Record<string, unknown> = {};
    const allowedFields = [
      "name",
      "role",
      "avatar",
      "phone",
      "department",
      "employeeId",
      "isActive",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === "isActive") {
          updateData[field] = Boolean(body[field]);
        } else {
          updateData[field] = body[field];
        }
      }
    }

    if (body.email !== undefined) {
      updateData.email = body.email.toLowerCase();
    }

    // Hash password if provided
    if (body.password !== undefined && body.password !== "") {
      updateData.passwordHash = hashPassword(body.password);
    }

    const updated = await db.user.update({
      where: { id },
      data: updateData,
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
        updatedAt: true,
      },
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "UPDATE_USER",
        entity: "User",
        entityId: id,
        details: JSON.stringify({ fields: Object.keys(updateData) }),
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
        userAgent: request.headers.get("user-agent") || undefined,
      },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("Admin user PUT error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id] - Delete user (prevent self / last super admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;

    // Prevent deleting self
    if (id === user.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    const existing = await db.user.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent deleting the last super admin
    if (existing.role === "SUPER_ADMIN") {
      const superAdminCount = await db.user.count({
        where: { role: "SUPER_ADMIN", isActive: true },
      });
      if (superAdminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot delete the last super admin" },
          { status: 400 }
        );
      }
    }

    await db.user.delete({ where: { id } });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "DELETE_USER",
        entity: "User",
        entityId: id,
        details: JSON.stringify({ email: existing.email, role: existing.role }),
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
        userAgent: request.headers.get("user-agent") || undefined,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin user DELETE error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
