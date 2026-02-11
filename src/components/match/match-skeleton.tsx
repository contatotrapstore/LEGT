import { Skeleton } from "@/components/ui/skeleton";

export function MatchSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
      <Skeleton className="h-40 w-full rounded-2xl" />
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-64 w-full rounded-xl" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}
