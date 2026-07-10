import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, isAdmin } from "@/lib/auth";

// GET /api/admin/courses - List all courses with counts
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const courses = await db.course.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: {
            modules: true,
            enrollments: true,
          },
        },
      },
    });

    const data = courses.map((course) => ({
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      category: course.category,
      difficulty: course.difficulty,
      duration: course.duration,
      icon: course.icon,
      color: course.color,
      coverImage: course.coverImage,
      isPublished: course.isPublished,
      isFeatured: course.isFeatured,
      order: course.order,
      objectives: course.objectives ? JSON.parse(course.objectives) : [],
      tags: course.tags ? JSON.parse(course.tags) : [],
      authorId: course.authorId,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      modulesCount: course._count.modules,
      enrollmentsCount: course._count.enrollments,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Admin courses GET error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// POST /api/admin/courses - Create a new course
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      description,
      category,
      difficulty,
      duration,
      icon,
      color,
      coverImage,
      objectives,
      tags,
      isPublished,
      isFeatured,
      order,
    } = body;

    if (!title || !slug || !description || !category) {
      return NextResponse.json(
        { error: "Missing required fields: title, slug, description, category" },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await db.course.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
    }

    const course = await db.course.create({
      data: {
        title,
        slug,
        description,
        category,
        difficulty: difficulty || "Professional",
        duration: duration ? Number(duration) : 0,
        icon: icon || null,
        color: color || null,
        coverImage: coverImage || null,
        objectives: objectives ? JSON.stringify(objectives) : null,
        tags: tags ? JSON.stringify(tags) : null,
        isPublished: Boolean(isPublished),
        isFeatured: Boolean(isFeatured),
        order: order ? Number(order) : 0,
        authorId: user.id,
      },
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "CREATE_COURSE",
        entity: "Course",
        entityId: course.id,
        details: JSON.stringify({ title, slug }),
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
        userAgent: request.headers.get("user-agent") || undefined,
      },
    });

    return NextResponse.json({ data: course }, { status: 201 });
  } catch (error) {
    console.error("Admin courses POST error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
