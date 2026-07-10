import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, isAdmin } from "@/lib/auth";

// GET /api/admin/settings - Get all settings as key-value object
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const settings = await db.setting.findMany({
      where: category && category !== "ALL" ? { category } : undefined,
      orderBy: { category: "asc" },
    });

    // Build a key-value object
    const data: Record<string, { value: unknown; category: string; updatedAt: string }> = {};
    for (const s of settings) {
      let parsedValue: unknown = s.value;
      try {
        parsedValue = JSON.parse(s.value);
      } catch {
        // keep raw string
      }
      data[s.key] = {
        value: parsedValue,
        category: s.category,
        updatedAt: s.updatedAt.toISOString(),
      };
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Admin settings GET error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// PUT /api/admin/settings - Update settings (accepts object of key-value pairs, upsert each)
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();

    // Accept either { key: value, ... } or { settings: { key: value, ... }, category }
    const settingsObj = body.settings && typeof body.settings === "object"
      ? body.settings
      : body;
    const defaultCategory = body.category || "GENERAL";

    if (!settingsObj || typeof settingsObj !== "object") {
      return NextResponse.json(
        { error: "Expected settings object" },
        { status: 400 }
      );
    }

    const upserts = Object.entries(settingsObj).map(([key, rawValue]) => {
      // Determine category - support { value, category } shape or raw value
      let value: unknown;
      let category = defaultCategory;
      if (rawValue && typeof rawValue === "object" && "value" in (rawValue as Record<string, unknown>)) {
        const v = (rawValue as Record<string, unknown>).value;
        value = v;
        if ((rawValue as Record<string, unknown>).category) {
          category = (rawValue as Record<string, unknown>).category as string;
        }
      } else {
        value = rawValue;
      }

      const valueStr =
        typeof value === "string" ? value : JSON.stringify(value);

      return db.setting.upsert({
        where: { key },
        update: { value: valueStr, category },
        create: { key, value: valueStr, category },
      });
    });

    await Promise.all(upserts);

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "UPDATE_SETTINGS",
        entity: "Setting",
        details: JSON.stringify({ keys: Object.keys(settingsObj) }),
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
        userAgent: request.headers.get("user-agent") || undefined,
      },
    });

    // Return updated settings
    const all = await db.setting.findMany();
    const data: Record<string, { value: unknown; category: string; updatedAt: string }> = {};
    for (const s of all) {
      let parsedValue: unknown = s.value;
      try {
        parsedValue = JSON.parse(s.value);
      } catch {
        // keep raw
      }
      data[s.key] = {
        value: parsedValue,
        category: s.category,
        updatedAt: s.updatedAt.toISOString(),
      };
    }

    return NextResponse.json({ data, updated: Object.keys(settingsObj) });
  } catch (error) {
    console.error("Admin settings PUT error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
