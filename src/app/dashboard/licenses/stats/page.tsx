import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { LicenseStatsComponent } from '@/features/licenses/components/license-stats';
import { serverLicensesApi } from '@/features/licenses/api/server-licenses';

export default async function LicenseStatsPage() {
  const stats = await serverLicensesApi.getLicenseStats();

  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <div className='flex items-center justify-between'>
        <Heading
          title='License Statistics'
          description='Overview of license usage and distribution'
        />
      </div>
      <Separator />
      <LicenseStatsComponent stats={stats} />
    </div>
  );
}
