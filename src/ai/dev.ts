import { config } from 'dotenv';
config();

import '@/ai/flows/validate-and-normalize-betting-data.ts';
import '@/ai/flows/extract-betting-info-from-text.ts';
import '@/ai/flows/extract-odds.ts';
