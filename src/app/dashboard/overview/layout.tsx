import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import { currentUser } from '@clerk/nextjs/server';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import React from 'react';
import { serverStatsApi } from '@/features/overview/api/server-stats';

export default async function OverViewLayout() {
  const user = await currentUser();

  // Fetch real stats data
  let stats;
  try {
    stats = await serverStatsApi.getOverviewStats();
  } catch (error) {
    console.error('Failed to fetch overview stats:', error);
    // Fallback to default values if API fails
    stats = {
      revenue: { totalRevenue: 0, monthlyRevenue: 0, growthRate: 0 },
      users: {
        total: 0,
        active: 0,
        recentSignups: 0,
        inactive: 0,
        pending: 0,
        admins: 0
      },
      licenses: {
        total: 0,
        active: 0,
        expired: 0,
        revoked: 0,
        recentlyIssued: 0,
        expiringThisMonth: 0
      },
      cars: { total: 0, active: 0, inactive: 0, byBrand: {}, byType: {} },
      brands: { total: 0, active: 0, inactive: 0, withCars: 0 },
      variants: { total: 0, active: 0, inactive: 0, averagePrice: 0 },
      licenseTypes: { total: 0, active: 0, inactive: 0, mostUsed: 'N/A' },
      monthlyTrends: []
    };
  }

  // Calculate percentage changes (mock for now, can be calculated from historical data)
  const revenueGrowth = stats.revenue.growthRate;
  const userGrowth = stats.users.recentSignups > 0 ? 15.2 : -5.0;
  const licenseGrowth = stats.licenses.active > 0 ? 8.5 : 0;

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-6 p-6'>
        {/* Welcome Header */}
        <div className='mb-8'>
          <h2 className='text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white'>
            Hi, Welcome back 👋
          </h2>
          <p className='mt-2 text-lg text-gray-600 dark:text-gray-400'>
            {user?.firstName} {user?.lastName}
          </p>
        </div>

        {/* Stats Cards Grid */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2'>
          {/* Revenue Card */}
          <Card className='group relative overflow-hidden border-0 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl dark:from-emerald-900/20 dark:to-teal-900/20'>
            <div className='absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100' />
            <CardHeader className='relative'>
              <CardDescription className='text-sm font-medium text-emerald-700 dark:text-emerald-400'>
                Total Revenue
              </CardDescription>
              <CardTitle className='mt-2 text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl dark:text-white'>
                $
                {stats.revenue.totalRevenue.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </CardTitle>
              <CardAction>
                <Badge
                  variant='outline'
                  className={`mt-4 border-0 px-3 py-1 ${
                    revenueGrowth >= 0
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                >
                  {revenueGrowth >= 0 ? (
                    <IconTrendingUp className='mr-1 h-4 w-4' />
                  ) : (
                    <IconTrendingDown className='mr-1 h-4 w-4' />
                  )}
                  <span className='font-semibold'>
                    {revenueGrowth >= 0 ? '+' : ''}
                    {revenueGrowth}%
                  </span>
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='relative flex flex-col items-start gap-2 border-t border-emerald-100 bg-emerald-50/50 pt-4 dark:border-emerald-800 dark:bg-emerald-900/10'>
              <div className='flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400'>
                {revenueGrowth >= 0 ? 'Trending up' : 'Trending down'} this
                month
                {revenueGrowth >= 0 ? (
                  <IconTrendingUp className='h-4 w-4' />
                ) : (
                  <IconTrendingDown className='h-4 w-4' />
                )}
              </div>
              <div className='text-sm text-gray-600 dark:text-gray-400'>
                Monthly revenue: $
                {stats.revenue.monthlyRevenue.toLocaleString('en-US')}
              </div>
            </CardFooter>
          </Card>

          {/* Users Card */}
          <Card className='group relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl dark:from-blue-900/20 dark:to-indigo-900/20'>
            <div className='absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100' />
            <CardHeader className='relative'>
              <CardDescription className='text-sm font-medium text-blue-700 dark:text-blue-400'>
                Total Users
              </CardDescription>
              <CardTitle className='mt-2 text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl dark:text-white'>
                {stats.users.total.toLocaleString('en-US')}
              </CardTitle>
              <CardAction>
                <Badge
                  variant='outline'
                  className={`mt-4 border-0 px-3 py-1 ${
                    userGrowth >= 0
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                >
                  {userGrowth >= 0 ? (
                    <IconTrendingUp className='mr-1 h-4 w-4' />
                  ) : (
                    <IconTrendingDown className='mr-1 h-4 w-4' />
                  )}
                  <span className='font-semibold'>
                    {userGrowth >= 0 ? '+' : ''}
                    {userGrowth}%
                  </span>
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='relative flex flex-col items-start gap-2 border-t border-blue-100 bg-blue-50/50 pt-4 dark:border-blue-800 dark:bg-blue-900/10'>
              <div className='flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-400'>
                {stats.users.recentSignups} new signups
                {userGrowth >= 0 ? (
                  <IconTrendingUp className='h-4 w-4' />
                ) : (
                  <IconTrendingDown className='h-4 w-4' />
                )}
              </div>
              <div className='text-sm text-gray-600 dark:text-gray-400'>
                {stats.users.active} active users
              </div>
            </CardFooter>
          </Card>

          {/* Licenses Card */}
          <Card className='group relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl dark:from-purple-900/20 dark:to-pink-900/20'>
            <div className='absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100' />
            <CardHeader className='relative'>
              <CardDescription className='text-sm font-medium text-purple-700 dark:text-purple-400'>
                Active Licenses
              </CardDescription>
              <CardTitle className='mt-2 text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl dark:text-white'>
                {stats.licenses.active.toLocaleString('en-US')}
              </CardTitle>
              <CardAction>
                <Badge
                  variant='outline'
                  className={`mt-4 border-0 px-3 py-1 ${
                    licenseGrowth >= 0
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                >
                  {licenseGrowth >= 0 ? (
                    <IconTrendingUp className='mr-1 h-4 w-4' />
                  ) : (
                    <IconTrendingDown className='mr-1 h-4 w-4' />
                  )}
                  <span className='font-semibold'>
                    {licenseGrowth >= 0 ? '+' : ''}
                    {licenseGrowth}%
                  </span>
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='relative flex flex-col items-start gap-2 border-t border-purple-100 bg-purple-50/50 pt-4 dark:border-purple-800 dark:bg-purple-900/10'>
              <div className='flex items-center gap-2 text-sm font-medium text-purple-700 dark:text-purple-400'>
                {stats.licenses.recentlyIssued} recently issued
                {licenseGrowth >= 0 ? (
                  <IconTrendingUp className='h-4 w-4' />
                ) : (
                  <IconTrendingDown className='h-4 w-4' />
                )}
              </div>
              <div className='text-sm text-gray-600 dark:text-gray-400'>
                {stats.licenses.expiringThisMonth} expiring this month
              </div>
            </CardFooter>
          </Card>

          {/* Cars Card */}
          <Card className='group relative overflow-hidden border-0 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl dark:from-amber-900/20 dark:to-orange-900/20'>
            <div className='absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100' />
            <CardHeader className='relative'>
              <CardDescription className='text-sm font-medium text-amber-700 dark:text-amber-400'>
                Total Cars
              </CardDescription>
              <CardTitle className='mt-2 text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl dark:text-white'>
                {stats.cars.total.toLocaleString('en-US')}
              </CardTitle>
              <CardAction>
                <Badge
                  variant='outline'
                  className='mt-4 border-0 bg-amber-100 px-3 py-1 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                >
                  <IconTrendingUp className='mr-1 h-4 w-4' />
                  <span className='font-semibold'>
                    {stats.brands.total} brands
                  </span>
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='relative flex flex-col items-start gap-2 border-t border-amber-100 bg-amber-50/50 pt-4 dark:border-amber-800 dark:bg-amber-900/10'>
              <div className='flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-400'>
                {stats.cars.active} active cars
                <IconTrendingUp className='h-4 w-4' />
              </div>
              <div className='text-sm text-gray-600 dark:text-gray-400'>
                {stats.variants.total} total variants
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
