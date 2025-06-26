import { CarForm } from '@/features/cars/components/car-form-fixed';
import { serverBrandsApi } from '@/features/brands/api/server-brands';
import { notFound } from 'next/navigation';

interface BrandCarsPageProps {
  params: Promise<{
    brandId: string;
  }>;
}

export default async function BrandCarsPage({ params }: BrandCarsPageProps) {
  const { brandId } = await params;

  let brand;
  try {
    brand = await serverBrandsApi.getBrand(brandId);
  } catch (error) {
    notFound();
  }

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <CarForm brandId={brand.id} />
      </div>
    </div>
  );
}
