import { serverVariantsApi } from '../api/server-variants';

export default async function VariantDebug() {
  try {
    const data = await serverVariantsApi.getVariants({ page: 1, limit: 10 });

    return (
      <div className='p-4'>
        <h2 className='mb-4 text-xl font-bold'>Variant Debug</h2>
        <pre className='overflow-auto rounded bg-gray-100 p-4'>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  } catch (error) {
    return (
      <div className='p-4'>
        <h2 className='mb-4 text-xl font-bold'>Variant Debug - Error</h2>
        <pre className='overflow-auto rounded bg-red-100 p-4'>
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }
}
