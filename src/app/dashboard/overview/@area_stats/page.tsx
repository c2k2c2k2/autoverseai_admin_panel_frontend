import { AreaGraph } from '@/features/overview/components/area-graph';
import { serverStatsApi } from '@/features/overview/api/server-stats';
import { MonthlyTrend } from '@/types/stats';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorDetails {
  message: string;
  statusCode?: number;
  isAuthError?: boolean;
}

function ErrorFallback({ error }: { error: ErrorDetails }) {
  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Monthly Trends</CardTitle>
        <CardDescription>Unable to load statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.isAuthError
              ? "You don't have permission to view these statistics. Please contact an administrator."
              : error.message ||
                'Failed to load monthly trends. Please try again later.'}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

export default async function AreaStats() {
  let monthlyTrends: MonthlyTrend[] = [];
  let error: ErrorDetails | null = null;

  try {
    const stats = await serverStatsApi.getOverviewStats();
    monthlyTrends = stats.monthlyTrends || [];
  } catch (err: any) {
    console.error('Failed to fetch stats for area graph:', err);

    // Determine error type
    const statusCode = err.response?.status;
    const isAuthError = statusCode === 401 || statusCode === 403;
    const message =
      err.response?.data?.message || err.message || 'Failed to load statistics';

    error = {
      message,
      statusCode,
      isAuthError
    };

    // Log detailed error for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('Stats API Error Details:', {
        status: statusCode,
        data: err.response?.data,
        headers: err.response?.headers,
        config: err.config
      });
    }
  }

  // If there's an error, show the error component
  if (error) {
    return <ErrorFallback error={error} />;
  }

  // Otherwise, render the graph with data (or empty array)
  return <AreaGraph data={monthlyTrends} />;
}
