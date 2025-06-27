'use client';

import { ColumnDef } from '@tanstack/react-table';
import { User, UserRole, UserStatus } from '@/types/user';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { UserActions } from './user-actions';

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'profileImageUrl',
    header: '',
    cell: ({ row }) => {
      const user = row.original;
      const initials =
        `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() ||
        user.email.charAt(0).toUpperCase();

      return (
        <Avatar className='h-8 w-8 flex-shrink-0'>
          <AvatarImage
            src={user.profileImageUrl}
            alt={user.fullName || user.email}
            className='object-cover'
          />
          <AvatarFallback className='text-xs font-medium'>
            {initials}
          </AvatarFallback>
        </Avatar>
      );
    },
    size: 50
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div>
          <div className='font-medium'>{user.email}</div>
          {user.fullName && (
            <div className='text-muted-foreground text-sm'>{user.fullName}</div>
          )}
        </div>
      );
    },
    meta: {
      label: 'Email',
      placeholder: 'Search users...',
      variant: 'text'
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ getValue }) => {
      const phone = getValue() as string | undefined;
      return phone || '-';
    }
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ getValue }) => {
      const role = getValue() as UserRole;
      return (
        <Badge variant={role === UserRole.ADMIN ? 'default' : 'secondary'}>
          {role}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue() as UserStatus;
      const variants: Record<
        UserStatus,
        'default' | 'secondary' | 'destructive' | 'outline'
      > = {
        [UserStatus.ACTIVE]: 'default',
        [UserStatus.INACTIVE]: 'secondary',
        [UserStatus.PENDING]: 'outline',
        [UserStatus.SUSPENDED]: 'destructive'
      };

      return <Badge variant={variants[status]}>{status}</Badge>;
    }
  },
  {
    accessorKey: 'lastLoginAt',
    header: 'Last Login',
    cell: ({ getValue }) => {
      const date = getValue() as Date | undefined;
      return date ? format(new Date(date), 'MMM d, yyyy') : 'Never';
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ getValue }) => {
      const date = getValue() as string;
      return format(new Date(date), 'MMM d, yyyy');
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <UserActions user={row.original} />
  }
];
