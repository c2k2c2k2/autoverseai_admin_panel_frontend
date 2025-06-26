'use client';

import { useState, useEffect } from 'react';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { variantsApi } from '@/features/variants/api/variants';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Package, Plus, Minus } from 'lucide-react';
import { Variant } from '@/types/variant';

interface StockManagementPageProps {
  params: Promise<{
    variantId: string;
  }>;
}

export default function StockManagementPage({
  params
}: StockManagementPageProps) {
  const [variant, setVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchVariant = async () => {
      try {
        const { variantId } = await params;
        const data = await variantsApi.getVariant(variantId);
        setVariant(data);
        setQuantity(data.stockQuantity);
      } catch (error) {
        notFound();
      }
    };

    fetchVariant();
  }, []);

  const handleUpdateStock = async () => {
    if (!variant) return;

    setIsLoading(true);
    try {
      const updatedVariant = await variantsApi.updateStock(variant.id, {
        stockQuantity: quantity
      });
      setVariant(updatedVariant);
    } catch (error) {
      console.error('Failed to update stock:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(0, prev - 1));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setQuantity(Math.max(0, value));
  };

  if (!variant) {
    return null;
  }

  return (
    <div className='flex-1 space-y-4 p-4 pt-6'>
      <div className='flex items-center justify-between'>
        <Heading
          title='Stock Management'
          description={`Update stock for ${variant.name}`}
        />
      </div>
      <Separator />

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Current Stock</CardTitle>
            <Package className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{variant.stockQuantity}</div>
            <p className='text-muted-foreground text-xs'>
              {variant.inStock ? 'In Stock' : 'Out of Stock'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-end gap-4'>
            <div className='flex-1 space-y-2'>
              <label
                htmlFor='quantity'
                className='text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                New Stock Quantity
              </label>
              <div className='flex items-center gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  className='h-8 w-8'
                  onClick={handleDecrement}
                  disabled={isLoading}
                >
                  <Minus className='h-4 w-4' />
                </Button>
                <Input
                  type='number'
                  id='quantity'
                  value={quantity}
                  onChange={handleQuantityChange}
                  min={0}
                  className='h-8'
                  disabled={isLoading}
                />
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  className='h-8 w-8'
                  onClick={handleIncrement}
                  disabled={isLoading}
                >
                  <Plus className='h-4 w-4' />
                </Button>
              </div>
            </div>
            <Button
              onClick={handleUpdateStock}
              disabled={isLoading || quantity === variant.stockQuantity}
            >
              {isLoading ? 'Updating...' : 'Update Stock'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
