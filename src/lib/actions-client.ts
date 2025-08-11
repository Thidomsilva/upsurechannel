
'use server';

export async function extractOddsFromText(bettingData: string): Promise<{ odds1: number, odds2: number } | { error: string }> {
    if (!bettingData.trim()) {
        return { error: 'O texto da aposta está vazio.' };
    }
    try {
        // Parser local para odds (exemplo simples)
        const lines = bettingData.trim().split('\n').filter(line => line.trim());
        if (lines.length < 3) {
            return { error: 'Formato inválido: dados insuficientes.' };
        }
        // Odds na segunda e terceira linha
        const casa1Line = lines[1].split('\t');
        const casa2Line = lines[2].split('\t');
        const odds1 = parseFloat(casa1Line[2]?.replace(',', '.') || '0');
        const odds2 = parseFloat(casa2Line[2]?.replace(',', '.') || '0');
        if (!odds1 || !odds2) {
            return { error: 'Não foi possível extrair as odds.' };
        }
        return { odds1, odds2 };
    } catch (error) {
        return { error: 'Erro ao processar os dados.' };
    }
}
