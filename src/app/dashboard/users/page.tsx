import { Suspense } from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import UserListingPage from '@/features/users/components/user-listing';
import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function UsersPage(props: PageProps) {
  const searchParams = await props.searchParams;
  // Parse and cache search params
  searchParamsCache.parse(searchParams);

  return (
    <div className='flex-1 space-y-4 p-4 pt-6 md:p-8'>
      <Suspense fallback={<div>Loading...</div>}>
        <UserListingPage />
      </Suspense>
    </div>
  );
}
