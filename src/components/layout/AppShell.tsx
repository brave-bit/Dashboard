"use client";

import { Navbar } from "@/components/layout/Navbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-[60] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
      >
        تخطي إلى المحتوى
      </a>
      <Navbar />
      <main
        id="main-content"
        className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8"
      >
        {children}
      </main>
      <footer className="border-t border-surface-border py-6 text-center text-sm text-slate-400">
        مصطفى حامد جسام
      </footer>
    </div>
  );
}
