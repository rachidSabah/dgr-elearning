import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/courses - List published courses only (public - for students)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");
    const search = searchParams.get("search");

    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        ...(category && category !== "ALL" ? { category } : {}),
        ...(difficulty && difficulty !== "ALL" ? { difficulty } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search } },
                { description: { contains: search } },
              ],
            }
          : {}),
      },
      orderBy: [{ isFeatured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
      include: {
        author: {
          select: { id: true, name: true },
        },
        _count: {
          select: {
            modules: true,
            enrollments: true,
            certificates: true,
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
      isFeatured: course.isFeatured,
      startDate: course.startDate,
      endDate: course.endDate,
      objectives: course.objectives ? JSON.parse(course.objectives) : [],
      tags: course.tags ? JSON.parse(course.tags) : [],
      author: course.author,
      modulesCount: course._count.modules,
      enrollmentsCount: course._count.enrollments,
      certificatesCount: course._count.certificates,
      createdAt: course.createdAt,
    }));

    return NextResponse.json({ data, isAuthenticated: !!user });
  } catch (error) {
    console.error("Public courses GET error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
