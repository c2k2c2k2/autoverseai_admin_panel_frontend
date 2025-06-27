'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { CalendarIcon, Trash } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { AlertModal } from '@/components/modal/alert-modal';
import { MultiSelect } from '@/components/ui/multi-select';

import { License, CreateLicenseDto, UpdateLicenseDto } from '@/types/license';
import { User } from '@/types/user';
import { LicenseType } from '@/types/license-type';
import { Brand } from '@/types/brand';
import { licensesApi } from '@/features/licenses/api/licenses';

const formSchema = z.object({
  userId: z.string().min(1, 'User is required'),
  licenseTypeId: z.string().min(1, 'License type is required'),
  brandIds: z.array(z.string()).min(1, 'At least one brand is required'),
  expiresAt: z.date().optional(),
  notes: z.string().optional(),
  assignmentReason: z.string().optional(),
  maxAccessCount: z.number().min(0).optional(),
  maxDevices: z.number().min(0).optional()
});

type LicenseFormValues = z.infer<typeof formSchema>;

interface LicenseFormProps {
  initialData?: License | null;
  users: User[];
  licenseTypes: LicenseType[];
  brands: Brand[];
}

export const LicenseForm: React.FC<LicenseFormProps> = ({
  initialData,
  users,
  licenseTypes,
  brands
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit License' : 'Create License';
  const description = initialData
    ? 'Edit license details'
    : 'Create a new license';
  const toastMessage = initialData ? 'License updated.' : 'License created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<LicenseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          userId: initialData.user?.id || '',
          licenseTypeId: initialData.licenseType?.id || '',
          brandIds:
            initialData.licenseBrands
              ?.map((lb) => lb.brand?.id)
              .filter(Boolean) || [],
          expiresAt: initialData.expiresAt
            ? new Date(initialData.expiresAt)
            : undefined,
          notes: initialData.notes || '',
          assignmentReason: initialData.assignmentReason || '',
          maxAccessCount: initialData.maxAccessCount || 0,
          maxDevices: initialData.maxDevices || 0
        }
      : {
          userId: '',
          licenseTypeId: '',
          brandIds: [],
          notes: '',
          assignmentReason: '',
          maxAccessCount: 0,
          maxDevices: 0
        }
  });

  const onSubmit = async (data: LicenseFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        const updateData: UpdateLicenseDto = {
          expiresAt: data.expiresAt?.toISOString(),
          notes: data.notes,
          maxAccessCount: data.maxAccessCount,
          maxDevices: data.maxDevices
        };
        await licensesApi.updateLicense(initialData.id, updateData);
      } else {
        const createData: CreateLicenseDto = {
          userId: data.userId,
          licenseTypeId: data.licenseTypeId,
          brandIds: data.brandIds,
          expiresAt: data.expiresAt?.toISOString(),
          notes: data.notes,
          assignmentReason: data.assignmentReason,
          maxAccessCount: data.maxAccessCount,
          maxDevices: data.maxDevices
        };
        await licensesApi.createLicense(createData);
      }
      router.push('/dashboard/licenses');
      router.refresh();
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await licensesApi.deleteLicense(initialData!.id);
      router.push('/dashboard/licenses');
      router.refresh();
      toast.success('License deleted.');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const brandOptions = brands.map((brand) => ({
    label: brand.name,
    value: brand.id
  }));

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className='flex items-center justify-between'>
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant='destructive'
            size='icon'
            onClick={() => setOpen(true)}
          >
            <Trash className='h-4 w-4' />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full space-y-8'
        >
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='userId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User</FormLabel>
                  <Select
                    disabled={loading || !!initialData}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a user' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.email}{' '}
                          {user.firstName || user.lastName
                            ? `(${[user.firstName, user.lastName].filter(Boolean).join(' ')})`
                            : ''}
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
              name='licenseTypeId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>License Type</FormLabel>
                  <Select
                    disabled={loading || !!initialData}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a license type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {licenseTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
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
              name='brandIds'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brands</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={brandOptions}
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder='Select brands'
                      disabled={loading || !!initialData}
                    />
                  </FormControl>
                  <FormDescription>
                    Select the brands this license will have access to
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='expiresAt'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Expiration Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                          disabled={loading}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date (optional)</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Leave empty for no expiration
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='maxAccessCount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Access Count</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      disabled={loading}
                      placeholder='0'
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormDescription>0 for unlimited access</FormDescription>
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
                      disabled={loading}
                      placeholder='0'
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormDescription>0 for unlimited devices</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name='assignmentReason'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assignment Reason</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={loading}
                    placeholder='Reason for creating this license...'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='notes'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={loading}
                    placeholder='Additional notes...'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} className='ml-auto' type='submit'>
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
