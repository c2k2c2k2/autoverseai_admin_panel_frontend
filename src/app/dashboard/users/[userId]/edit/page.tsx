'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { UserForm } from '@/features/users/components/user-form';
import { usersApi } from '@/features/users/api/users';
import { User } from '@/types/user';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function EditUserPage() {
  const params = useParams();
  const userId = params.userId as string;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await usersApi.getUser(userId);
        setUser(data);
      } catch (error: any) {
        console.error('Failed to fetch user:', error);
        setError('Failed to load user data');
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className='flex-1 space-y-4 p-4 pt-6 md:p-8'>
        <div className='flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Edit User</h2>
            <p className='text-muted-foreground'>
              Update user information and permissions
            </p>
          </div>
        </div>
        <div className='max-w-2xl space-y-4'>
          <Skeleton className='h-8 w-64' />
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-32 w-full' />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className='flex-1 space-y-4 p-4 pt-6 md:p-8'>
        <div className='flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Edit User</h2>
            <p className='text-muted-foreground'>
              Update user information and permissions
            </p>
          </div>
        </div>
        <div className='py-8 text-center'>
          <p className='text-muted-foreground'>{error || 'User not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex-1 space-y-4 p-4 pt-6 md:p-8'>
      <div className='flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Edit User</h2>
          <p className='text-muted-foreground'>
            Update user information and permissions
          </p>
        </div>
      </div>
      <div className='max-w-2xl'>
        <UserForm user={user} isEdit />
      </div>
    </div>
  );
}
