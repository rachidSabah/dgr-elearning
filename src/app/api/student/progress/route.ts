import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/student/progress - Get current user's progress for all enrolled courses
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const enrollments = await db.enrollment.findMany({
      where: { userId: user.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            icon: true,
            color: true,
            coverImage: true,
            duration: true,
            category: true,
            difficulty: true,
            isPublished: true,
            modules: {
              where: { isPublished: true },
              orderBy: { order: "asc" },
              select: {
                id: true,
                title: true,
                order: true,
                lessons: {
                  where: { isPublished: true },
                  orderBy: { order: "asc" },
                  select: {
                    id: true,
                    title: true,
                    code: true,
                    slug: true,
                    duration: true,
                    isFree: true,
                    order: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    });

    if (enrollments.length === 0) {
      return NextResponse.json({ data: [] });
    }

    // Fetch all lesson progress for this user in one query
    const allLessonIds = enrollments.flatMap((e) =>
      e.course.modules.flatMap((m) => m.lessons.map((l) => l.id))
    );

    const progressRecords = allLessonIds.length
      ? await db.lessonProgress.findMany({
          where: { userId: user.id, lessonId: { in: allLessonIds } },
        })
      : [];

    const progressMap = new Map<string, (typeof progressRecords)[number]>();
    for (const p of progressRecords) {
      progressMap.set(p.lessonId, p);
    }

    const data = enrollments.map((enrollment) => {
      const lessons = enrollment.course.modules.flatMap((m) => m.lessons);
      const totalLessons = lessons.length;
      const completedLessons = lessons.filter(
        (l) => progressMap.get(l.id)?.status === "COMPLETED"
      ).length;
      const inProgressLessons = lessons.filter(
        (l) => progressMap.get(l.id)?.status === "IN_PROGRESS"
      ).length;
      const totalTimeSpent = lessons.reduce(
        (sum, l) => sum + (progressMap.get(l.id)?.timeSpent || 0),
        0
      );
      const overallProgress =
        totalLessons > 0
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0;

      return {
        enrollmentId: enrollment.id,
        status: enrollment.status,
        enrolledAt: enrollment.enrolledAt,
        completedAt: enrollment.completedAt,
        dueDate: enrollment.dueDate,
        course: enrollment.course,
        totalLessons,
        completedLessons,
        inProgressLessons,
        totalTimeSpent,
        overallProgress,
        modules: enrollment.course.modules.map((m) => ({
          id: m.id,
          title: m.title,
          order: m.order,
          lessons: m.lessons.map((l) => {
            const p = progressMap.get(l.id);
            return {
              ...l,
              status: p?.status || "NOT_STARTED",
              progress: p?.progress || 0,
              timeSpent: p?.timeSpent || 0,
              completedAt: p?.completedAt || null,
              lastAccessed: p?.lastAccessed || null,
            };
          }),
        })),
      };
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Student progress GET error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// POST /api/student/progress - Update lesson progress
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { lessonId, status, progress, timeSpent } = body;

    if (!lessonId) {
      return NextResponse.json(
        { error: "Missing required field: lessonId" },
        { status: 400 }
      );
    }

    // Verify the lesson exists
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true, isFree: true, module: { select: { courseId: true } } },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // If not free, verify enrollment
    if (!lesson.isFree) {
      const enrollment = await db.enrollment.findFirst({
        where: {
          userId: user.id,
          courseId: lesson.module.courseId,
          status: { in: ["ACTIVE"] },
        },
      });
      if (!enrollment) {
        return NextResponse.json(
          { error: "Not enrolled in this course" },
          { status: 403 }
        );
      }
    }

    // Check for existing progress record (no compound unique in schema)
    const existing = await db.lessonProgress.findFirst({
      where: { userId: user.id, lessonId },
    });

    // Build update data
    const updateData: Record<string, unknown> = {
      lastAccessed: new Date(),
    };

    if (status !== undefined) {
      const validStatuses = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
          { status: 400 }
        );
      }
      updateData.status = status;
      if (status === "COMPLETED") {
        updateData.progress = 100;
        updateData.completedAt = new Date();
      }
    }

    if (progress !== undefined) {
      const p = Math.min(100, Math.max(0, Number(progress)));
      updateData.progress = p;
      // If progress hits 100, mark as completed
      if (p >= 100) {
        updateData.status = "COMPLETED";
        updateData.completedAt = new Date();
      } else if (p > 0 && (!status || status === "NOT_STARTED")) {
        updateData.status = "IN_PROGRESS";
      }
    }

    if (timeSpent !== undefined) {
      // timeSpent is incremental (additional seconds since last update)
      updateData.timeSpent =
        (existing?.timeSpent || 0) + Number(timeSpent);
    }

    let record;
    if (existing) {
      record = await db.lessonProgress.update({
        where: { id: existing.id },
        data: updateData,
      });
    } else {
      record = await db.lessonProgress.create({
        data: {
          userId: user.id,
          lessonId,
          status: (updateData.status as string) || "IN_PROGRESS",
          progress: (updateData.progress as number) || 0,
          timeSpent: (updateData.timeSpent as number) || 0,
          completedAt: updateData.completedAt as Date | null,
          lastAccessed: new Date(),
        },
      });
    }

    return NextResponse.json({ data: record });
  } catch (error) {
    console.error("Student progress POST error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
