"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Settings, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data: { loggedIn?: boolean }) => setLoggedIn(!!data.loggedIn))
      .catch(() => setLoggedIn(false));
  }, [pathname]);

  const links = [
    { href: "/", label: "لوحة الموظفين", icon: Users },
    {
      href: loggedIn ? "/admin" : "/login",
      label: loggedIn ? "لوحة الإدارة" : "دخول الإدارة",
      icon: Settings,
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-surface-border bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-blue-600 shadow-glow transition-transform group-hover:scale-105">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight">
              Prime HR
            </span>
            <p className="text-xs text-slate-500">نظام إدارة الموظفين</p>
          </div>
        </Link>

        <nav
          aria-label="التنقل الرئيسي"
          className="flex items-center gap-1 rounded-xl bg-surface-elevated/80 p-1 border border-surface-border"
        >
          {links.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/"
                ? pathname === "/"
                : href === "/admin"
                  ? pathname.startsWith("/admin")
                  : pathname === "/login" || pathname.startsWith("/admin");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-accent",
                  active
                    ? "bg-accent text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-surface-border/50"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2 text-slate-500 text-sm">
          <LayoutDashboard className="h-4 w-4" />
          <span>v1.0</span>
        </div>
      </div>
    </header>
  );
}
