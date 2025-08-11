import { Header } from '@/components/header';
import NewBetClient from '@/components/new-bet-client';

export default function NewBetPage() {
    return (
        <>
            <Header pageTitle="Nova Aposta" />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <NewBetClient />
            </main>
        </>
    );
}
