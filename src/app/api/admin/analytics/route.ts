import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, isAdmin } from "@/lib/auth";

// GET /api/admin/analytics - Return analytics summary
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Run independent queries in parallel
    const [
      users,
      totalCourses,
      publishedCourses,
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
      totalCertificates,
      quizAttempts,
      recentLogs,
      courseEnrollments,
      courseCompletions,
    ] = await Promise.all([
      // 1. Users grouped by role
      db.user.groupBy({
        by: ["role"],
        _count: { _all: true },
      }),

      // 2. Total courses
      db.course.count(),

      // 3. Published courses
      db.course.count({ where: { isPublished: true } }),

      // 4. Total enrollments
      db.enrollment.count(),

      // 5. Active enrollments
      db.enrollment.count({ where: { status: "ACTIVE" } }),

      // 6. Completed enrollments
      db.enrollment.count({ where: { status: "COMPLETED" } }),

      // 7. Total certificates
      db.certificate.count(),

      // 8. Quiz attempts + average score
      db.quizAttempt.aggregate({
        _avg: { score: true },
        _count: { _all: true },
      }),

      // 9. Recent audit logs (last 10, with user info)
      db.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
      }),

      // 10. Enrollments grouped by course
      db.enrollment.groupBy({
        by: ["courseId"],
        _count: { _all: true },
      }),

      // 11. Completed enrollments grouped by course
      db.enrollment.groupBy({
        by: ["courseId"],
        where: { status: "COMPLETED" },
        _count: { _all: true },
      }),
    ]);

    // Build users-by-role map
    const usersByRole: Record<string, number> = {
      SUPER_ADMIN: 0,
      ACADEMY_ADMIN: 0,
      INSTRUCTOR: 0,
      CONTENT_EDITOR: 0,
      STUDENT: 0,
    };
    for (const row of users) {
      usersByRole[row.role] = row._count._all;
    }

    // Map course IDs to enrollment/completion counts
    const enrolledMap = new Map<string, number>();
    for (const row of courseEnrollments) {
      enrolledMap.set(row.courseId, row._count._all);
    }
    const completedMap = new Map<string, number>();
    for (const row of courseCompletions) {
      completedMap.set(row.courseId, row._count._all);
    }

    // Get course titles for the completion breakdown
    const courses = await db.course.findMany({
      select: { id: true, title: true, slug: true, isPublished: true },
      orderBy: { title: "asc" },
    });

    const courseCompletion = courses.map((c) => {
      const enrolled = enrolledMap.get(c.id) || 0;
      const completed = completedMap.get(c.id) || 0;
      const completionRate = enrolled > 0
        ? Math.round((completed / enrolled) * 1000) / 10 // 1 decimal place
        : 0;
      return {
        courseId: c.id,
        title: c.title,
        slug: c.slug,
        isPublished: c.isPublished,
        enrolled,
        completed,
        completionRate,
      };
    });

    const data = {
      totalUsers: users.reduce((sum, r) => sum + r._count._all, 0),
      usersByRole,
      totalCourses,
      publishedCourses,
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
      totalCertificates,
      totalQuizAttempts: quizAttempts._count._all,
      averageScore: quizAttempts._avg.score
        ? Math.round(quizAttempts._avg.score * 100) / 100
        : 0,
      recentActivity: recentLogs.map((log) => ({
        id: log.id,
        action: log.action,
        entity: log.entity,
        entityId: log.entityId,
        details: log.details ? safeParse(log.details) : null,
        ipAddress: log.ipAddress,
        createdAt: log.createdAt,
        user: log.user,
      })),
      courseCompletion,
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Admin analytics GET error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

function safeParse(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return s;
  }
}
