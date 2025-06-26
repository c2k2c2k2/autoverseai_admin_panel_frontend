import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import LicenseTypeListingPage from '@/features/license-types/components/license-type-listing';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';

export const metadata = {
  title: 'License Types | Dashboard',
  description: 'Manage your license types'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function LicenseTypesPage(props: pageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  const key = serialize({ ...searchParams });

  return (
    <div className='flex-1 space-y-4 p-4 pt-6'>
      <div className='flex items-center justify-between'>
        <Heading
          title='License Types'
          description='Manage your license types'
        />
        <Button asChild>
          <Link href='/dashboard/license-types/new'>
            <Plus className='mr-2 h-4 w-4' />
            Add New
          </Link>
        </Button>
      </div>
      <Separator />
      <LicenseTypeListingPage key={key} />
    </div>
  );
}
