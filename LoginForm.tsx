import Link from "next/link";
import { Lock, User, LogIn, Building2, ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { loginAction } from "@/app/login/actions";

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "بيانات الدخول غير صحيحة — تأكد من ADMIN_PASSWORD في Vercel",
  missing: "اسم المستخدم وكلمة المرور مطلوبان",
  config:
    "إعدادات الخادم ناقصة. أضف AUTH_SECRET و ADMIN_USERNAME و ADMIN_PASSWORD في Vercel.",
  server: "فشل تسجيل الدخول. حاول مرة أخرى",
  rate: "محاولات كثيرة. انتظر قليلاً ثم حاول مجدداً",
  session: "انتهت الجلسة. سجّل الدخول مرة أخرى",
};

interface LoginFormProps {
  from: string;
  errorCode?: string;
}

export function LoginForm({ from, errorCode }: LoginFormProps) {
  const error = errorCode ? ERROR_MESSAGES[errorCode] ?? "فشل تسجيل الدخول" : "";

  const inputClass =
    "w-full rounded-xl border border-surface-border bg-surface-elevated py-2.5 pl-4 pr-10 text-sm text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-blue-600 shadow-glow">
          <Building2 className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">تسجيل الدخول</h1>
        <p className="mt-2 text-sm text-slate-400">
          تسجيل الدخول مطلوب فقط لإدارة الموظفين — لوحة العرض مفتوحة للجميع
        </p>
      </div>

      <div className="rounded-2xl border border-surface-border bg-surface-card p-6 shadow-card">
        <form action={loginAction} className="space-y-4">
          <input type="hidden" name="from" value={from} />

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/15 px-4 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <div>
            <label htmlFor="username" className="mb-1.5 block text-sm text-slate-400">
              اسم المستخدم
            </label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
              <input
                id="username"
                name="username"
                required
                autoComplete="username"
                className={inputClass}
                placeholder="admin"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm text-slate-400">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
              <input
                id="password"
                name="password"
                required
                type="password"
                autoComplete="current-password"
                className={inputClass}
                dir="ltr"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            <LogIn className="h-4 w-4" />
            دخول لوحة الإدارة
          </Button>
        </form>

        <Link
          href="/"
          className="group mt-4 flex w-full items-center justify-center gap-3 rounded-xl border border-surface-border bg-surface-elevated/40 px-4 py-3 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-accent/40 hover:bg-surface-elevated hover:text-white hover:shadow-[0_0_24px_rgba(59,130,246,0.1)]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
            <ArrowRight className="h-4 w-4" />
          </span>
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-500 transition-colors group-hover:text-accent" />
            العودة إلى لوحة الموظفين
          </span>
        </Link>
      </div>
    </div>
  );
}
