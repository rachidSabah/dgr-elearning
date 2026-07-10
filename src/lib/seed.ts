import { db } from "@/lib/db";
import { hashPassword, DEFAULT_ADMIN } from "@/lib/auth";

// Seed the database with default admin user and existing DGR course
export async function seedDatabase() {
  try {
    // Check if admin exists
    const existingAdmin = await db.user.findUnique({
      where: { email: DEFAULT_ADMIN.email },
    });

    if (!existingAdmin) {
      await db.user.create({
        data: {
          email: DEFAULT_ADMIN.email,
          name: DEFAULT_ADMIN.name,
          passwordHash: hashPassword(DEFAULT_ADMIN.password),
          role: DEFAULT_ADMIN.role,
          department: "Administration",
          isActive: true,
        },
      });
      console.log("✓ Default admin user created:", DEFAULT_ADMIN.email);
    }

    // Check if DGR course exists
    const existingCourse = await db.course.findUnique({
      where: { slug: "dangerous-goods-regulations" },
    });

    if (!existingCourse) {
      // Create the DGR course
      const course = await db.course.create({
        data: {
          title: "Dangerous Goods Regulations",
          slug: "dangerous-goods-regulations",
          description:
            "Comprehensive training on the safe transport of Dangerous Goods by air, covering awareness, regulatory requirements, classification, packing, marking, labelling, loading, notification procedures, and emergency response for cabin crew.",
          category: "Cabin Crew Training",
          difficulty: "Professional",
          duration: 480,
          icon: "AlertTriangle",
          color: "#dc2626",
          coverImage: "/images/dg-topics/all-hazard-labels-overview.jpg",
          isPublished: true,
          isFeatured: true,
          order: 1,
          objectives: JSON.stringify([
            "Identify dangerous goods and understand their potential risks during air transport",
            "Apply ICAO Technical Instructions and IATA Dangerous Goods Regulations",
            "Recognise the nine hazard classes and their corresponding IATA CARGO IMP codes",
            "Interpret special load codes, markings, and labels on dangerous goods packages",
            "Execute proper loading, stowage, and segregation procedures",
            "Apply the Notification to Commander (NOTOC) process correctly",
            "Respond to dangerous goods incidents using cabin crew checklists",
            "Understand provisions for dangerous goods carried by passengers or crew",
            "Handle weapons, ammunition, dry ice, and radioactive materials safely",
            "Report dangerous goods accidents and incidents within regulatory timeframes",
          ]),
          tags: JSON.stringify(["Dangerous Goods", "DGR", "ICAO", "IATA", "Cabin Crew", "Safety"]),
        },
      });

      // Create modules
      const modules = [
        {
          title: "Dangerous Goods Awareness",
          code: "11.4",
          description:
            "Background information, regulatory framework, and reported incidents involving dangerous goods in air transport.",
          icon: "AlertTriangle",
          color: "#f59e0b",
          order: 1,
        },
        {
          title: "Transport of Dangerous Goods",
          code: "11.5",
          description:
            "Terminology, categories, special load codes, classification of nine hazard classes, packing, marking, labelling, loading, stowage, and specific provisions.",
          icon: "Package",
          color: "#3b82f6",
          order: 2,
        },
        {
          title: "NOTOC and Emergency Response",
          code: "11.6",
          description:
            "Notification to Commander procedures, inspection for damage, dangerous goods incident checklists, emergency response drills, reporting requirements, and weapons transport.",
          icon: "ShieldAlert",
          color: "#ef4444",
          order: 3,
        },
      ];

      for (const mod of modules) {
        await db.module.create({
          data: {
            ...mod,
            courseId: course.id,
            isPublished: true,
          },
        });
      }

      console.log("✓ DGR course created with 3 modules");
    }

    // Create default settings
    const settingsExist = await db.setting.count();
    if (settingsExist === 0) {
      const defaultSettings = [
        { key: "academy_name", value: "DGR Aviation Academy", category: "BRANDING" },
        { key: "academy_logo", value: "", category: "BRANDING" },
        { key: "primary_color", value: "#0ea5e9", category: "BRANDING" },
        { key: "accent_color", value: "#f59e0b", category: "BRANDING" },
        { key: "support_email", value: "support@dgr-academy.com", category: "BRANDING" },
        { key: "ai_provider", value: "zai", category: "AI" },
        { key: "ai_model", value: "glm-4", category: "AI" },
        { key: "voice_provider", value: "web-speech-api", category: "AI" },
        { key: "ai_tutor_enabled", value: "true", category: "AI" },
        { key: "default_language", value: "en", category: "GENERAL" },
        { key: "certificate_template", value: "default", category: "BRANDING" },
        { key: "pass_mark", value: "70", category: "GENERAL" },
      ];

      for (const s of defaultSettings) {
        await db.setting.upsert({
          where: { key: s.key },
          update: {},
          create: s,
        });
      }
      console.log("✓ Default settings created");
    }

    return { success: true, message: "Seed completed" };
  } catch (error) {
    console.error("Seed error:", error);
    return { success: false, error: String(error) };
  }
}
