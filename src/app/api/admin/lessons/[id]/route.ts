import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, isAdmin } from "@/lib/auth";

// GET /api/admin/lessons/[id] - Get lesson with full content
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

    const lesson = await db.lesson.findUnique({
      where: { id },
      include: {
        module: {
          select: {
            id: true,
            title: true,
            course: { select: { id: true, title: true, slug: true } },
          },
        },
        author: { select: { id: true, name: true, email: true } },
        editor: { select: { id: true, name: true, email: true } },
        quizzes: true,
        _count: { select: { progress: true } },
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const data = {
      ...lesson,
      objectives: lesson.objectives ? JSON.parse(lesson.objectives) : [],
      content: lesson.content ? JSON.parse(lesson.content) : [],
      keyTerms: lesson.keyTerms ? JSON.parse(lesson.keyTerms) : [],
      summary: lesson.summary ? JSON.parse(lesson.summary) : [],
      reviewQuestions: lesson.reviewQuestions
        ? JSON.parse(lesson.reviewQuestions)
        : [],
      quizzes: lesson.quizzes.map((q) => ({
        ...q,
        questions: q.questions ? JSON.parse(q.questions) : [],
      })),
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Admin lesson GET error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// PUT /api/admin/lessons/[id] - Update lesson (sets editorId to current user)
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

    const existing = await db.lesson.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Check slug uniqueness if changing
    if (body.slug && body.slug !== existing.slug) {
      const slugExists = await db.lesson.findUnique({
        where: { slug: body.slug },
      });
      if (slugExists) {
        return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
      }
    }

    const updateData: Record<string, unknown> = {
      editorId: user.id,
    };

    const allowedFields = [
      "title",
      "code",
      "slug",
      "description",
      "isPublished",
      "isFree",
    ];
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === "isPublished" || field === "isFree") {
          updateData[field] = Boolean(body[field]);
        } else {
          updateData[field] = body[field];
        }
      }
    }

    if (body.moduleId !== undefined) updateData.moduleId = body.moduleId;
    if (body.duration !== undefined) updateData.duration = Number(body.duration);
    if (body.order !== undefined) updateData.order = Number(body.order);

    // JSON fields - stringify when provided
    if (body.objectives !== undefined) {
      updateData.objectives = body.objectives
        ? JSON.stringify(body.objectives)
        : null;
    }
    if (body.content !== undefined) {
      updateData.content =
        typeof body.content === "string"
          ? body.content
          : JSON.stringify(body.content);
    }
    if (body.keyTerms !== undefined) {
      updateData.keyTerms = body.keyTerms ? JSON.stringify(body.keyTerms) : null;
    }
    if (body.summary !== undefined) {
      updateData.summary = body.summary ? JSON.stringify(body.summary) : null;
    }
    if (body.reviewQuestions !== undefined) {
      updateData.reviewQuestions = body.reviewQuestions
        ? JSON.stringify(body.reviewQuestions)
        : null;
    }

    const lesson = await db.lesson.update({
      where: { id },
      data: updateData,
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "UPDATE_LESSON",
        entity: "Lesson",
        entityId: id,
        details: JSON.stringify({ fields: Object.keys(updateData) }),
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
        userAgent: request.headers.get("user-agent") || undefined,
      },
    });

    return NextResponse.json({ data: lesson });
  } catch (error) {
    console.error("Admin lesson PUT error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// DELETE /api/admin/lessons/[id] - Delete lesson
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

    const existing = await db.lesson.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    await db.lesson.delete({ where: { id } });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "DELETE_LESSON",
        entity: "Lesson",
        entityId: id,
        details: JSON.stringify({ title: existing.title }),
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
        userAgent: request.headers.get("user-agent") || undefined,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin lesson DELETE error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
