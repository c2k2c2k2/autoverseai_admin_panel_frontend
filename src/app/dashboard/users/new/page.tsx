import { Breadcrumbs } from '@/components/breadcrumbs';
import { UserForm } from '@/features/users/components/user-form';

export default function NewUserPage() {
  return (
    <div className='flex-1 space-y-4 p-4 pt-6 md:p-8'>
      <div className='max-w-2xl'>
        <UserForm />
      </div>
    </div>
  );
}
