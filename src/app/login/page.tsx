
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
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


function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Email e senha do admin (pode ser .env)
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@exemplo.com';
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'upsure2024';
    if (email === adminEmail && password === adminPassword) {
      // Salva cookie simples (expira em 7 dias)
      document.cookie = `upsure_auth=${email}; path=/; max-age=${60 * 60 * 24 * 7}`;
      // Redireciona para rota protegida ou dashboard
      const redirect = searchParams.get('redirect') || '/dashboard';
      router.replace(redirect);
    } else {
      setError('Credenciais inválidas');
    }
    setLoading(false);
  };

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
      <div className="w-full max-w-sm sm:max-w-md">
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
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="nome@exemplo.com" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Senha</Label>
                  <Input id="password" placeholder="••••••••" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              </div>
              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? 'Entrando...' : 'Login'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
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

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageContent />
    </Suspense>
  );
}
