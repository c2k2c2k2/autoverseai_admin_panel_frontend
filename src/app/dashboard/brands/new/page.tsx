import PageContainer from '@/components/layout/page-container';
import { Separator } from '@/components/ui/separator';
import { BrandForm } from '@/features/brands/components/brand-form';

export const metadata = {
  title: 'Create Brand',
  description: 'Create a new brand'
};

export default function NewBrandPage() {
  return (
    <PageContainer>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <div className='space-y-4'>
          <h2 className='text-3xl font-bold tracking-tight'>Create Brand</h2>
          <Separator />
          <BrandForm />
        </div>
      </div>
    </PageContainer>
  );
}
