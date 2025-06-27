'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { licenseTypesApi } from '@/features/license-types/api/license-types';
import {
  CreateLicenseTypeDto,
  UpdateLicenseTypeDto,
  LicenseType,
  LicenseTypeStatus,
  PlatformType
} from '@/types/license-type';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

const platformOptions = [
  'standalone',
  'meta_quest',
  'vision_pro',
  'windows',
  'mac',
  'linux',
  'android',
  'ios',
  'web'
] as const;

const statusOptions = ['active', 'inactive', 'deprecated'] as const;

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  code: z
    .string()
    .min(1, 'Code is required')
    .max(50, 'Code must be less than 50 characters'),
  description: z.string().max(1000).optional(),
  status: z.enum(statusOptions).default('active'),
  supportedPlatforms: z.array(z.enum(platformOptions)).default([]),
  downloadUrl: z.string().url().optional().or(z.literal('')),
  iconUrl: z.string().url().optional().or(z.literal('')),
  version: z.string().max(20).optional(),
  maxUsers: z.union([z.number().int().min(1), z.null()]).optional(),
  validityDays: z
    .union([z.number().int().min(1).max(3650), z.null()])
    .optional(),
  requiresActivation: z.boolean().default(false),
  allowMultipleDevices: z.boolean().default(true),
  maxDevices: z.union([z.number().int().min(1), z.null()]).optional(),
  price: z.union([z.number().min(0), z.null()]).optional(),
  currency: z.string().length(3).default('USD'),
  systemRequirements: z.string().optional(),
  features: z.string().optional(),
  tags: z.string().optional()
});

type LicenseTypeFormValues = z.infer<typeof formSchema>;

interface LicenseTypeFormProps {
  initialData?: LicenseType | null;
}

export function LicenseTypeForm({ initialData }: LicenseTypeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [iconPreview, setIconPreview] = useState<string | null>(
    initialData?.iconUrl || null
  );

  const title = initialData ? 'Edit license type' : 'Create license type';
  const description = initialData
    ? 'Edit a license type.'
    : 'Add a new license type';
  const toastMessage = initialData
    ? 'License type updated.'
    : 'License type created.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData
    ? {
        name: initialData.name,
        code: initialData.code,
        description: initialData.description || '',
        status: initialData.status as LicenseTypeStatus,
        supportedPlatforms: initialData.supportedPlatforms as PlatformType[],
        downloadUrl: initialData.downloadUrl || '',
        iconUrl: initialData.iconUrl || '',
        version: initialData.version || '',
        maxUsers: initialData.maxUsers,
        validityDays: initialData.validityDays,
        requiresActivation: initialData.requiresActivation,
        allowMultipleDevices: initialData.allowMultipleDevices,
        maxDevices: initialData.maxDevices,
        price:
          initialData.price !== null && initialData.price !== undefined
            ? typeof initialData.price === 'string'
              ? parseFloat(initialData.price)
              : initialData.price
            : null,
        currency: initialData.currency || 'USD',
        systemRequirements: initialData.systemRequirements
          ? JSON.stringify(initialData.systemRequirements, null, 2)
          : '',
        features: initialData.features ? initialData.features.join(', ') : '',
        tags: initialData.tags ? initialData.tags.join(', ') : ''
      }
    : {
        name: '',
        code: '',
        description: '',
        status: 'active' as LicenseTypeStatus,
        supportedPlatforms: [] as PlatformType[],
        downloadUrl: '',
        iconUrl: '',
        version: '',
        maxUsers: null,
        validityDays: null,
        requiresActivation: false,
        allowMultipleDevices: true,
        maxDevices: null,
        price: null,
        currency: 'USD',
        systemRequirements: '',
        features: '',
        tags: ''
      };

  const form = useForm<LicenseTypeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      const formValues = {
        name: initialData.name,
        code: initialData.code,
        description: initialData.description || '',
        status: initialData.status,
        supportedPlatforms: initialData.supportedPlatforms,
        downloadUrl: initialData.downloadUrl || '',
        iconUrl: initialData.iconUrl || '',
        version: initialData.version || '',
        maxUsers: initialData.maxUsers,
        validityDays: initialData.validityDays,
        requiresActivation: initialData.requiresActivation,
        allowMultipleDevices: initialData.allowMultipleDevices,
        maxDevices: initialData.maxDevices,
        price:
          initialData.price !== null && initialData.price !== undefined
            ? typeof initialData.price === 'string'
              ? parseFloat(initialData.price)
              : initialData.price
            : null,
        currency: initialData.currency || 'USD',
        systemRequirements: initialData.systemRequirements
          ? JSON.stringify(initialData.systemRequirements, null, 2)
          : '',
        features: initialData.features ? initialData.features.join(', ') : '',
        tags: initialData.tags ? initialData.tags.join(', ') : ''
      };
      form.reset(formValues);
      setIconPreview(initialData.iconUrl || null);
    }
  }, [initialData, form]);

  const onSubmit = async (data: LicenseTypeFormValues) => {
    try {
      setLoading(true);

      const payload: CreateLicenseTypeDto | UpdateLicenseTypeDto = {
        name: data.name,
        code: data.code,
        description: data.description || undefined,
        status: data.status as LicenseTypeStatus,
        supportedPlatforms: data.supportedPlatforms as PlatformType[],
        downloadUrl: data.downloadUrl || undefined,
        iconUrl: data.iconUrl || undefined,
        version: data.version || undefined,
        maxUsers: data.maxUsers,
        validityDays: data.validityDays,
        requiresActivation: data.requiresActivation,
        allowMultipleDevices: data.allowMultipleDevices,
        maxDevices: data.maxDevices,
        price: data.price,
        currency: data.currency,
        systemRequirements: data.systemRequirements
          ? JSON.parse(data.systemRequirements)
          : undefined,
        features: data.features
          ? data.features
              .split(',')
              .map((f) => f.trim())
              .filter((f) => f.length > 0)
          : undefined,
        tags: data.tags
          ? data.tags
              .split(',')
              .map((t) => t.trim())
              .filter((t) => t.length > 0)
          : undefined
      };

      if (initialData) {
        await licenseTypesApi.updateLicenseType(
          initialData.id,
          payload as UpdateLicenseTypeDto
        );
      } else {
        await licenseTypesApi.createLicenseType(
          payload as CreateLicenseTypeDto
        );
      }

      router.refresh();
      router.push('/dashboard/license-types');
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUrlChange = (url: string) => {
    if (url && url.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
      setIconPreview(url);
    } else {
      setIconPreview(null);
    }
  };

  return (
    <div className='space-y-6'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
            <div className='space-y-4'>
              {/* Basic Information */}
              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='License type name'
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='code'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Unique code'
                          {...field}
                          disabled={loading}
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
                        <Input
                          placeholder='Description'
                          {...field}
                          disabled={loading}
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
                            <SelectValue placeholder='Select status' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Platforms */}
              <div className='space-y-4'>
                <h4 className='text-md font-medium'>Supported Platforms</h4>
                <FormField
                  control={form.control}
                  name='supportedPlatforms'
                  render={({ field }) => (
                    <FormItem>
                      <FormDescription>
                        Select one or more platforms
                      </FormDescription>
                      <div className='grid grid-cols-2 gap-4'>
                        {platformOptions.map((platform) => (
                          <label
                            key={platform}
                            className='flex items-center space-x-2'
                          >
                            <Checkbox
                              checked={field.value?.includes(platform)}
                              onCheckedChange={(checked) => {
                                const updatedValue = checked
                                  ? [...(field.value || []), platform]
                                  : field.value?.filter(
                                      (p: PlatformType) => p !== platform
                                    ) || [];
                                field.onChange(updatedValue);
                              }}
                              disabled={loading}
                            />
                            <span>{platform}</span>
                          </label>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* URLs */}
              <div className='space-y-4'>
                <h4 className='text-md font-medium'>URLs</h4>

                <FormField
                  control={form.control}
                  name='downloadUrl'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Download URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='https://example.com/download'
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='iconUrl'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon URL</FormLabel>
                      <div>
                        <FormControl>
                          <Input
                            placeholder='https://example.com/icon.png'
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleImageUrlChange(e.target.value);
                            }}
                            disabled={loading}
                          />
                        </FormControl>
                        {iconPreview && (
                          <div className='mt-2'>
                            <img
                              src={iconPreview}
                              alt='Icon Preview'
                              className='h-20 w-20 rounded border object-contain'
                              onError={() => setIconPreview(null)}
                            />
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Version and Limits */}
              <div className='space-y-4'>
                <h4 className='text-md font-medium'>Version and Limits</h4>

                <FormField
                  control={form.control}
                  name='version'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Version</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='1.0.0'
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='maxUsers'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Users</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='Max users'
                          value={
                            field.value === null || field.value === undefined
                              ? ''
                              : field.value.toString()
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '') {
                              field.onChange(null);
                            } else {
                              const numValue = parseInt(value, 10);
                              field.onChange(isNaN(numValue) ? null : numValue);
                            }
                          }}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='validityDays'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Validity Days</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='Validity in days'
                          value={
                            field.value === null || field.value === undefined
                              ? ''
                              : field.value.toString()
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '') {
                              field.onChange(null);
                            } else {
                              const numValue = parseInt(value, 10);
                              field.onChange(isNaN(numValue) ? null : numValue);
                            }
                          }}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='maxDevices'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Devices</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='Max devices'
                          value={
                            field.value === null || field.value === undefined
                              ? ''
                              : field.value.toString()
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '') {
                              field.onChange(null);
                            } else {
                              const numValue = parseInt(value, 10);
                              field.onChange(isNaN(numValue) ? null : numValue);
                            }
                          }}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Pricing */}
              <div className='space-y-4'>
                <h4 className='text-md font-medium'>Pricing</h4>

                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='price'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            step='0.01'
                            placeholder='Price'
                            value={
                              field.value === null || field.value === undefined
                                ? ''
                                : field.value.toString()
                            }
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '') {
                                field.onChange(null);
                              } else {
                                const numValue = parseFloat(value);
                                field.onChange(
                                  isNaN(numValue) ? null : numValue
                                );
                              }
                            }}
                            disabled={loading}
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
                </div>
              </div>

              {/* Features and Requirements */}
              <div className='space-y-4'>
                <h4 className='text-md font-medium'>
                  Features and Requirements
                </h4>

                <FormField
                  control={form.control}
                  name='systemRequirements'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>System Requirements (JSON)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='{"os": "Windows 10"}'
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='features'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Features (comma separated)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Feature1, Feature2'
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='tags'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags (comma separated)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='tag1, tag2'
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Activation Settings */}
              <div className='space-y-4'>
                <h4 className='text-md font-medium'>Activation Settings</h4>

                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='requiresActivation'
                    render={({ field }) => (
                      <FormItem className='flex items-center space-x-2'>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormLabel className='!mt-0'>
                          Requires Activation
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='allowMultipleDevices'
                    render={({ field }) => (
                      <FormItem className='flex items-center space-x-2'>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormLabel className='!mt-0'>
                          Allow Multiple Devices
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
              onClick={() => router.push('/dashboard/license-types')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
