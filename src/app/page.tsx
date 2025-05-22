import BattleDashboard from '@/components/battle/BattleDashboard';

export default function Home() {
  return (
    <main className="bg-background selection:bg-accent selection:text-accent-foreground">
      <BattleDashboard />
    </main>
  );
}
