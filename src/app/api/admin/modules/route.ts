import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, isAdmin } from "@/lib/auth";

// GET /api/admin/modules - List modules (optional courseId filter)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    const modules = await db.module.findMany({
      where: courseId ? { courseId } : undefined,
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      include: {
        course: {
          select: { id: true, title: true, slug: true },
        },
        _count: {
          select: { lessons: true },
        },
      },
    });

    return NextResponse.json({ data: modules });
  } catch (error) {
    console.error("Admin modules GET error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// POST /api/admin/modules - Create a module
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { courseId, title, code, description, icon, color, order, isPublished } = body;

    if (!courseId || !title) {
      return NextResponse.json(
        { error: "Missing required fields: courseId, title" },
        { status: 400 }
      );
    }

    // Verify course exists
    const course = await db.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const module = await db.module.create({
      data: {
        courseId,
        title,
        code: code || null,
        description: description || null,
        icon: icon || null,
        color: color || null,
        order: order !== undefined ? Number(order) : 0,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      },
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "CREATE_MODULE",
        entity: "Module",
        entityId: module.id,
        details: JSON.stringify({ title, courseId }),
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
        userAgent: request.headers.get("user-agent") || undefined,
      },
    });

    return NextResponse.json({ data: module }, { status: 201 });
  } catch (error) {
    console.error("Admin modules POST error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
