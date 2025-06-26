'use client';

import { useState, useMemo } from 'react';
import { LicenseTypeTable } from './license-type-table';
import { columns } from './columns';
import { LicenseType } from '@/types/license-type';
import { licenseTypesApi } from '../api/license-types';
import { CellAction } from './cell-action';

interface LicenseTypeTableClientProps {
  data: LicenseType[];
  totalItems: number;
}

export function LicenseTypeTableClient({
  data,
  totalItems
}: LicenseTypeTableClientProps) {
  const [licenseTypes, setLicenseTypes] = useState<LicenseType[]>(data);
  const [total, setTotal] = useState(totalItems);

  const refreshData = async () => {
    const response = await licenseTypesApi.getLicenseTypes({
      page: 1,
      limit: 10
    });
    setLicenseTypes(response.data);
    setTotal(response.total);
  };

  const handleActivateDeactivate = async (licenseType: LicenseType) => {
    try {
      if (licenseType.status === 'active') {
        await licenseTypesApi.deactivateLicenseType(licenseType.id);
      } else {
        await licenseTypesApi.activateLicenseType(licenseType.id);
      }
      await refreshData();
    } catch (error) {
      console.error('Failed to update license type status:', error);
    }
  };

  const handleDelete = async (licenseType: LicenseType) => {
    if (
      confirm(
        `Are you sure you want to delete license type "${licenseType.name}"?`
      )
    ) {
      try {
        await licenseTypesApi.deleteLicenseType(licenseType.id);
        await refreshData();
      } catch (error) {
        console.error('Failed to delete license type:', error);
      }
    }
  };

  const columnsWithActions = columns.map((col) => {
    if (col.id === 'actions') {
      return {
        ...col,
        cell: ({ row }: any) => {
          const licenseType = row.original;
          return (
            <CellAction
              data={licenseType}
              onActivate={handleActivateDeactivate}
              onDeactivate={handleActivateDeactivate}
              onDelete={handleDelete}
            />
          );
        }
      };
    }
    return col;
  });

  return (
    <LicenseTypeTable
      data={licenseTypes || []}
      totalItems={total}
      columns={columnsWithActions}
    />
  );
}
