'use server';

import { extractBettingInfoFromText } from '@/ai/flows/extract-betting-info-from-text';
import {
  validateAndNormalizeBettingData,
  type ValidateAndNormalizeBettingDataInput,
} from '@/ai/flows/validate-and-normalize-betting-data';
import { z } from 'zod';

export async function extractAndNormalizeBetDataFromText(bettingText: string) {
  // Step 1: Extract initial info from the text
  const extractedInfo = await extractBettingInfoFromText({
    bettingInfo: bettingText,
  });

  // Step 2: Prepare data for validation and normalization
  // The first flow gives us a single 'odds' value. We will pass it as odds1.
  // The LLM in the second flow is tasked with filling in missing details.
  const validationInput: ValidateAndNormalizeBettingDataInput = {
    game: extractedInfo.gameDetails,
    odds1: String(extractedInfo.odds),
    stake: String(extractedInfo.stake),
  };

  // Step 3: Call the validation and normalization flow
  const normalizedData = await validateAndNormalizeBettingData(validationInput);

  if (!normalizedData.game || !normalizedData.team1 || !normalizedData.team2) {
    throw new Error("Falha ao normalizar os dados do jogo e da equipe.");
  }

  return normalizedData;
}
