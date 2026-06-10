interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export function LoadingSpinner({
  message = "جاري التحميل...",
  className = "flex min-h-screen items-center justify-center",
}: LoadingSpinnerProps) {
  return (
    <div className={className}>
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent"
          role="status"
          aria-label={message}
        />
        <p className="text-sm text-slate-400">{message}</p>
      </div>
    </div>
  );
}
