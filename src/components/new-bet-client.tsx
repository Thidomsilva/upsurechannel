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
  UploadCloud,
  Loader2,
  CheckCircle,
  FileImage,
  X,
  Sparkles,
  Calculator,
  Send,
} from 'lucide-react';
import Image from 'next/image';
import { extractAndNormalizeBetData } from '@/lib/actions';
import type { ValidateAndNormalizeBettingDataOutput } from '@/ai/flows/validate-and-normalize-betting-data';
import { Separator } from './ui/separator';

type Step = 'upload' | 'verifying' | 'edit' | 'calculated';

export function NewBetClient() {
  const [step, setStep] = React.useState<Step>('upload');
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setPreviewUrl(URL.createObjectURL(droppedFile));
    }
  };

  const resetState = () => {
    setFile(null);
    setPreviewUrl(null);
    setStep('upload');
    setExtractedData(null);
    setBet2Odds('');
    setTotalStake('');
    setSurebet(null);
  };

  const handleExtract = async () => {
    if (!file) {
      toast({ title: 'No file selected', description: 'Please upload a screenshot.', variant: 'destructive' });
      return;
    }

    setStep('verifying');

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const result = await extractAndNormalizeBetData(base64);
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
          description: 'Could not extract data from the image.',
          variant: 'destructive',
        });
        setStep('upload');
      }
    };
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
          Upload a bet slip, verify the data, and calculate the surebet stakes.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[400px] flex flex-col justify-center items-center">
        {step === 'upload' && (
          <div
            className="w-full p-10 border-2 border-dashed rounded-lg text-center cursor-pointer hover:border-primary transition-colors"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 font-semibold text-primary">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-muted-foreground">
              PNG, JPG, or GIF (max 10MB)
            </p>
            <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
          </div>
        )}

        {(step === 'upload' && previewUrl) && (
            <div className="mt-4 w-full">
              <h3 className="font-semibold mb-2">Image Preview:</h3>
              <div className="relative group w-full max-w-md mx-auto">
                <Image src={previewUrl} alt="Bet slip preview" width={600} height={400} className="rounded-lg object-contain" />
                <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => { setFile(null); setPreviewUrl(null); }}>
                    <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
        )}

        {step === 'verifying' && (
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="font-semibold text-lg">Analyzing Screenshot...</p>
            <p>Our AI is extracting the betting information. Please wait.</p>
          </div>
        )}

        {(step === 'edit' || step === 'calculated') && extractedData && (
          <div className="w-full grid md:grid-cols-2 gap-6">
            <div>
              <Label className="font-semibold text-primary">Bet 1 (from Screenshot)</Label>
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
        {step === 'upload' && file && (
          <Button onClick={handleExtract}>
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
