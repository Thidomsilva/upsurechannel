import { CalculatorClient } from '@/components/calculator-client';
import { Icons } from '@/components/icons';

export default function CalculatorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="absolute left-6 top-6 flex items-center gap-2">
        <Icons.logo className="h-8 w-8 text-primary" />
        <span className="font-headline text-xl font-bold text-primary">
          CanalUpsure
        </span>
      </div>
      <CalculatorClient />
    </main>
  );
}