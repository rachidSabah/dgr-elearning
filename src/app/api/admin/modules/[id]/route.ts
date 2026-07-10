import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, isAdmin } from "@/lib/auth";

// GET /api/admin/modules/[id] - Get single module with lessons
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

    const module = await db.module.findUnique({
      where: { id },
      include: {
        course: {
          select: { id: true, title: true, slug: true },
        },
        lessons: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!module) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    return NextResponse.json({ data: module });
  } catch (error) {
    console.error("Admin module GET error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// PUT /api/admin/modules/[id] - Update a module
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

    const existing = await db.module.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    const allowedFields = [
      "title",
      "code",
      "description",
      "icon",
      "color",
      "isPublished",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === "isPublished") {
          updateData[field] = Boolean(body[field]);
        } else {
          updateData[field] = body[field];
        }
      }
    }
    if (body.order !== undefined) updateData.order = Number(body.order);
    if (body.courseId !== undefined) updateData.courseId = body.courseId;

    const module = await db.module.update({
      where: { id },
      data: updateData,
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "UPDATE_MODULE",
        entity: "Module",
        entityId: id,
        details: JSON.stringify({ fields: Object.keys(updateData) }),
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
        userAgent: request.headers.get("user-agent") || undefined,
      },
    });

    return NextResponse.json({ data: module });
  } catch (error) {
    console.error("Admin module PUT error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// DELETE /api/admin/modules/[id] - Delete module (cascade deletes lessons)
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

    const existing = await db.module.findUnique({
      where: { id },
      include: { _count: { select: { lessons: true } } },
    });
    if (!existing) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    // Cascade is configured at the schema level (onDelete: Cascade on Lesson.module)
    await db.module.delete({ where: { id } });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "DELETE_MODULE",
        entity: "Module",
        entityId: id,
        details: JSON.stringify({
          title: existing.title,
          lessonsDeleted: existing._count.lessons,
        }),
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
        userAgent: request.headers.get("user-agent") || undefined,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin module DELETE error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
