'use client';

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function MerchantCardSkeleton() {
  return (
    <Card className={cn(
      "dark:bg-gray-800/50 bg-white",
      "border border-gray-200 dark:border-gray-700",
      "overflow-hidden"
    )}>
      <CardContent className="p-0">
        {/* En-tête avec gradient */}
        <div className="relative h-24 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-800/80 dark:to-gray-900">
          {/* Photo de profil skeleton */}
          <div className="absolute -bottom-10 left-4">
            <Skeleton className="h-20 w-20 rounded-full" />
          </div>
          {/* Badge de statut skeleton */}
          <div className="absolute top-4 right-4">
            <Skeleton className="h-6 w-24" />
          </div>
        </div>

        {/* Contenu principal */}
        <div className="px-4 pt-12 pb-4">
          <div className="space-y-2 mb-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>

          {/* Signature skeleton */}
          <div className="mt-4">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Actions skeleton */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <Skeleton className="h-8 w-8" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
