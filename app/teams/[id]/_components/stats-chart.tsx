'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

const chartConfig = {
  won: {
    label: 'Won',
    color: 'hsl(var(--chart-1))'
  },
  lost: {
    label: 'Lost',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig;

export function StatsChart({
  playedGames,
  wonGames,
  title
}: {
  playedGames: number;
  wonGames: number;
  title: string;
}) {
  const chartData = [
    { key: 'won', value: wonGames, fill: 'var(--color-success-500)' },
    { key: 'lost', value: playedGames - wonGames, fill: 'var(--color-error-500)' }
  ];

  const winRate = playedGames > 0 ? (wonGames / playedGames) * 100 : 0;

  return (
    <Card className="gap-0 border-0 text-center shadow-none">
      <CardHeader className="flex-0 p-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{playedGames} games played</CardDescription>
      </CardHeader>
      <CardContent className="mx-auto flex flex-1 flex-col justify-center px-0">
        {playedGames === 0 ? (
          <div className="py-4">
            <p className="text-muted-foreground">No data available</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-square max-h-[220px] min-w-[220px]"
          >
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie data={chartData} dataKey="value" nameKey="key" innerRadius={60} strokeWidth={5}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {winRate.toFixed(1)}%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground text-sm"
                          >
                            Win Rate
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
