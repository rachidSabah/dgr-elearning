import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, isAdmin } from "@/lib/auth";

// GET /api/admin/media/[id] - Get single media record
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

    const media = await db.media.findUnique({ where: { id } });
    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    const data = {
      ...media,
      tags: media.tags ? JSON.parse(media.tags) : [],
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Admin media GET error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// PUT /api/admin/media/[id] - Update a media record
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

    const existing = await db.media.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    const allowedFields = [
      "filename",
      "originalName",
      "mimeType",
      "url",
      "category",
      "altText",
      "caption",
    ];
    for (const field of allowedFields) {
      if (body[field] !== undefined) updateData[field] = body[field];
    }
    if (body.size !== undefined) updateData.size = Number(body.size);
    if (body.width !== undefined) updateData.width = body.width ? Number(body.width) : null;
    if (body.height !== undefined) updateData.height = body.height ? Number(body.height) : null;
    if (body.tags !== undefined) {
      updateData.tags = body.tags ? JSON.stringify(body.tags) : null;
    }

    const media = await db.media.update({
      where: { id },
      data: updateData,
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "UPDATE_MEDIA",
        entity: "Media",
        entityId: id,
        details: JSON.stringify({ fields: Object.keys(updateData) }),
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
        userAgent: request.headers.get("user-agent") || undefined,
      },
    });

    return NextResponse.json({ data: media });
  } catch (error) {
    console.error("Admin media PUT error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// DELETE /api/admin/media/[id] - Delete a media record
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

    const existing = await db.media.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    await db.media.delete({ where: { id } });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "DELETE_MEDIA",
        entity: "Media",
        entityId: id,
        details: JSON.stringify({ filename: existing.filename, url: existing.url }),
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
        userAgent: request.headers.get("user-agent") || undefined,
      },
    });

    return NextResponse.json({
      success: true,
      url: existing.url,
    });
  } catch (error) {
    console.error("Admin media DELETE error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
