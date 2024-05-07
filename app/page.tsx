import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <header className="container p-2 sm:p-4 xl:pt-10">
        <p className="mt-4 font-semibold italic">
          Welcome to Darts Hub, a simple app to keep track of your darts games.
        </p>
      </header>
      <main className="container flex-1 p-2 sm:p-4">
        <div>
          <Link href="/play">
            <Card className="cursor-pointer transition-colors hover:bg-zinc-50">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle>
                  New Match
                  <span className="mx-2 inline-block text-2xl">🎯</span>
                </CardTitle>
                <CardDescription>
                  Play a new match and keep track of your scores. Play against a
                  friend, computer or play practice game.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </main>
    </>
  );
}
