import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15 text-accent">
        <FileQuestion className="h-8 w-8" />
      </div>
      <h1 className="text-6xl font-bold text-white">404</h1>
      <p className="mt-3 text-xl text-slate-300">الصفحة غير موجودة</p>
      <p className="mt-2 max-w-md text-slate-500">
        الرابط الذي طلبته غير صحيح أو تم نقله.
      </p>
      <Link href="/" className="mt-8">
        <Button>العودة إلى لوحة الموظفين</Button>
      </Link>
    </div>
  );
}
