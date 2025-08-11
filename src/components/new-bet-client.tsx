'use client';

import BetPasteForm from "./bet-paste-form";

export default function NewBetClient() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Nova Aposta</h1>
      <div className="w-full max-w-2xl">
        <BetPasteForm />
      </div>
    </div>
  );
}
