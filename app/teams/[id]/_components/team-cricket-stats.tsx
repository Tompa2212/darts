import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { getTeamCricketStats } from '@/data/teams';

export async function TeamCricketStats({ teamId }: { teamId: string }) {
  const stats = await getTeamCricketStats(teamId);

  return (
    <Card className="shadow-md transition-shadow duration-200 hover:shadow-lg">
      <CardHeader className="gap-0 border-b pt-4 [.border-b]:pb-4">
        <Heading Type="h3" className="text-xl">
          Cricket Statistics
        </Heading>
      </CardHeader>
      <CardContent className="py-3 pb-4">
        <div className="flex flex-wrap gap-4 *:flex-1 *:basis-30">
          <div className="space-y-1 rounded-md bg-purple-50 px-3 py-1 text-center">
            <p className="text-lg text-purple-600">Avg. Score</p>
            <p className="text-xl font-semibold text-purple-700">
              {stats.averageScore?.toFixed(1) || 0}
            </p>
          </div>
          <div className="space-y-1 rounded-md bg-orange-50 px-3 py-1 text-center">
            <p className="text-lg text-orange-600">Points/Round</p>
            <p className="text-xl font-semibold text-orange-700">
              {stats.averagePointsPerRound?.toFixed(1) || 0}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
