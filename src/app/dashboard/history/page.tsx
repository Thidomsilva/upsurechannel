import HistoryList from '@/components/history-list';

export default function HistoryPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4 sm:p-6">
      <HistoryList />
    </main>
  );
}
