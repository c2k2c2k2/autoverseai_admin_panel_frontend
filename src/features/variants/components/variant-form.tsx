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
import { Switch } from '@/components/ui/switch';
import { Variant } from '@/types/variant';
import type { CreateVariantDto, UpdateVariantDto } from '@/types/variant';
import { Brand } from '@/types/brand';
import { Car } from '@/types/car';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { variantsApi } from '../api/variants';
import { brandsApi } from '../../brands/api/brands';
import { carsApi } from '../../cars/api/cars';
import Image from 'next/image';

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  description: z.string().optional(),
  brandId: z.string().min(1, 'Brand is required'),
  carId: z.string().min(1, 'Car is required'),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  currency: z.string().optional(),
  discountedPrice: z.coerce.number().min(0).optional().or(z.literal('')),
  engineCapacity: z.string().optional(),
  horsePower: z.coerce.number().min(0).optional().or(z.literal('')),
  torque: z.coerce.number().min(0).optional().or(z.literal('')),
  transmission: z.enum(['manual', 'automatic', 'cvt', 'dct', 'amt']).optional(),
  driveType: z.enum(['fwd', 'rwd', 'awd', '4wd']).optional(),
  fuelEfficiency: z.coerce.number().min(0).optional().or(z.literal('')),
  seatingCapacity: z.coerce
    .number()
    .min(1)
    .max(50)
    .optional()
    .or(z.literal('')),
  bootSpace: z.coerce.number().min(0).optional().or(z.literal('')),
  color: z.string().optional(),
  colorCode: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      'Color code must be a valid hex color code (e.g., #FF0000)'
    )
    .optional()
    .or(z.literal('')),
  imageUrl: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  isAvailable: z.boolean().optional(),
  stockQuantity: z.coerce.number().min(0).optional().or(z.literal(''))
});

type VariantFormValues = z.infer<typeof formSchema>;

interface VariantFormProps {
  initialData?: Variant | null;
}

export function VariantForm({ initialData }: { initialData?: Variant | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imageUrl || null
  );

  const title = initialData ? 'Edit variant' : 'Create variant';
  const description = initialData ? 'Edit a variant.' : 'Add a new variant';
  const toastMessage = initialData ? 'Variant updated.' : 'Variant created.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData
    ? {
        name: initialData.name,
        description: initialData.description || '',
        brandId: initialData.brandId,
        carId: initialData.carId,
        price: initialData.price,
        currency: initialData.currency || 'USD',
        discountedPrice: initialData.discountedPrice || undefined,
        engineCapacity: initialData.engineCapacity || '',
        horsePower: initialData.horsePower || undefined,
        torque: initialData.torque || undefined,
        transmission: initialData.transmission || undefined,
        driveType: initialData.driveType || undefined,
        fuelEfficiency: initialData.fuelEfficiency || undefined,
        seatingCapacity: initialData.seatingCapacity || undefined,
        bootSpace: initialData.bootSpace || undefined,
        color: initialData.color || '',
        colorCode: initialData.colorCode || '',
        imageUrl: initialData.imageUrl || '',
        isAvailable: initialData.isAvailable ?? true,
        stockQuantity: initialData.stockQuantity || 0
      }
    : {
        name: '',
        description: '',
        brandId: '',
        carId: '',
        price: 0,
        currency: 'USD',
        discountedPrice: undefined,
        engineCapacity: '',
        horsePower: undefined,
        torque: undefined,
        transmission: undefined,
        driveType: undefined,
        fuelEfficiency: undefined,
        seatingCapacity: undefined,
        bootSpace: undefined,
        color: '',
        colorCode: '',
        imageUrl: '',
        isAvailable: true,
        stockQuantity: 0
      };

  const form = useForm<VariantFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const selectedBrandId = form.watch('brandId');

  // Load brands and cars on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [brandsData, carsData] = await Promise.all([
          brandsApi.getActiveBrands(),
          carsApi.getActiveCars()
        ]);

        setBrands(brandsData);
        setCars(carsData);
      } catch (error) {
        toast.error('Failed to load brands and cars');
      }
    };
    loadData();
  }, []);

  // Filter cars based on selected brand
  useEffect(() => {
    if (selectedBrandId) {
      const filtered = cars.filter((car) => car.brandId === selectedBrandId);
      setFilteredCars(filtered);

      // Reset car selection if current car doesn't belong to selected brand
      const currentCarId = form.getValues('carId');
      if (currentCarId && !filtered.find((car) => car.id === currentCarId)) {
        form.setValue('carId', '');
      }
    } else {
      setFilteredCars([]);
      form.setValue('carId', '');
    }
  }, [selectedBrandId, cars, form]);

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      const formValues = {
        name: initialData.name,
        description: initialData.description || '',
        brandId: initialData.brandId,
        carId: initialData.carId,
        price: initialData.price,
        currency: initialData.currency || 'USD',
        discountedPrice: initialData.discountedPrice || undefined,
        engineCapacity: initialData.engineCapacity || '',
        horsePower: initialData.horsePower || undefined,
        torque: initialData.torque || undefined,
        transmission: initialData.transmission || undefined,
        driveType: initialData.driveType || undefined,
        fuelEfficiency: initialData.fuelEfficiency || undefined,
        seatingCapacity: initialData.seatingCapacity || undefined,
        bootSpace: initialData.bootSpace || undefined,
        color: initialData.color || '',
        colorCode: initialData.colorCode || '',
        imageUrl: initialData.imageUrl || '',
        isAvailable: initialData.isAvailable ?? true,
        stockQuantity: initialData.stockQuantity || 0
      };
      form.reset(formValues);
      setImagePreview(initialData.imageUrl || null);
    }
  }, [initialData, form]);

  const onSubmit = async (data: VariantFormValues) => {
    try {
      setLoading(true);

      const payload: CreateVariantDto | UpdateVariantDto = {
        name: data.name,
        description: data.description || undefined,
        brandId: data.brandId,
        carId: data.carId,
        price: data.price,
        currency: data.currency || 'USD',
        discountedPrice:
          data.discountedPrice === '' ? undefined : data.discountedPrice,
        engineCapacity: data.engineCapacity || undefined,
        horsePower: data.horsePower === '' ? undefined : data.horsePower,
        torque: data.torque === '' ? undefined : data.torque,
        transmission: data.transmission || undefined,
        driveType: data.driveType || undefined,
        fuelEfficiency:
          data.fuelEfficiency === '' ? undefined : data.fuelEfficiency,
        seatingCapacity:
          data.seatingCapacity === '' ? undefined : data.seatingCapacity,
        bootSpace: data.bootSpace === '' ? undefined : data.bootSpace,
        color: data.color || undefined,
        colorCode: data.colorCode || undefined,
        imageUrl: data.imageUrl || undefined,
        isAvailable: data.isAvailable ?? true,
        stockQuantity: data.stockQuantity === '' ? 0 : data.stockQuantity
      };

      if (initialData) {
        await variantsApi.updateVariant(
          initialData.id,
          payload as UpdateVariantDto
        );
      } else {
        await variantsApi.createVariant(payload as CreateVariantDto);
      }

      router.refresh();
      router.push('/dashboard/variants');
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
              {/* Basic Information */}
              <div className='space-y-4'>
                <h4 className='text-md font-medium'>Basic Information</h4>

                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder='Variant name'
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
                          placeholder='Variant description'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='brandId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand *</FormLabel>
                        <Select
                          disabled={loading}
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
                            {brands.map((brand) => (
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
                    name='carId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Car *</FormLabel>
                        <Select
                          disabled={loading || !selectedBrandId}
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select car' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filteredCars.map((car) => (
                              <SelectItem key={car.id} value={car.id}>
                                {car.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className='space-y-4'>
                <h4 className='text-md font-medium'>Pricing</h4>

                <div className='grid grid-cols-3 gap-4'>
                  <FormField
                    control={form.control}
                    name='price'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price *</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            type='number'
                            placeholder='0'
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(
                                value === '' ? '' : parseFloat(value) || 0
                              );
                            }}
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
                        <FormLabel>Currency</FormLabel>
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
                            <SelectItem value='USD'>USD</SelectItem>
                            <SelectItem value='EUR'>EUR</SelectItem>
                            <SelectItem value='GBP'>GBP</SelectItem>
                            <SelectItem value='INR'>INR</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='discountedPrice'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discounted Price</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            type='number'
                            placeholder='0'
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(
                                value === '' ? '' : parseFloat(value)
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Technical Specifications */}
              <div className='space-y-4'>
                <h4 className='text-md font-medium'>
                  Technical Specifications
                </h4>

                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='engineCapacity'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Engine Capacity</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder='1.5L'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='horsePower'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horse Power</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            type='number'
                            placeholder='150'
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(
                                value === '' ? '' : parseInt(value)
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='torque'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Torque (Nm)</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            type='number'
                            placeholder='200'
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(
                                value === '' ? '' : parseInt(value)
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='fuelEfficiency'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fuel Efficiency (km/l)</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            type='number'
                            step='0.1'
                            placeholder='15.5'
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(
                                value === '' ? '' : parseFloat(value)
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='transmission'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transmission</FormLabel>
                        <Select
                          disabled={loading}
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select transmission' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='manual'>Manual</SelectItem>
                            <SelectItem value='automatic'>Automatic</SelectItem>
                            <SelectItem value='cvt'>CVT</SelectItem>
                            <SelectItem value='dct'>DCT</SelectItem>
                            <SelectItem value='amt'>AMT</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='driveType'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Drive Type</FormLabel>
                        <Select
                          disabled={loading}
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select drive type' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='fwd'>
                              Front Wheel Drive
                            </SelectItem>
                            <SelectItem value='rwd'>
                              Rear Wheel Drive
                            </SelectItem>
                            <SelectItem value='awd'>All Wheel Drive</SelectItem>
                            <SelectItem value='4wd'>
                              Four Wheel Drive
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='seatingCapacity'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seating Capacity</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            type='number'
                            placeholder='5'
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(
                                value === '' ? '' : parseInt(value)
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='bootSpace'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Boot Space (L)</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            type='number'
                            placeholder='400'
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(
                                value === '' ? '' : parseInt(value)
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Appearance */}
              <div className='space-y-4'>
                <h4 className='text-md font-medium'>Appearance</h4>

                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='color'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder='Pearl White'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='colorCode'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color Code</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder='#FFFFFF'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='imageUrl'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder='https://example.com/variant.jpg'
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

              {/* Availability & Stock */}
              <div className='space-y-4'>
                <h4 className='text-md font-medium'>Availability & Stock</h4>

                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='isAvailable'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base'>Available</FormLabel>
                          <div className='text-muted-foreground text-sm'>
                            Is this variant available for purchase?
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={loading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='stockQuantity'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Quantity</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            type='number'
                            placeholder='0'
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(
                                value === '' ? '' : parseInt(value) || 0
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <div>
                <FormLabel>Image Preview</FormLabel>
                <div className='mt-2 flex h-64 w-full items-center justify-center rounded-lg border border-dashed border-gray-300'>
                  {imagePreview ? (
                    <div className='relative h-full w-full'>
                      <Image
                        src={imagePreview}
                        alt='Variant preview'
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
              onClick={() => router.push('/dashboard/variants')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
