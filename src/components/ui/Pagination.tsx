"use client";

import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  from: number;
  to: number;
  total: number;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  from,
  to,
  total,
}: PaginationProps) {
  if (total === 0) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) =>
      p === 1 ||
      p === totalPages ||
      (p >= page - 1 && p <= page + 1)
  );

  return (
    <nav
      aria-label="ترقيم الصفحات"
      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-slate-500">
        عرض {from}–{to} من {total}
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="الصفحة السابقة"
          className="rounded-lg border border-surface-border bg-surface-elevated p-2 text-slate-400 transition-colors hover:text-white disabled:opacity-40 disabled:pointer-events-none"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {pages.map((p, index) => {
          const prev = pages[index - 1];
          const showEllipsis = prev !== undefined && p - prev > 1;
          return (
            <span key={p} className="flex items-center gap-1">
              {showEllipsis && (
                <span className="px-1 text-slate-500">…</span>
              )}
              <button
                type="button"
                onClick={() => onPageChange(p)}
                aria-label={`الصفحة ${p}`}
                aria-current={p === page ? "page" : undefined}
                className={cn(
                  "min-w-9 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                  p === page
                    ? "border-accent bg-accent text-white"
                    : "border-surface-border bg-surface-elevated text-slate-400 hover:text-white"
                )}
              >
                {p}
              </button>
            </span>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="الصفحة التالية"
          className="rounded-lg border border-surface-border bg-surface-elevated p-2 text-slate-400 transition-colors hover:text-white disabled:opacity-40 disabled:pointer-events-none"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
