'use client';

import Link from 'next/link';
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
import { Icons } from '@/components/icons';
import { Calculator } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute right-4 top-4">
        <Button asChild variant="outline">
          <Link href="/calculator">
            <Calculator className="mr-2 h-4 w-4" />
            Calculadora
          </Link>
        </Button>
      </div>
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex items-center justify-center">
              <Icons.logo className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl font-bold tracking-tighter text-primary">
              CanalUpsure
            </CardTitle>
            <CardDescription>
              Bem-vindo de volta! Por favor, insira suas credenciais para fazer login.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="nome@exemplo.com" type="email" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Senha</Label>
                  <Input id="password" placeholder="••••••••" type="password" />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button asChild className="w-full">
              <Link href="/dashboard">Login</Link>
            </Button>
            <div className="text-center text-sm">
              <Link href="#" className="underline">
                Esqueceu sua senha?
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
