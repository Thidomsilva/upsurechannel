import * as React from 'react';
import { CalculatorClient } from '@/components/calculator-client';
import { Icons } from '@/components/icons';
import { Loader2, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function CalculatorLoading() {
  return (
    <div className="flex h-96 w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export default function CalculatorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4 sm:p-6">
      <header className="absolute left-0 top-0 flex w-full items-center justify-between p-4 sm:p-6">
        <Link href="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md">
          <Icons.logo className="h-8 w-8 text-primary" />
          <span className="font-headline text-xl font-bold text-primary">
            CanalUpsure
          </span>
        </Link>
        <Button asChild variant="outline">
          <Link href="/login">
            <LogIn className="mr-2 h-4 w-4" />
            Admin Login
          </Link>
        </Button>
      </header>
      <React.Suspense fallback={<CalculatorLoading />}>
        <CalculatorClient />
      </React.Suspense>
    </main>
  );
}
