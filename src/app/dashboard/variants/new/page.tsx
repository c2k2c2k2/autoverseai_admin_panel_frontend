import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { VariantForm } from '@/features/variants/components/variant-form';

export const metadata = {
  title: 'Create Variant | Dashboard',
  description: 'Create a new car variant'
};

export default function NewVariantPage() {
  return (
    <div className='flex-1 space-y-4 p-4 pt-6'>
      <div className='flex items-center justify-between'>
        <Heading
          title='Create Variant'
          description='Add a new car variant to your inventory'
        />
      </div>
      <Separator />
      <VariantForm />
    </div>
  );
}
