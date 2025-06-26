import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import VariantListingPage from '@/features/variants/components/variant-listing';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';

export const metadata = {
  title: 'Variants | Dashboard',
  description: 'Manage your car variants'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function VariantsPage(props: pageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  const key = serialize({ ...searchParams });

  return (
    <div className='flex-1 space-y-4 p-4 pt-6'>
      <div className='flex items-center justify-between'>
        <Heading title='Variants' description='Manage your car variants' />
        <Button asChild>
          <Link href='/dashboard/variants/new'>
            <Plus className='mr-2 h-4 w-4' />
            Add New
          </Link>
        </Button>
      </div>
      <Separator />
      <VariantListingPage key={key} />
    </div>
  );
}
