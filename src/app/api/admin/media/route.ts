import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, isAdmin } from "@/lib/auth";

// GET /api/admin/media - List all media (pagination, filter by category)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const skip = (page - 1) * limit;

    const where = {
      ...(category && category !== "ALL" ? { category } : {}),
      ...(search
        ? {
            OR: [
              { filename: { contains: search } },
              { originalName: { contains: search } },
              { altText: { contains: search } },
              { caption: { contains: search } },
            ],
          }
        : {}),
    };

    const [media, total] = await Promise.all([
      db.media.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.media.count({ where }),
    ]);

    const data = media.map((m) => ({
      ...m,
      tags: m.tags ? JSON.parse(m.tags) : [],
    }));

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin media GET error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// POST /api/admin/media - Create a media record
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const {
      filename,
      originalName,
      mimeType,
      size,
      url,
      category,
      tags,
      altText,
      caption,
      width,
      height,
      uploadedBy,
    } = body;

    if (!filename || !originalName || !mimeType || !url) {
      return NextResponse.json(
        { error: "Missing required fields: filename, originalName, mimeType, url" },
        { status: 400 }
      );
    }

    const media = await db.media.create({
      data: {
        filename,
        originalName,
        mimeType,
        size: size ? Number(size) : 0,
        url,
        category: category || "GENERAL",
        tags: tags ? JSON.stringify(tags) : null,
        altText: altText || null,
        caption: caption || null,
        width: width ? Number(width) : null,
        height: height ? Number(height) : null,
        uploadedBy: uploadedBy || user.id,
      },
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "CREATE_MEDIA",
        entity: "Media",
        entityId: media.id,
        details: JSON.stringify({ filename, category }),
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
        userAgent: request.headers.get("user-agent") || undefined,
      },
    });

    return NextResponse.json({ data: media }, { status: 201 });
  } catch (error) {
    console.error("Admin media POST error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
