'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Mail } from 'lucide-react';

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
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { MultiSelect } from '@/components/ui/multi-select';

import { AssignLicenseDto } from '@/types/license';
import { LicenseType } from '@/types/license-type';
import { Brand } from '@/types/brand';
import { licensesApi } from '@/features/licenses/api/licenses';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  licenseTypeId: z.string().min(1, 'License type is required'),
  brandIds: z.array(z.string()).min(1, 'At least one brand is required'),
  assignmentReason: z.string().optional()
});

type AssignLicenseFormValues = z.infer<typeof formSchema>;

interface LicenseAssignFormProps {
  licenseTypes: LicenseType[];
  brands: Brand[];
}

export const LicenseAssignForm: React.FC<LicenseAssignFormProps> = ({
  licenseTypes,
  brands
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<AssignLicenseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      licenseTypeId: '',
      brandIds: [],
      assignmentReason: ''
    }
  });

  const onSubmit = async (data: AssignLicenseFormValues) => {
    try {
      setLoading(true);
      const assignData: AssignLicenseDto = {
        email: data.email.toLowerCase().trim(),
        licenseTypeId: data.licenseTypeId,
        brandIds: data.brandIds,
        assignmentReason: data.assignmentReason
      };
      await licensesApi.assignLicense(assignData);
      router.push('/dashboard/licenses');
      router.refresh();
      toast.success(
        'License assigned successfully. An email has been sent to the user.'
      );
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const brandOptions = brands.map((brand) => ({
    label: brand.name,
    value: brand.id
  }));

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title='Assign License'
          description='Assign a license to a user by email address'
        />
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
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Mail className='text-muted-foreground absolute top-3 left-3 h-4 w-4' />
                      <Input
                        type='email'
                        disabled={loading}
                        placeholder='user@example.com'
                        className='pl-10'
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    The email address of the user to assign the license to
                  </FormDescription>
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
                    disabled={loading}
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
                  <FormDescription>
                    The type of license to assign
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                    disabled={loading}
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
            name='assignmentReason'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assignment Reason</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={loading}
                    placeholder='Reason for assigning this license...'
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Optional: Provide a reason for assigning this license
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex items-center gap-4'>
            <Button disabled={loading} type='submit'>
              Assign License
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={() => router.push('/dashboard/licenses')}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
