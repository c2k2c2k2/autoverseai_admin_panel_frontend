import { CarForm } from '@/features/cars/components/car-form-fixed';
import { serverCarsApi } from '@/features/cars/api/server-cars';
import { notFound } from 'next/navigation';

interface CarPageProps {
  params: Promise<{
    carId: string;
  }>;
}

export default async function CarPage({ params }: CarPageProps) {
  const { carId } = await params;

  let car;
  try {
    car = await serverCarsApi.getCarById(carId);
  } catch (error) {
    notFound();
  }

  return (
    <div className='h-full'>
      <div className='h-full space-y-4 overflow-y-auto p-8 pt-6'>
        <CarForm initialData={car} />
      </div>
    </div>
  );
}
