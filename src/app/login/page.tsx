import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center py-12">
      <Suspense fallback={<p className="text-slate-400">جاري التحميل...</p>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
