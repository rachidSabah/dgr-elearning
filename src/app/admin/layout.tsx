"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { Loader2, GraduationCap } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Don't check auth on login page
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user) {
          router.push("/admin/login");
          return;
        }
        if (data.user.role === "STUDENT") {
          router.push("/");
          return;
        }
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, [pathname, router]);

  // Login page renders without shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mb-4">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <Loader2 className="h-6 w-6 animate-spin text-sky-500 mx-auto" />
          <p className="text-slate-400 text-sm mt-2">Loading admin console...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <AdminShell user={user} currentPath={pathname}>
      {children}
    </AdminShell>
  );
}
