import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { isAuthenticated } from "@/lib/auth";

interface LoginPageProps {
  searchParams: Promise<{ from?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  if (await isAuthenticated()) {
    redirect("/admin");
  }

  const params = await searchParams;
  const from = params.from ?? "/admin";
  const errorCode = params.error;

  return (
    <div className="flex flex-1 items-center justify-center py-12">
      <LoginForm from={from} errorCode={errorCode} />
    </div>
  );
}
