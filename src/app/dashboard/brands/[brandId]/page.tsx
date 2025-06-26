import PageContainer from '@/components/layout/page-container';
import { Separator } from '@/components/ui/separator';
import { BrandForm } from '@/features/brands/components/brand-form';
import { serverBrandsApi } from '@/features/brands/api/server-brands';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Edit Brand',
  description: 'Edit brand information'
};

interface EditBrandPageProps {
  params: Promise<{
    brandId: string;
  }>;
}

export default async function EditBrandPage({ params }: EditBrandPageProps) {
  const { brandId } = await params;

  let brand;
  try {
    brand = await serverBrandsApi.getBrand(brandId);
  } catch (error) {
    notFound();
  }

  return (
    <PageContainer>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <div className='space-y-4'>
          <h2 className='text-3xl font-bold tracking-tight'>Edit Brand</h2>
          <Separator />
          <BrandForm initialData={brand} />
        </div>
      </div>
    </PageContainer>
  );
}
