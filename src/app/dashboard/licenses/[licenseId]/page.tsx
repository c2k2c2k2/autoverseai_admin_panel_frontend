import { notFound } from 'next/navigation';
import { LicenseForm } from '@/features/licenses/components/license-form';
import { serverLicensesApi } from '@/features/licenses/api/server-licenses';
import { serverUsersApi } from '@/features/users/api/server-users';
import { serverLicenseTypesApi } from '@/features/license-types/api/server-license-types';
import { serverBrandsApi } from '@/features/brands/api/server-brands';

interface LicensePageProps {
  params: Promise<{
    licenseId: string;
  }>;
}

export default async function LicensePage({ params }: LicensePageProps) {
  const resolvedParams = await params;

  try {
    const [license, users, licenseTypes, brands] = await Promise.all([
      serverLicensesApi.getLicense(resolvedParams.licenseId),
      serverUsersApi.getUsers({ limit: 100 }), // Get users (limited to 100)
      serverLicenseTypesApi.getActiveLicenseTypes(),
      serverBrandsApi.getActiveBrands()
    ]);

    return (
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <LicenseForm
          initialData={license}
          users={users.data}
          licenseTypes={licenseTypes}
          brands={brands}
        />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
