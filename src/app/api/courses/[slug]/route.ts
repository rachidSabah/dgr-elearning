import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/courses/[slug] - Get published course with modules and published lessons
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const user = await getCurrentUser(request);

    const { slug } = await params;

    const course = await db.course.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, name: true },
        },
        modules: {
          where: { isPublished: true },
          orderBy: { order: "asc" },
          include: {
            lessons: {
              where: { isPublished: true },
              orderBy: { order: "asc" },
              select: {
                id: true,
                title: true,
                code: true,
                slug: true,
                description: true,
                duration: true,
                isFree: true,
                order: true,
                // Don't include full content for list view
              },
            },
          },
        },
        _count: {
          select: {
            enrollments: true,
            certificates: true,
          },
        },
      },
    });

    if (!course || !course.isPublished) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // If user is logged in, include their enrollment status and lesson progress
    let enrollment: {
      id: string;
      status: string;
      enrolledAt: Date;
      completedAt: Date | null;
      dueDate: Date | null;
    } | null = null;
    let lessonProgress: Array<{
      lessonId: string;
      status: string;
      progress: number;
      timeSpent: number;
      completedAt: Date | null;
    }> = [];

    if (user) {
      enrollment = await db.enrollment.findFirst({
        where: { userId: user.id, courseId: course.id },
        select: {
          id: true,
          status: true,
          enrolledAt: true,
          completedAt: true,
          dueDate: true,
        },
      });

      if (enrollment) {
        const lessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
        if (lessonIds.length > 0) {
          lessonProgress = await db.lessonProgress.findMany({
            where: { userId: user.id, lessonId: { in: lessonIds } },
            select: {
              lessonId: true,
              status: true,
              progress: true,
              timeSpent: true,
              completedAt: true,
            },
          });
        }
      }
    }

    const data = {
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
      prerequisites: course.prerequisites
        ? JSON.parse(course.prerequisites)
        : [],
      objectives: course.objectives ? JSON.parse(course.objectives) : [],
      tags: course.tags ? JSON.parse(course.tags) : [],
      author: course.author,
      modulesCount: course.modules.length,
      enrollmentsCount: course._count.enrollments,
      certificatesCount: course._count.certificates,
      modules: course.modules.map((m) => ({
        id: m.id,
        title: m.title,
        code: m.code,
        description: m.description,
        icon: m.icon,
        color: m.color,
        order: m.order,
        lessons: m.lessons,
      })),
      enrollment,
      lessonProgress,
    };

    return NextResponse.json({ data, isAuthenticated: !!user });
  } catch (error) {
    console.error("Public course GET error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
