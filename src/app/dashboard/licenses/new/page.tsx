import { LicenseForm } from '@/features/licenses/components/license-form';
import { serverUsersApi } from '@/features/users/api/server-users';
import { serverLicenseTypesApi } from '@/features/license-types/api/server-license-types';
import { serverBrandsApi } from '@/features/brands/api/server-brands';

export default async function NewLicensePage() {
  const [users, licenseTypes, brands] = await Promise.all([
    serverUsersApi.getUsers({ limit: 100 }), // Get users (limited to 100)
    serverLicenseTypesApi.getActiveLicenseTypes(),
    serverBrandsApi.getActiveBrands()
  ]);

  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <LicenseForm
        users={users.data}
        licenseTypes={licenseTypes}
        brands={brands}
      />
    </div>
  );
}
