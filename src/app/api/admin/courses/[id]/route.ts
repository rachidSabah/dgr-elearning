import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, isAdmin } from "@/lib/auth";

// GET /api/admin/courses/[id] - Get single course with modules and lessons
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

    const course = await db.course.findUnique({
      where: { id },
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              orderBy: { order: "asc" },
            },
          },
        },
        author: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: {
            enrollments: true,
            certificates: true,
            examAttempts: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const data = {
      ...course,
      objectives: course.objectives ? JSON.parse(course.objectives) : [],
      tags: course.tags ? JSON.parse(course.tags) : [],
      prerequisites: course.prerequisites
        ? JSON.parse(course.prerequisites)
        : [],
      modules: course.modules.map((m) => ({
        ...m,
        lessons: m.lessons.map((l) => ({
          ...l,
          objectives: l.objectives ? JSON.parse(l.objectives) : [],
          keyTerms: l.keyTerms ? JSON.parse(l.keyTerms) : [],
          summary: l.summary ? JSON.parse(l.summary) : [],
          reviewQuestions: l.reviewQuestions
            ? JSON.parse(l.reviewQuestions)
            : [],
          // Don't return full content in list view for performance
          contentPreview: l.content
            ? JSON.parse(l.content).slice(0, 1)
            : [],
        })),
      })),
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Admin course GET error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// PUT /api/admin/courses/[id] - Update a course
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

    const existing = await db.course.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check slug uniqueness if changing
    if (body.slug && body.slug !== existing.slug) {
      const slugExists = await db.course.findUnique({
        where: { slug: body.slug },
      });
      if (slugExists) {
        return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
      }
    }

    const updateData: Record<string, unknown> = {};
    const allowedFields = [
      "title",
      "slug",
      "description",
      "category",
      "difficulty",
      "duration",
      "icon",
      "color",
      "coverImage",
      "isPublished",
      "isFeatured",
      "order",
      "startDate",
      "endDate",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === "duration" || field === "order") {
          updateData[field] = Number(body[field]);
        } else if (field === "isPublished" || field === "isFeatured") {
          updateData[field] = Boolean(body[field]);
        } else if (field === "startDate" || field === "endDate") {
          updateData[field] = body[field] ? new Date(body[field]) : null;
        } else {
          updateData[field] = body[field];
        }
      }
    }

    if (body.objectives !== undefined) {
      updateData.objectives = body.objectives
        ? JSON.stringify(body.objectives)
        : null;
    }
    if (body.tags !== undefined) {
      updateData.tags = body.tags ? JSON.stringify(body.tags) : null;
    }
    if (body.prerequisites !== undefined) {
      updateData.prerequisites = body.prerequisites
        ? JSON.stringify(body.prerequisites)
        : null;
    }

    const course = await db.course.update({
      where: { id },
      data: updateData,
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "UPDATE_COURSE",
        entity: "Course",
        entityId: id,
        details: JSON.stringify({ fields: Object.keys(updateData) }),
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
        userAgent: request.headers.get("user-agent") || undefined,
      },
    });

    return NextResponse.json({ data: course });
  } catch (error) {
    console.error("Admin course PUT error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// DELETE /api/admin/courses/[id] - Delete a course (cascade)
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

    const existing = await db.course.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    await db.course.delete({ where: { id } });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "DELETE_COURSE",
        entity: "Course",
        entityId: id,
        details: JSON.stringify({ title: existing.title, slug: existing.slug }),
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
        userAgent: request.headers.get("user-agent") || undefined,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin course DELETE error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
