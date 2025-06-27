'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LicenseStats } from '@/types/license';
import {
  Activity,
  AlertCircle,
  Ban,
  CheckCircle,
  Clock,
  FileX,
  Pause,
  TrendingDown
} from 'lucide-react';

interface LicenseStatsProps {
  stats: LicenseStats;
}

export const LicenseStatsComponent: React.FC<LicenseStatsProps> = ({
  stats
}) => {
  const statCards = [
    {
      title: 'Total Licenses',
      value: stats.total,
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Active',
      value: stats.active,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Inactive',
      value: stats.inactive,
      icon: FileX,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    },
    {
      title: 'Expired',
      value: stats.expired,
      icon: Clock,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Suspended',
      value: stats.suspended,
      icon: Pause,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Revoked',
      value: stats.revoked,
      icon: Ban,
      color: 'text-red-700',
      bgColor: 'bg-red-200'
    },
    {
      title: 'Expiring in 7 Days',
      value: stats.expiringIn7Days,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Expiring in 30 Days',
      value: stats.expiringIn30Days,
      icon: TrendingDown,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    }
  ];

  return (
    <div className='space-y-4'>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  {stat.title}
                </CardTitle>
                <div className={`rounded-full p-2 ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {Object.keys(stats.byLicenseType).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Licenses by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              {Object.entries(stats.byLicenseType).map(([type, count]) => (
                <div
                  key={type}
                  className='bg-muted flex items-center justify-between rounded-lg p-2'
                >
                  <span className='font-medium'>{type}</span>
                  <span className='text-muted-foreground'>{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
