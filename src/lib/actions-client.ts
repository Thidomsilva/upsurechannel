'use server';
import { validateAndNormalizeBettingData } from "@/ai/flows/validate-and-normalize-betting-data";

export async function extractOddsFromText(bettingData: string): Promise<{ odds1: number, odds2: number } | { error: string }> {
    if (!bettingData.trim()) {
        return { error: 'O texto da aposta está vazio.' };
    }
    try {
        const result = await validateAndNormalizeBettingData({ bettingData });
        return { odds1: result.odds1, odds2: result.odds2 };
    } catch (error) {
        console.error('AI Error:', error);
        return { error: 'A IA não conseguiu extrair as odds. Verifique o texto ou a chave de API.' };
    }
}
