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
import { Brand, CreateBrandDto, UpdateBrandDto } from '@/types/brand';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { brandsApi } from '../api/brands';
import Image from 'next/image';

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  description: z.string().optional(),
  logoUrl: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  websiteUrl: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  status: z.enum(['active', 'inactive', 'maintenance']).optional(),
  primaryColor: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      'Primary color must be a valid hex color code (e.g., #FF0000)'
    )
    .optional()
    .or(z.literal('')),
  secondaryColor: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      'Secondary color must be a valid hex color code (e.g., #00FF00)'
    )
    .optional()
    .or(z.literal('')),
  countryCode: z
    .string()
    .length(3, 'Country code must be 3 characters (ISO 3166-1 alpha-3)')
    .optional()
    .or(z.literal(''))
});

type BrandFormValues = z.infer<typeof formSchema>;

interface BrandFormProps {
  initialData?: Brand | null;
}

export function BrandForm({ initialData }: BrandFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.logoUrl || null
  );

  const title = initialData ? 'Edit brand' : 'Create brand';
  const description = initialData ? 'Edit a brand.' : 'Add a new brand';
  const toastMessage = initialData ? 'Brand updated.' : 'Brand created.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData
    ? {
        name: initialData.name,
        description: initialData.description || '',
        logoUrl: initialData.logoUrl || '',
        websiteUrl: initialData.websiteUrl || '',
        status: initialData.status,
        primaryColor: initialData.primaryColor || '',
        secondaryColor: initialData.secondaryColor || '',
        countryCode: initialData.countryCode || ''
      }
    : {
        name: '',
        description: '',
        logoUrl: '',
        websiteUrl: '',
        status: 'active' as const,
        primaryColor: '',
        secondaryColor: '',
        countryCode: ''
      };

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      const formValues = {
        name: initialData.name,
        description: initialData.description || '',
        logoUrl: initialData.logoUrl || '',
        websiteUrl: initialData.websiteUrl || '',
        status: initialData.status,
        primaryColor: initialData.primaryColor || '',
        secondaryColor: initialData.secondaryColor || '',
        countryCode: initialData.countryCode || ''
      };
      form.reset(formValues);
      setImagePreview(initialData.logoUrl || null);
    }
  }, [initialData, form]);

  const onSubmit = async (data: BrandFormValues) => {
    try {
      setLoading(true);

      const payload = {
        name: data.name,
        description: data.description || undefined,
        logoUrl: data.logoUrl || undefined,
        websiteUrl: data.websiteUrl || undefined,
        status: data.status || undefined,
        primaryColor: data.primaryColor || undefined,
        secondaryColor: data.secondaryColor || undefined,
        countryCode: data.countryCode || undefined
      };

      if (initialData) {
        await brandsApi.updateBrand(initialData.id, payload as UpdateBrandDto);
      } else {
        await brandsApi.createBrand(payload as CreateBrandDto);
      }

      router.refresh();
      router.push('/dashboard/brands');
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
                        placeholder='Brand name'
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
                        placeholder='Brand description'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='logoUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder='https://example.com/logo.png'
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

              <FormField
                control={form.control}
                name='websiteUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder='https://example.com'
                        {...field}
                      />
                    </FormControl>
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
                          <SelectValue
                            defaultValue={field.value}
                            placeholder='Select status'
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='active'>Active</SelectItem>
                        <SelectItem value='inactive'>Inactive</SelectItem>
                        <SelectItem value='maintenance'>Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='primaryColor'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Color</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder='#FF0000'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='secondaryColor'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Color</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder='#00FF00'
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
                name='countryCode'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country Code</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder='USA'
                        maxLength={3}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value.toUpperCase());
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
                <FormLabel>Logo Preview</FormLabel>
                <div className='mt-2 flex h-64 w-full items-center justify-center rounded-lg border border-dashed border-gray-300'>
                  {imagePreview ? (
                    <div className='relative h-full w-full'>
                      <Image
                        src={imagePreview}
                        alt='Logo preview'
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
              onClick={() => router.push('/dashboard/brands')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
