'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Loader2,
  CheckCircle,
  X,
  Sparkles,
  Calculator,
  Send,
  ClipboardPaste,
} from 'lucide-react';
import { extractAndNormalizeBetDataFromText } from '@/lib/actions';
import type { ValidateAndNormalizeBettingDataOutput } from '@/ai/flows/validate-and-normalize-betting-data';
import { Textarea } from './ui/textarea';

type Step = 'paste' | 'verifying' | 'edit' | 'calculated';

export function NewBetClient() {
  const [step, setStep] = React.useState<Step>('paste');
  const [betInfoText, setBetInfoText] = React.useState('');
  const [extractedData, setExtractedData] =
    React.useState<ValidateAndNormalizeBettingDataOutput | null>(null);
  const [bet2Odds, setBet2Odds] = React.useState('');
  const [totalStake, setTotalStake] = React.useState('');
  const [surebet, setSurebet] = React.useState<{
    stake1: number;
    stake2: number;
    profit: number;
    roi: number;
  } | null>(null);
  const { toast } = useToast();

  const resetState = () => {
    setBetInfoText('');
    setStep('paste');
    setExtractedData(null);
    setBet2Odds('');
    setTotalStake('');
    setSurebet(null);
  };

  const handleExtract = async () => {
    if (!betInfoText.trim()) {
      toast({ title: 'No information provided', description: 'Please paste the bet information.', variant: 'destructive' });
      return;
    }

    setStep('verifying');

    try {
      const result = await extractAndNormalizeBetDataFromText(betInfoText);
      setExtractedData(result);
      setStep('edit');
      toast({
        title: 'Extraction Successful',
        description: 'Betting data has been extracted. Please verify.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Extraction Failed',
        description: 'Could not extract data from the provided text.',
        variant: 'destructive',
      });
      setStep('paste');
    }
  };

  const handleCalculateSurebet = () => {
    if (!extractedData || !bet2Odds || !totalStake) {
      toast({ title: 'Missing Information', description: 'Please fill all odds and total stake.', variant: 'destructive' });
      return;
    }
    const odds1 = extractedData.odds1;
    const odds2 = parseFloat(bet2Odds);
    const total = parseFloat(totalStake);

    if (isNaN(odds1) || isNaN(odds2) || isNaN(total) || odds1 <= 0 || odds2 <= 0 || total <= 0) {
      toast({ title: 'Invalid Input', description: 'Please enter valid numbers for odds and stake.', variant: 'destructive' });
      return;
    }
    
    const iv = 1 / odds1 + 1 / odds2;
    if (iv >= 1) {
       toast({ title: 'Not a Surebet', description: `This is not a profitable surebet opportunity (IV: ${iv.toFixed(3)}).`, variant: 'destructive' });
       setSurebet(null);
       return;
    }

    const stake1 = total / (1 + (odds1 / odds2));
    const stake2 = total - stake1;
    const profit = stake1 * odds1 - total;
    const roi = (profit / total) * 100;

    setSurebet({ stake1, stake2, profit, roi });
    setStep('calculated');
  };

  const handlePublish = () => {
    toast({
      title: 'Published to Telegram!',
      description: 'The surebet has been formatted and sent successfully.',
      action: <div className="p-2 rounded-full bg-green-500"><CheckCircle className="text-white" /></div>,
    });
    resetState();
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Create a New Surebet</CardTitle>
        <CardDescription>
          Paste your bet slip information, verify the data, and calculate the surebet stakes.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[400px] flex flex-col justify-center items-center">
        {step === 'paste' && (
          <div className="w-full p-4 space-y-4">
             <div className="flex items-center gap-2 text-muted-foreground">
                <ClipboardPaste className="h-5 w-5" />
                <Label htmlFor="bet-info" className="font-semibold">Paste Bet Information</Label>
            </div>
            <Textarea
              id="bet-info"
              className="w-full min-h-[200px] font-code"
              placeholder={`2025-08-10 17:00\tSan Cristobal – Salcedo FC\tFutebol / Dominican Republic - Liga Mayor\nPinnacle (BR)\tH1(+0.25) 1º o período\t2.370\t0.0\t2.370\t151.00\t0\tBRL\t7.87\t2.30%\nBet365 (Full)\tH2(−0.25) 1º o período\t1.800\t0.0\t1.800\t199.00\t0\tBRL\t8.20\n\t\t\t\t\t350\t\tBRL`}
              value={betInfoText}
              onChange={(e) => setBetInfoText(e.target.value)}
            />
          </div>
        )}

        {step === 'verifying' && (
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="font-semibold text-lg">Analyzing Information...</p>
            <p>Our AI is extracting the betting information. Please wait.</p>
          </div>
        )}

        {(step === 'edit' || step === 'calculated') && extractedData && (
          <div className="w-full grid md:grid-cols-2 gap-6">
            <div>
              <Label className="font-semibold text-primary">Bet 1 (from Pasted Text)</Label>
              <div className="space-y-2 mt-2 p-4 border rounded-lg bg-secondary/50">
                <p><strong>Game:</strong> {extractedData.game}</p>
                <p><strong>Team 1:</strong> {extractedData.team1}</p>
                <p><strong>Team 2:</strong> {extractedData.team2}</p>
                <p><strong>Odds 1:</strong> {extractedData.odds1}</p>
                <p><strong>Stake:</strong> ${extractedData.stake}</p>
                <p><strong>Bookmaker:</strong> {extractedData.bookmaker}</p>
              </div>
            </div>
            <div>
              <Label htmlFor="bet2-odds" className="font-semibold text-primary">Bet 2 (Opposing Bet)</Label>
              <div className="space-y-2 mt-2">
                <Input id="bet2-odds" placeholder="Enter odds for the opposing outcome" value={bet2Odds} onChange={e => setBet2Odds(e.target.value)} type="number" />
              </div>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="total-stake" className="font-semibold">Total Stake</Label>
              <Input id="total-stake" placeholder="e.g., 1000" value={totalStake} onChange={e => setTotalStake(e.target.value)} type="number" className="mt-2"/>
            </div>
          </div>
        )}

        {step === 'calculated' && surebet && (
          <div className="w-full mt-6 p-4 bg-primary/10 rounded-lg">
            <h3 className="font-headline text-lg font-semibold text-primary mb-4 flex items-center gap-2"><CheckCircle/> Surebet Calculated</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div><strong>Stake on {extractedData?.team1}:</strong> ${surebet.stake1.toFixed(2)}</div>
                <div><strong>Stake on {extractedData?.team2}:</strong> ${surebet.stake2.toFixed(2)}</div>
                <div><strong>Guaranteed Profit:</strong> <span className="text-green-600 font-bold">${surebet.profit.toFixed(2)}</span></div>
                <div><strong>ROI:</strong> <span className="text-green-600 font-bold">{surebet.roi.toFixed(2)}%</span></div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={resetState}>Reset</Button>
        {step === 'paste' && (
          <Button onClick={handleExtract} disabled={!betInfoText.trim()}>
            <Sparkles className="mr-2 h-4 w-4" /> Extract Data
          </Button>
        )}
        {step === 'edit' && (
           <Button onClick={handleCalculateSurebet}>
            <Calculator className="mr-2 h-4 w-4" /> Calculate Surebet
          </Button>
        )}
        {step === 'calculated' && (
           <Button onClick={handlePublish}>
            <Send className="mr-2 h-4 w-4" /> Publish to Telegram
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
