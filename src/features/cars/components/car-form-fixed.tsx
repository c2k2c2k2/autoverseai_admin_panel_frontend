'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Car, CreateCarDto, UpdateCarDto } from '@/types/car';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { carsApi } from '../api/cars';
import Image from 'next/image';
import { Brand } from '@/types/brand';
import { brandsApi } from '@/features/brands/api/brands';
import { MultiSelect } from '@/components/ui/multi-select';

const carTypes = [
  'sedan',
  'suv',
  'hatchback',
  'coupe',
  'convertible',
  'wagon',
  'pickup',
  'van',
  'other'
] as const;

const fuelTypes = [
  'petrol',
  'diesel',
  'electric',
  'hybrid',
  'cng',
  'lpg'
] as const;

const statuses = ['active', 'inactive', 'discontinued', 'upcoming'] as const;

const currencies = ['USD', 'EUR', 'GBP', 'INR'] as const;

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  description: z.string().optional(),
  imageUrl: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  imageUrls: z.array(z.string().url('Please enter valid URLs')).optional(),
  brandId: z.string().uuid('Please select a brand'),
  status: z.enum(statuses).optional(),
  type: z.enum(carTypes).optional(),
  fuelTypes: z.array(z.enum(fuelTypes)).optional(),
  launchYear: z.coerce
    .number()
    .min(1900, 'Year must be after 1900')
    .max(new Date().getFullYear() + 5, 'Year cannot be too far in the future'),
  startingPrice: z.coerce
    .number()
    .min(0, 'Price must be positive')
    .max(1000000000, 'Price is too high'),
  currency: z.enum(currencies),
  features: z.record(z.string(), z.any()).optional(),
  specifications: z.record(z.string(), z.any()).optional()
});

type CarFormValues = z.infer<typeof formSchema>;

interface CarFormProps {
  initialData?: Car | null;
  brandId?: string;
}

export function CarForm({ initialData, brandId }: CarFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imageUrl || null
  );
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    // Load brands for dropdown
    const loadBrands = async () => {
      try {
        const activeBrands = await brandsApi.getActiveBrands();
        setBrands(activeBrands);
      } catch (error) {
        toast.error('Failed to load brands');
      }
    };
    loadBrands();
  }, []);

  const title = initialData ? 'Edit car' : 'Create car';
  const description = initialData ? 'Edit a car.' : 'Add a new car';
  const toastMessage = initialData ? 'Car updated.' : 'Car created.';
  const action = initialData ? 'Save changes' : 'Create';

  const getDefaultValues = useCallback((): CarFormValues => {
    if (initialData) {
      return {
        name: initialData.name,
        description: initialData.description || '',
        imageUrl: initialData.imageUrl || '',
        imageUrls: initialData.imageUrls || [],
        brandId: initialData.brand?.id || '',
        status: initialData.status,
        type: initialData.type,
        fuelTypes: (initialData.fuelTypes ||
          []) as (typeof fuelTypes)[number][],
        launchYear: initialData.launchYear,
        startingPrice: initialData.startingPrice,
        currency: (currencies.includes(initialData.currency as any)
          ? initialData.currency
          : 'USD') as (typeof currencies)[number],
        features: initialData.features || {},
        specifications: initialData.specifications || {}
      };
    }

    return {
      name: '',
      description: '',
      imageUrl: '',
      imageUrls: [],
      brandId: brandId || '',
      status: 'active',
      type: 'sedan',
      fuelTypes: [],
      launchYear: new Date().getFullYear(),
      startingPrice: 0,
      currency: 'USD',
      features: {},
      specifications: {}
    };
  }, [initialData, brandId]);

  const form = useForm<CarFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues()
  });

  // Reset form when initialData or brands change
  useEffect(() => {
    if (initialData && brands.length > 0) {
      const formValues = getDefaultValues();
      form.reset(formValues);
      setImagePreview(initialData.imageUrl || null);
    }
  }, [initialData, brands, form, getDefaultValues]);

  const onSubmit = async (data: CarFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await carsApi.updateCar(initialData.id, data as UpdateCarDto);
      } else {
        await carsApi.createCar(data as CreateCarDto);
      }

      router.refresh();
      router.push('/dashboard/cars');
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUrlChange = (url: string) => {
    if (url && url.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>{title}</h3>
        <p className='text-muted-foreground text-sm'>{description}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder='Car name'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={loading}
                        placeholder='Car description'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='brandId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand *</FormLabel>
                    <Select
                      disabled={loading || !!brandId}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select brand' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brands?.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select status' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {carTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='fuelTypes'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fuel Types *</FormLabel>
                    <FormControl>
                      <MultiSelect
                        disabled={loading}
                        placeholder='Select fuel types'
                        options={fuelTypes.map((type) => ({
                          label: type.charAt(0).toUpperCase() + type.slice(1),
                          value: type
                        }))}
                        selected={field.value || []}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='launchYear'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Launch Year *</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          disabled={loading}
                          placeholder='2024'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='currency'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency *</FormLabel>
                      <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select currency' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {currency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='startingPrice'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Starting Price *</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        disabled={loading}
                        placeholder='29999'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='imageUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Image URL</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder='https://example.com/image.jpg'
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleImageUrlChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='space-y-4'>
              <div>
                <FormLabel>Image Preview</FormLabel>
                <div className='mt-2 flex h-64 w-full items-center justify-center rounded-lg border border-dashed border-gray-300'>
                  {imagePreview ? (
                    <div className='relative h-full w-full'>
                      <Image
                        src={imagePreview}
                        alt='Car preview'
                        fill
                        className='rounded-lg object-contain p-4'
                        onError={() => setImagePreview(null)}
                      />
                    </div>
                  ) : (
                    <div className='text-center'>
                      <div className='text-gray-400'>
                        <svg
                          className='mx-auto h-12 w-12'
                          stroke='currentColor'
                          fill='none'
                          viewBox='0 0 48 48'
                        >
                          <path
                            d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                            strokeWidth={2}
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      </div>
                      <p className='mt-2 text-sm text-gray-500'>
                        Enter a valid image URL to see preview
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <Button disabled={loading} type='submit'>
              {action}
            </Button>
            <Button
              disabled={loading}
              variant='outline'
              type='button'
              onClick={() => router.push('/dashboard/cars')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
