'use client';

import { Card, CardContent } from '@/shared/components/ui/card';

export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="h-8 w-96 bg-muted animate-pulse rounded-lg mx-auto mb-4" />
          <div className="h-6 w-[600px] bg-muted animate-pulse rounded-lg mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <CardContent className="text-center space-y-4">
                <div className="w-20 h-20 bg-muted animate-pulse rounded-full mx-auto" />
                <div className="h-6 w-32 bg-muted animate-pulse rounded mx-auto" />
                <div className="h-4 w-24 bg-muted animate-pulse rounded mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
