/**
 * @fileOverview AI-related functionalities, including data extraction from betting text.
 * This file does NOT use 'use server' because it exports non-async objects (Zod schemas),
 * which is not allowed in server-only files by Next.js.
 */
// Este arquivo agora está vazio pois toda a lógica de IA foi removida.

export async function extractBettingData(input: BettingDataInput): Promise<ExtractedBettingData> {
  const { output } = await extractBetPrompt(input);
  if (!output) {
    throw new Error('Could not extract betting data.');
  }
  return output;
}
