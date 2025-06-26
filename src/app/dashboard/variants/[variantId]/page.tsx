import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { VariantForm } from '@/features/variants/components/variant-form';
import { serverVariantsApi } from '@/features/variants/api/server-variants';
import { notFound, redirect } from 'next/navigation';
import { auth, currentUser } from '@clerk/nextjs/server';

interface EditVariantPageProps {
  params: Promise<{
    variantId: string;
  }>;
}

export const metadata = {
  title: 'Edit Variant | Dashboard',
  description: 'Edit car variant details'
};

export default async function EditVariantPage({
  params
}: EditVariantPageProps) {
  // const user = await currentUser();

  const { variantId } = await params;

  // if (!user) {
  //   redirect('/sign-in');
  // }

  let variant = null;

  try {
    variant = await serverVariantsApi.getVariant(variantId);
  } catch (error) {
    notFound();
  }

  return (
    <div className='flex-1 space-y-4 p-4 pt-6'>
      <div className='flex items-center justify-between'>
        <Heading title='Edit Variant' description='Update variant details' />
      </div>
      <Separator />
      <VariantForm initialData={variant} />
    </div>
  );
}
