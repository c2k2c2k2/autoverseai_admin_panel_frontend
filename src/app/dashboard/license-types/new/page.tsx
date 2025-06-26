import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { LicenseTypeForm } from '@/features/license-types/components/license-type-form';

export const metadata = {
  title: 'Create License Type | Dashboard',
  description: 'Create a new license type'
};

export default function NewLicenseTypePage() {
  return (
    <div className='flex-1 space-y-4 p-4 pt-6'>
      <div className='flex items-center justify-between'>
        <Heading
          title='Create License Type'
          description='Add a new license type'
        />
      </div>
      <Separator />
      <LicenseTypeForm />
    </div>
  );
}
