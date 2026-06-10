"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/15 text-red-400">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-bold text-white">حدث خطأ غير متوقع</h1>
      <p className="mt-3 max-w-md text-slate-400">
        تعذر تحميل الصفحة. حاول مرة أخرى أو ارجع إلى لوحة الموظفين.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>
          <RefreshCw className="h-4 w-4" />
          إعادة المحاولة
        </Button>
        <Link href="/">
          <Button variant="secondary">العودة للرئيسية</Button>
        </Link>
      </div>
    </div>
  );
}
