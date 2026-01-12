import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Product } from '../types';
import type { CreateProductPayload, UpdateProductPayload } from '../types/product';
import { formatMoney, formatDateTime } from '../utils/format';
import { usePagination } from '../hooks';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { IconButton } from '../components/ui/IconButton';
import { DataTable } from '../components/common/DataTable';
import type { Column } from '../components/common/DataTable';
import { PaginationControls } from '../components/common/PaginationControls';
import { useProductsStore } from '../stores/productsStore';

/**
 * Product form schema for validation.
 */
const productFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string(),
  price: z.number().min(0, 'Price must be greater than or equal to 0'),
  currency: z.enum(['VND']),
  stock: z.number().int().min(0, 'Stock must be greater than or equal to 0'),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

type ProductFormData = z.infer<typeof productFormSchema>;

/**
 * Renders the Products page.
 * Displays product management interface with paginated table.
 */
export default function ProductsPage() {
  const items = useProductsStore((state) => state.items);
  const loading = useProductsStore((state) => state.loading);
  const error = useProductsStore((state) => state.error);
  const fetchList = useProductsStore((state) => state.fetchList);
  const createOne = useProductsStore((state) => state.createOne);
  const updateOne = useProductsStore((state) => state.updateOne);
  const deleteOne = useProductsStore((state) => state.deleteOne);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewProductId, setViewProductId] = useState<string | null>(null);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: errorsCreate },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      currency: 'VND',
      stock: 0,
      status: 'ACTIVE',
    },
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
  });

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleRefresh = () => {
    fetchList();
  };

  const handleView = (productId: string) => {
    setViewProductId(productId);
  };

  const handleEdit = (productId: string) => {
    const product = items.find((p) => p.id === productId);
    if (product) {
      resetEdit({
        name: product.name,
        description: product.description,
        price: product.price,
        currency: product.currency,
        stock: product.stock,
        status: product.status,
      });
      setEditProductId(productId);
    }
  };

  const handleCreateSubmit = async (data: ProductFormData) => {
    const payload: CreateProductPayload = {
      name: data.name,
      description: data.description,
      price: data.price,
      currency: data.currency,
      stock: data.stock,
      status: data.status,
    };
    await createOne(payload);
    resetCreate();
    setIsModalOpen(false);
  };

  const handleEditSubmit = async (data: ProductFormData) => {
    if (!editProductId) return;
    const payload: UpdateProductPayload = {
      name: data.name,
      description: data.description,
      price: data.price,
      currency: data.currency,
      stock: data.stock,
      status: data.status,
    };
    await updateOne(editProductId, payload);
    resetEdit();
    setEditProductId(null);
  };

  const handleCreateCancel = () => {
    resetCreate();
    setIsModalOpen(false);
  };

  const handleEditCancel = () => {
    resetEdit();
    setEditProductId(null);
  };

  const handleDelete = async (productId: string) => {
    await deleteOne(productId);
    setDeleteProductId(null);
  };

  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    canGoNext,
    canGoPrevious,
  } = usePagination(items, 10);

  const columns: Column<Product>[] = [
    {
      header: 'Name',
      render: (product) => (
        <span className="font-medium text-gray-900">{product.name}</span>
      ),
    },
    {
      header: 'Price',
      render: (product) => (
        <span className="font-medium text-gray-900">
          {formatMoney(product.price, product.currency)}
        </span>
      ),
    },
    {
      header: 'Stock',
      render: (product) => product.stock,
    },
    {
      header: 'Status',
      render: (product) => (
        <Badge variant={product.status === 'ACTIVE' ? 'success' : 'default'}>
          {product.status}
        </Badge>
      ),
    },
    {
      header: 'Updated',
      render: (product) => (
        <span className="text-gray-500">{formatDateTime(product.updated_at)}</span>
      ),
    },
    {
      header: 'Actions',
      render: (product) => (
        <div className="flex items-center gap-2">
          <IconButton
            size="sm"
            onClick={() => handleView(product.id)}
            aria-label={`View product ${product.name}`}
          >
            👁️
          </IconButton>
          <IconButton
            size="sm"
            onClick={() => handleEdit(product.id)}
            aria-label={`Edit product ${product.name}`}
          >
            ✏️
          </IconButton>
          <IconButton
            size="sm"
            onClick={() => setDeleteProductId(product.id)}
            aria-label={`Delete product ${product.name}`}
          >
            🗑️
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-700">
          Products
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={handleRefresh}>
            Refresh
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>Create Product</Button>
        </div>
      </div>
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      {loading && items.length === 0 ? (
        <div className="mt-6 text-center text-gray-500">Loading products...</div>
      ) : (
        <DataTable
          columns={columns}
          data={paginatedItems}
          getRowId={(product) => product.id}
          emptyMessage="No products found"
        />
      )}
      <PaginationControls
        pagination={{
          currentPage,
          totalPages,
          paginatedItems,
          goToPage,
          goToNextPage,
          goToPreviousPage,
          canGoNext,
          canGoPrevious,
        }}
      />
      <Modal
        open={isModalOpen}
        title="Create Product"
        onClose={handleCreateCancel}
        footer={
          <>
            <Button variant="secondary" onClick={handleCreateCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmitCreate(handleCreateSubmit)}>Save</Button>
          </>
        }
      >
        <form onSubmit={handleSubmitCreate(handleCreateSubmit)} className="space-y-4">
          <Input
            label="Name"
            {...registerCreate('name')}
            error={errorsCreate.name?.message}
            placeholder="Enter product name"
          />
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              {...registerCreate('description')}
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 focus:ring-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter product description"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Price"
              type="number"
              step="0.01"
              {...registerCreate('price', { valueAsNumber: true })}
              error={errorsCreate.price?.message}
              placeholder="0"
            />
            <Input
              label="Stock"
              type="number"
              {...registerCreate('stock', { valueAsNumber: true })}
              error={errorsCreate.stock?.message}
              placeholder="0"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Currency"
              {...registerCreate('currency')}
              options={[{ value: 'VND', label: 'VND' }]}
              error={errorsCreate.currency?.message}
            />
            <Select
              label="Status"
              {...registerCreate('status')}
              options={[
                { value: 'ACTIVE', label: 'ACTIVE' },
                { value: 'INACTIVE', label: 'INACTIVE' },
              ]}
              error={errorsCreate.status?.message}
            />
          </div>
        </form>
      </Modal>
      <Modal
        open={viewProductId !== null}
        title={
          viewProductId
            ? `View Product: ${items.find((p) => p.id === viewProductId)?.name || ''}`
            : 'View Product'
        }
        onClose={() => setViewProductId(null)}
        footer={
          <Button onClick={() => setViewProductId(null)}>Close</Button>
        }
      >
        {viewProductId && (() => {
          const product = items.find((p) => p.id === viewProductId);
          if (!product) {
            return (
              <div className="py-4">
                <p className="text-gray-600">Product not found.</p>
              </div>
            );
          }

          return (
            <div className="space-y-6">
              {/* Basic Information Section */}
              <section>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Basic Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase">Name</div>
                    <p className="mt-1 text-base text-gray-900">{product.name}</p>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase">Description</div>
                    <p className="mt-1 text-base text-gray-900 whitespace-pre-wrap">
                      {product.description || <span className="text-gray-400 italic">No description</span>}
                    </p>
                  </div>
                </div>
              </section>

              {/* Pricing & Inventory Section */}
              <section>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Pricing & Inventory
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase">Price</div>
                    <p className="mt-1 text-base font-medium text-gray-900">
                      {formatMoney(product.price, product.currency)}
                    </p>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase">Stock</div>
                    <p className="mt-1 text-base text-gray-900">{product.stock}</p>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase">Status</div>
                    <div className="mt-1">
                      <Badge variant={product.status === 'ACTIVE' ? 'success' : 'default'}>
                        {product.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase">Currency</div>
                    <p className="mt-1 text-base text-gray-900">{product.currency}</p>
                  </div>
                </div>
              </section>

              {/* Metadata Section */}
              <section>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Metadata
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase">Product ID</div>
                    <p className="mt-1 text-sm font-mono text-gray-600">{product.id}</p>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase">Created</div>
                    <p className="mt-1 text-base text-gray-900">{formatDateTime(product.created_at)}</p>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase">Last Updated</div>
                    <p className="mt-1 text-base text-gray-900">{formatDateTime(product.updated_at)}</p>
                  </div>
                </div>
              </section>
            </div>
          );
        })()}
      </Modal>
      <Modal
        open={editProductId !== null}
        title={
          editProductId
            ? `Edit Product: ${items.find((p) => p.id === editProductId)?.name || ''}`
            : 'Edit Product'
        }
        onClose={handleEditCancel}
        footer={
          <>
            <Button variant="secondary" onClick={handleEditCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmitEdit(handleEditSubmit)}>Save</Button>
          </>
        }
      >
        <form onSubmit={handleSubmitEdit(handleEditSubmit)} className="space-y-4">
          <Input
            label="Name"
            {...registerEdit('name')}
            error={errorsEdit.name?.message}
            placeholder="Enter product name"
          />
          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="edit-description"
              {...registerEdit('description')}
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 focus:ring-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter product description"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Price"
              type="number"
              step="0.01"
              {...registerEdit('price', { valueAsNumber: true })}
              error={errorsEdit.price?.message}
              placeholder="0"
            />
            <Input
              label="Stock"
              type="number"
              {...registerEdit('stock', { valueAsNumber: true })}
              error={errorsEdit.stock?.message}
              placeholder="0"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Currency"
              {...registerEdit('currency')}
              options={[{ value: 'VND', label: 'VND' }]}
              error={errorsEdit.currency?.message}
            />
            <Select
              label="Status"
              {...registerEdit('status')}
              options={[
                { value: 'ACTIVE', label: 'ACTIVE' },
                { value: 'INACTIVE', label: 'INACTIVE' },
              ]}
              error={errorsEdit.status?.message}
            />
          </div>
        </form>
      </Modal>
      <ConfirmDialog
        open={deleteProductId !== null}
        title="Delete Product"
        message={`Are you sure you want to delete product "${items.find((p) => p.id === deleteProductId)?.name || ''}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={() => deleteProductId && handleDelete(deleteProductId)}
        onCancel={() => setDeleteProductId(null)}
        variant="danger"
      />
    </div>
  );
}

