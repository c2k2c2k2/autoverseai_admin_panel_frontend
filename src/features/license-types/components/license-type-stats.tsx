'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LicenseTypeStats } from '@/types/license-type';
import { licenseTypesApi } from '../api/license-types';

export function LicenseTypeStats() {
  const [stats, setStats] = useState<LicenseTypeStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await licenseTypesApi.getLicenseTypeStats();
        setStats(response);
      } catch (error) {
        console.error('Failed to fetch license type stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className='grid gap-4 md:grid-cols-3'>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className='animate-pulse'>
            <CardHeader className='space-y-0 pb-2'>
              <CardTitle className='text-muted-foreground bg-muted h-4 rounded text-sm font-medium' />
            </CardHeader>
            <CardContent>
              <div className='bg-muted h-6 rounded text-2xl font-bold' />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      title: 'Total License Types',
      value: stats.total,
      className: 'bg-card'
    },
    {
      title: 'Active License Types',
      value: stats.active,
      className: 'bg-green-50 dark:bg-green-950'
    },
    {
      title: 'Inactive License Types',
      value: stats.inactive,
      className: 'bg-yellow-50 dark:bg-yellow-950'
    }
  ];

  return (
    <div className='grid gap-4 md:grid-cols-3'>
      {cards.map((card) => (
        <Card key={card.title} className={card.className}>
          <CardHeader className='space-y-0 pb-2'>
            <CardTitle className='text-muted-foreground text-sm font-medium'>
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
