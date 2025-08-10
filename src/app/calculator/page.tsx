import { CalculatorClient } from '@/components/calculator-client';
import { Icons } from '@/components/icons';

export default function CalculatorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-6 text-center">
         <div className="mx-auto mb-4 flex items-center justify-center">
            <Icons.logo className="h-12 w-12 text-primary" />
        </div>
        <h1 className="font-headline text-3xl font-bold tracking-tighter text-primary">
            CanalUpsure
        </h1>
      </div>
      <CalculatorClient />
    </main>
  );
}
