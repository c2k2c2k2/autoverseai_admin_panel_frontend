'use client';

import { IconTrendingUp } from '@tabler/icons-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { MonthlyTrend } from '@/types/stats';

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
  users: {
    label: 'Users',
    color: 'var(--primary)'
  },
  licenses: {
    label: 'Licenses',
    color: 'var(--primary)'
  }
} satisfies ChartConfig;

interface AreaGraphProps {
  data?: MonthlyTrend[];
}

export function AreaGraph({ data }: AreaGraphProps) {
  // Use provided data or fallback to default
  const chartData =
    data && data.length > 0
      ? data.map((item) => ({
          month: item.month,
          users: item.users,
          licenses: item.licenses
        }))
      : [
          { month: 'January', users: 100, licenses: 50 },
          { month: 'February', users: 120, licenses: 60 },
          { month: 'March', users: 140, licenses: 70 },
          { month: 'April', users: 160, licenses: 80 },
          { month: 'May', users: 180, licenses: 90 },
          { month: 'June', users: 200, licenses: 100 }
        ];

  // Calculate growth percentage
  const latestData = chartData[chartData.length - 1];
  const previousData = chartData[chartData.length - 2];
  const growthPercentage = previousData
    ? (
        ((latestData.users - previousData.users) / previousData.users) *
        100
      ).toFixed(1)
    : '0';
  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Monthly Trends</CardTitle>
        <CardDescription>
          Users and licenses growth over the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <defs>
              <linearGradient id='fillUsers' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-users)'
                  stopOpacity={1.0}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-users)'
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id='fillLicenses' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-licenses)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-licenses)'
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='dot' />}
            />
            <Area
              dataKey='licenses'
              type='natural'
              fill='url(#fillLicenses)'
              stroke='var(--color-licenses)'
              stackId='a'
            />
            <Area
              dataKey='users'
              type='natural'
              fill='url(#fillUsers)'
              stroke='var(--color-users)'
              stackId='a'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 leading-none font-medium'>
              {Number(growthPercentage) > 0 ? 'Trending up' : 'Trending down'}{' '}
              by {Math.abs(Number(growthPercentage))}% this month{' '}
              <IconTrendingUp className='h-4 w-4' />
            </div>
            <div className='text-muted-foreground flex items-center gap-2 leading-none'>
              {chartData[0]?.month} - {chartData[chartData.length - 1]?.month}{' '}
              2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
