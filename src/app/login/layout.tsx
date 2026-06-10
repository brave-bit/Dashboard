export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      {children}
      <footer className="border-t border-surface-border py-4 text-center text-xs text-slate-600">
         مصطفى حامد جسام
      </footer>
    </div>
  );
}
