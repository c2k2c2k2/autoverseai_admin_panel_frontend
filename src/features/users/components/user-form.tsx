'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  User,
  UserRole,
  UserStatus,
  CreateUserDto,
  UpdateUserDto
} from '@/types/user';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { toast } from 'sonner';
import { usersApi } from '../api/users';
import { IconLoader2 } from '@tabler/icons-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const userFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
  profileImageUrl: z.string().url('Invalid URL').optional().or(z.literal(''))
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  user?: User;
  isEdit?: boolean;
}

export function UserForm({ user, isEdit = false }: UserFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(
    user?.profileImageUrl || ''
  );

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      role: user?.role || UserRole.USER,
      status: user?.status || UserStatus.PENDING,
      profileImageUrl: user?.profileImageUrl || ''
    }
  });

  // Watch for profileImageUrl changes
  const profileImageUrl = form.watch('profileImageUrl');

  useEffect(() => {
    setImagePreview(profileImageUrl || '');
  }, [profileImageUrl]);

  const onSubmit = async (data: UserFormValues) => {
    try {
      setIsLoading(true);

      // Transform empty strings to undefined for optional fields
      const processedData = {
        ...data,
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
        phone: data.phone || undefined,
        profileImageUrl: data.profileImageUrl || undefined
      };

      if (isEdit && user) {
        await usersApi.updateUser(user.id, processedData as UpdateUserDto);
        toast.success('User updated successfully');
      } else {
        await usersApi.createUser(processedData as CreateUserDto);
        toast.success('User created successfully');
      }

      router.push('/dashboard/users');
      router.refresh();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Something went wrong';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? 'Edit User' : 'Create User'}</CardTitle>
            <CardDescription>
              {isEdit
                ? 'Update user information'
                : 'Add a new user to the system'}
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='user@example.com'
                      {...field}
                      disabled={isEdit}
                    />
                  </FormControl>
                  <FormDescription>
                    {isEdit
                      ? 'Email cannot be changed'
                      : 'User&apos;s email address'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder='John' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Doe' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder='+1234567890' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='profileImageUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Image URL</FormLabel>
                  <div className='flex items-start gap-4'>
                    <div className='flex-1'>
                      <FormControl>
                        <Input
                          placeholder='https://example.com/avatar.jpg'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className='mt-2'>
                        URL to the user&apos;s profile image
                      </FormDescription>
                      <FormMessage />
                    </div>
                    {imagePreview && (
                      <Avatar className='h-16 w-16 flex-shrink-0'>
                        <AvatarImage
                          src={imagePreview}
                          alt='Profile preview'
                          onError={() => setImagePreview('')}
                          className='object-cover'
                        />
                        <AvatarFallback className='text-lg font-medium'>
                          {form
                            .getValues('firstName')
                            ?.charAt(0)
                            ?.toUpperCase() || 'U'}
                          {form
                            .getValues('lastName')
                            ?.charAt(0)
                            ?.toUpperCase() || ''}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a role' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UserRole.USER}>User</SelectItem>
                        <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
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
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a status' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UserStatus.ACTIVE}>
                          Active
                        </SelectItem>
                        <SelectItem value={UserStatus.INACTIVE}>
                          Inactive
                        </SelectItem>
                        <SelectItem value={UserStatus.PENDING}>
                          Pending
                        </SelectItem>
                        <SelectItem value={UserStatus.SUSPENDED}>
                          Suspended
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className='flex justify-end gap-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => router.push('/dashboard/users')}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading && <IconLoader2 className='mr-2 h-4 w-4 animate-spin' />}
            {isEdit ? 'Update User' : 'Create User'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
