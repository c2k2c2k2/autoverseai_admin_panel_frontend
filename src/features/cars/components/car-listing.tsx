'use client';

import { useEffect, useState } from 'react';
import { CarTable } from './car-tables/car-table';
import { Car } from '@/types/car';
import { carsApi } from '../api/cars';
import { toast } from 'sonner';

export const CarListing = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCars = async () => {
      try {
        const response = await carsApi.getCars({});
        setCars(response.data);
      } catch (error) {
        toast.error('Failed to load cars');
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, []);

  if (loading) {
    return (
      <div className='flex h-full items-center justify-center'>
        <div className='h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900' />
      </div>
    );
  }

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <CarTable data={cars} />
      </div>
    </div>
  );
};
