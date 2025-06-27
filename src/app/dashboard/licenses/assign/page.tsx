import { LicenseAssignForm } from '@/features/licenses/components/license-assign-form';
import { serverLicenseTypesApi } from '@/features/license-types/api/server-license-types';
import { serverBrandsApi } from '@/features/brands/api/server-brands';

export default async function AssignLicensePage() {
  const [licenseTypes, brands] = await Promise.all([
    serverLicenseTypesApi.getActiveLicenseTypes(),
    serverBrandsApi.getActiveBrands()
  ]);

  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <LicenseAssignForm licenseTypes={licenseTypes} brands={brands} />
    </div>
  );
}
