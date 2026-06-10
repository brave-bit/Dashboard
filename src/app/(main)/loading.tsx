import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function MainLoading() {
  return (
    <LoadingSpinner
      message="جاري تحميل البيانات..."
      className="flex min-h-[50vh] items-center justify-center"
    />
  );
}
