import { searchParamsCache } from '@/lib/searchparams';
import { UserTableClient } from './user-table-client';
import { columns } from './columns';
import { serverUsersApi } from '../api/server-users';

export default async function UserListingPage() {
  // Get search params from cache
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');

  const filters = {
    page: page || 1,
    limit: pageLimit || 10,
    ...(search && { search })
  };

  // Fetch users data
  const data = await serverUsersApi.getUsers(filters);

  return (
    <UserTableClient
      data={data.data}
      totalItems={data.total}
      columns={columns}
    />
  );
}
