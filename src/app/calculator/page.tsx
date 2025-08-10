import * as React from 'react';
import { CalculatorClient } from '@/components/calculator-client';
import { Icons } from '@/components/icons';
import { Loader2 } from 'lucide-react';

function CalculatorLoading() {
  return (
    <div className="flex h-96 w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export default function CalculatorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="absolute left-6 top-6 flex items-center gap-2">
        <Icons.logo className="h-8 w-8 text-primary" />
        <span className="font-headline text-xl font-bold text-primary">
          CanalUpsure
        </span>
      </div>
       <React.Suspense fallback={<CalculatorLoading />}>
        <CalculatorClient />
      </React.Suspense>
    </main>
  );
}
