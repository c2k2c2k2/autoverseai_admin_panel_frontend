import { CarForm } from '@/features/cars/components/car-form-fixed';

export default function NewCarPage() {
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <CarForm />
      </div>
    </div>
  );
}
