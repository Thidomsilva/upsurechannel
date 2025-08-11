"use client";
import { Suspense } from 'react';
import { CalculatorClient } from '@/components/calculator-client';

export default function CalculatorPage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] p-4">
      <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-10 drop-shadow-lg text-center">Calculadora de Surebet</h1>
      <div className="w-full max-w-2xl">
        <Suspense fallback={<div>Carregando calculadora...</div>}>
          <CalculatorClient />
        </Suspense>
      </div>
    </main>
  );
}
