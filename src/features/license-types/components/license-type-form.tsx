'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { licenseTypesApi } from '@/features/license-types/api/license-types';
import {
  CreateLicenseTypeDto,
  PlatformType,
  LicenseTypeStatus
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
  maxUsers: z.number().int().min(1).optional().nullable(),
  validityDays: z.number().int().min(1).max(3650).optional().nullable(),
  requiresActivation: z.boolean().default(false),
  allowMultipleDevices: z.boolean().default(true),
  maxDevices: z.number().int().min(1).optional().nullable(),
  price: z.number().min(0).optional().nullable(),
  currency: z.string().length(3).default('USD'),
  systemRequirements: z.string().optional(),
  features: z.string().optional(),
  tags: z.string().optional()
});

type LicenseTypeFormValues = z.infer<typeof formSchema>;

export function LicenseTypeForm() {
  const router = useRouter();
  const form = useForm<LicenseTypeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      status: 'active',
      supportedPlatforms: [],
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
    }
  });

  const [loading, setLoading] = useState(false);
  const [iconPreview, setIconPreview] = useState('');

  // Update icon preview when iconUrl changes
  const iconUrlValue = form.watch('iconUrl');
  useEffect(() => {
    setIconPreview(iconUrlValue || '');
  }, [iconUrlValue]);

  const handleImageError = () => {
    setIconPreview('');
  };

  const onSubmit = async (data: LicenseTypeFormValues) => {
    setLoading(true);
    try {
      const parsedData: CreateLicenseTypeDto = {
        ...data,
        status: data.status as LicenseTypeStatus,
        supportedPlatforms: data.supportedPlatforms as PlatformType[],
        systemRequirements: data.systemRequirements
          ? JSON.parse(data.systemRequirements)
          : undefined,
        features: data.features
          ? data.features.split(',').map((f) => f.trim())
          : undefined,
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()) : undefined
      };
      await licenseTypesApi.createLicenseType(parsedData);
      toast.success('License type created successfully');
      router.push('/dashboard/license-types');
    } catch (error) {
      toast.error('Failed to create license type');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='max-w-md space-y-4 p-4'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
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
              <FormLabel>Code</FormLabel>
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
                  placeholder='Description (optional)'
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
              <FormControl>
                <select
                  {...field}
                  disabled={loading}
                  className='w-full rounded border p-2'
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='supportedPlatforms'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supported Platforms</FormLabel>
              <FormDescription>Select one or more platforms</FormDescription>
              <FormControl>
                <div className='flex flex-wrap gap-2'>
                  {platformOptions.map((platform) => (
                    <label
                      key={platform}
                      className='inline-flex items-center space-x-2'
                    >
                      <Checkbox
                        checked={field.value?.includes(platform)}
                        onCheckedChange={(checked) => {
                          const updatedValue = checked
                            ? [...field.value, platform]
                            : field.value.filter((p) => p !== platform);
                          field.onChange(updatedValue);
                        }}
                        disabled={loading}
                      />
                      <span>{platform}</span>
                    </label>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
              <FormControl>
                <Input
                  placeholder='https://example.com/icon.png'
                  {...field}
                  disabled={loading}
                />
                {iconPreview && (
                  <img
                    src={iconPreview}
                    alt='Icon Preview'
                    className='mt-2 h-20 w-20 rounded border object-contain'
                    onError={handleImageError}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='version'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Version</FormLabel>
              <FormControl>
                <Input placeholder='1.0.0' {...field} disabled={loading} />
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
                  value={field.value?.toString() ?? ''}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseInt(e.target.value, 10) : null
                    )
                  }
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
                  value={field.value?.toString() ?? ''}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseInt(e.target.value, 10) : null
                    )
                  }
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='requiresActivation'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-y-0 space-x-3'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={loading}
                />
              </FormControl>
              <FormLabel>Requires Activation</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='allowMultipleDevices'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-y-0 space-x-3'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={loading}
                />
              </FormControl>
              <FormLabel>Allow Multiple Devices</FormLabel>
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
                  value={field.value?.toString() ?? ''}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseInt(e.target.value, 10) : null
                    )
                  }
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                  value={field.value?.toString() ?? ''}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseFloat(e.target.value) : null
                    )
                  }
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
              <FormControl>
                <Input
                  placeholder='USD'
                  maxLength={3}
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
                <Input placeholder='tag1, tag2' {...field} disabled={loading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={loading}>
          {loading ? 'Creating...' : 'Create License Type'}
        </Button>
      </form>
    </Form>
  );
}
