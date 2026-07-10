import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, isAdmin } from "@/lib/auth";

// GET /api/admin/lessons - List lessons (optional moduleId filter)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get("moduleId");

    const lessons = await db.lesson.findMany({
      where: moduleId ? { moduleId } : undefined,
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      include: {
        module: {
          select: {
            id: true,
            title: true,
            course: { select: { id: true, title: true, slug: true } },
          },
        },
        author: { select: { id: true, name: true } },
        editor: { select: { id: true, name: true } },
        _count: { select: { quizzes: true, progress: true } },
      },
    });

    // Return lessons without the heavy content field for list views
    const data = lessons.map(({ content, ...rest }) => rest);

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Admin lessons GET error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// POST /api/admin/lessons - Create a lesson
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const {
      moduleId,
      title,
      code,
      slug,
      description,
      duration,
      objectives,
      content,
      keyTerms,
      summary,
      reviewQuestions,
      order,
      isPublished,
      isFree,
    } = body;

    if (!moduleId || !title || !content) {
      return NextResponse.json(
        { error: "Missing required fields: moduleId, title, content" },
        { status: 400 }
      );
    }

    // Verify module exists
    const module = await db.module.findUnique({ where: { id: moduleId } });
    if (!module) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    // Check slug uniqueness if provided
    if (slug) {
      const slugExists = await db.lesson.findUnique({ where: { slug } });
      if (slugExists) {
        return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
      }
    }

    const lesson = await db.lesson.create({
      data: {
        moduleId,
        title,
        code: code || null,
        slug: slug || null,
        description: description || null,
        duration: duration ? Number(duration) : 15,
        objectives: objectives ? JSON.stringify(objectives) : null,
        // content is stored as a JSON string
        content: typeof content === "string" ? content : JSON.stringify(content),
        keyTerms: keyTerms ? JSON.stringify(keyTerms) : null,
        summary: summary ? JSON.stringify(summary) : null,
        reviewQuestions: reviewQuestions
          ? JSON.stringify(reviewQuestions)
          : null,
        order: order !== undefined ? Number(order) : 0,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        isFree: Boolean(isFree),
        authorId: user.id,
        editorId: user.id,
      },
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "CREATE_LESSON",
        entity: "Lesson",
        entityId: lesson.id,
        details: JSON.stringify({ title, moduleId }),
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
        userAgent: request.headers.get("user-agent") || undefined,
      },
    });

    return NextResponse.json({ data: lesson }, { status: 201 });
  } catch (error) {
    console.error("Admin lessons POST error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
