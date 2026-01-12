import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Order } from '../types';
import type { CreateOrderPayload } from '../types/order';
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
import { useOrdersStore } from '../stores/ordersStore';
import { useProductsStore } from '../stores/productsStore';

/**
 * Renders read-only order details content.
 * Used in both View and Edit modals.
 */
function OrderDetailsContent({ order }: { order: Order }) {
  return (
    <div className="space-y-6">
      {/* Order Section */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Order
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase">ID</div>
            <p className="mt-1 text-sm font-mono text-gray-600">{order.id || '—'}</p>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase">Order Code</div>
            <p className="mt-1 text-sm font-mono text-gray-600">{order.orderCode || '—'}</p>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase">Created At</div>
            <p className="mt-1 text-sm text-gray-900">{formatDateTime(order.createdAt)}</p>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase">Updated At</div>
            <p className="mt-1 text-sm text-gray-900">{formatDateTime(order.updatedAt)}</p>
          </div>
        </div>
      </section>

      {/* Customer Section */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Customer
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase">Customer Name</div>
            <p className="mt-1 text-base text-gray-900">{order.customer?.name || '—'}</p>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase">Customer Phone</div>
            <p className="mt-1 text-base text-gray-900">{order.customer?.phone || '—'}</p>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase">Customer Email</div>
            <p className="mt-1 text-base text-gray-900">{order.customer?.email || '—'}</p>
          </div>
        </div>
      </section>

      {/* Items Section */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Items
        </h3>
        {order.items && order.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Product Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Quantity
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Unit Price
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Total Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {item.productName || '—'}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">{item.quantity || '—'}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {item.unitPrice != null
                        ? formatMoney(item.unitPrice, order.pricing?.currency || 'VND')
                        : '—'}
                    </td>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">
                      {item.totalPrice != null
                        ? formatMoney(item.totalPrice, order.pricing?.currency || 'VND')
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No items</p>
        )}
      </section>

      {/* Price Section */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Price
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase">Subtotal</div>
            <p className="mt-1 text-base text-gray-900">
              {order.pricing?.subTotal != null
                ? formatMoney(order.pricing.subTotal, order.pricing.currency || 'VND')
                : '—'}
            </p>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase">Shipping Fee</div>
            <p className="mt-1 text-base text-gray-900">
              {order.pricing?.shippingFee != null
                ? formatMoney(order.pricing.shippingFee, order.pricing.currency || 'VND')
                : '—'}
            </p>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase">Discount</div>
            <p className="mt-1 text-base text-gray-900">
              {order.pricing?.discount != null
                ? formatMoney(order.pricing.discount, order.pricing.currency || 'VND')
                : '—'}
            </p>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase">Total Amount</div>
            <p className="mt-1 text-base font-semibold text-gray-900">
              {order.pricing?.totalAmount != null
                ? formatMoney(order.pricing.totalAmount, order.pricing.currency || 'VND')
                : '—'}
            </p>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase">Currency</div>
            <p className="mt-1 text-base text-gray-900">
              {order.pricing?.currency ? order.pricing.currency : '—'}
            </p>
          </div>
        </div>
      </section>

      {/* Shipping Info Section */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Shipping Info
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase">Shipping Status</div>
            <div className="mt-1">
              {order.shipping?.status ? (
                <Badge variant="default">{order.shipping.status}</Badge>
              ) : (
                <span className="text-sm text-gray-900">—</span>
              )}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase">Payment Method</div>
            <p className="mt-1 text-sm text-gray-900">{order.paymentMethod || '—'}</p>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase">Receiver Name</div>
            <p className="mt-1 text-sm text-gray-900">
              {order.shipping?.address?.receiverName ? order.shipping.address.receiverName : '—'}
            </p>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase">Receiver Phone</div>
            <p className="mt-1 text-sm text-gray-900">
              {order.shipping?.address?.receiverPhone ? order.shipping.address.receiverPhone : '—'}
            </p>
          </div>
          <div className="sm:col-span-2">
            <div className="text-xs font-medium text-gray-500 uppercase">Full Address</div>
            <p className="mt-1 text-sm text-gray-900">
              {order.shipping?.address?.fullAddress ? order.shipping.address.fullAddress : '—'}
            </p>
          </div>
        </div>
      </section>

      {/* Status Section */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Status
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase">Order Status</div>
            <div className="mt-1">
              {order.orderStatus ? (
                (() => {
                  const statusLower = order.orderStatus.toLowerCase();
                  const variant =
                    statusLower.includes('cancelled') || statusLower.includes('failed')
                      ? 'error'
                      : 'default';
                  return <Badge variant={variant}>{order.orderStatus}</Badge>;
                })()
              ) : (
                <span className="text-sm text-gray-900">—</span>
              )}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase">Payment Status</div>
            <div className="mt-1">
              {order.paymentStatus ? (
                (() => {
                  let variant: 'success' | 'warning' | 'default' = 'default';
                  if (order.paymentStatus === 'PAID') {
                    variant = 'success';
                  } else if (order.paymentStatus === 'PENDING') {
                    variant = 'warning';
                  }
                  return <Badge variant={variant}>{order.paymentStatus}</Badge>;
                })()
              ) : (
                <span className="text-sm text-gray-900">—</span>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * Order item form schema.
 */
const orderItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price must be greater than or equal to 0'),
});

/**
 * Order form schema for validation.
 */
const orderFormSchema = z.object({
  customer: z.object({
    customerId: z.string().min(1, 'Customer ID is required'),
    name: z.string().min(1, 'Customer name is required'),
    phone: z.string().min(1, 'Phone is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
  }),
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  shippingAddress: z.object({
    receiverName: z.string().min(1, 'Receiver name is required'),
    receiverPhone: z.string().min(1, 'Receiver phone is required'),
    fullAddress: z.string().min(1, 'Full address is required'),
  }),
  paymentMethod: z.string().min(1, 'Payment method is required'),
});

type OrderFormData = z.infer<typeof orderFormSchema>;

/**
 * Renders the Orders page.
 * Displays order management interface with paginated table.
 */
export default function OrdersPage() {
  const items = useOrdersStore((state) => state.items);
  const loading = useOrdersStore((state) => state.loading);
  const error = useOrdersStore((state) => state.error);
  const fetchList = useOrdersStore((state) => state.fetchList);
  const createOne = useOrdersStore((state) => state.createOne);
  const cancelOrder = useOrdersStore((state) => state.cancelOrder);
  const deleteOne = useOrdersStore((state) => state.deleteOne);
  const products = useProductsStore((state) => state.items);
  const fetchProducts = useProductsStore((state) => state.fetchList);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewOrderId, setViewOrderId] = useState<string | null>(null);
  const [editOrderId, setEditOrderId] = useState<string | null>(null);
  const [deleteOrderCode, setDeleteOrderCode] = useState<string | null>(null);
  const [cancelOrderCode, setCancelOrderCode] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    control: controlCreate,
    watch: watchCreate,
    setValue: setValueCreate,
    formState: { errors: errorsCreate },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customer: {
        customerId: '',
        name: '',
        phone: '',
        email: '',
      },
      items: [{ productId: '', quantity: 1, unitPrice: 0 }],
      shippingAddress: {
        receiverName: '',
        receiverPhone: '',
        fullAddress: '',
      },
      paymentMethod: '',
    },
  });

  const {
    fields: createItemFields,
    append: appendCreateItem,
    remove: removeCreateItem,
  } = useFieldArray({
    control: controlCreate,
    name: 'items',
  });


  useEffect(() => {
    fetchList();
    // Ensure products list exists for product selects
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchList, fetchProducts, products.length]);


  const handleRefresh = () => {
    fetchList();
  };

  const handleView = (orderId: string) => {
    setViewOrderId(orderId);
  };

  const handleEdit = (orderId: string) => {
    setEditOrderId(orderId);
    setCancelError(null);
  };

  const handleCancelOrder = async (orderCode: string) => {
    if (!orderCode) return;
    setIsCancelling(true);
    setCancelError(null);
    try {
      await cancelOrder(orderCode);
      setEditOrderId(null);
      setCancelOrderCode(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to cancel order';
      setCancelError(errorMessage);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCreateSubmit = async (data: OrderFormData) => {
    const payload: CreateOrderPayload = {
      customer: data.customer,
      items: data.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      shippingAddress: data.shippingAddress,
      paymentMethod: data.paymentMethod,
    };
    await createOne(payload);
    resetCreate();
    setIsModalOpen(false);
  };


  const handleCreateCancel = () => {
    resetCreate();
    setIsModalOpen(false);
  };

  const handleEditCancel = () => {
    setEditOrderId(null);
    setCancelError(null);
  };

  /**
   * Gets product by ID and returns its price for unitPrice field.
   */
  const getProductPrice = (productId: string): number => {
    const product = products.find((p) => p.id === productId);
    return product?.price || 0;
  };

  const handleDelete = async (orderCode: string) => {
    if (!orderCode) return;
    await deleteOne(orderCode);
    setDeleteOrderCode(null);
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

  const columns: Column<Order>[] = [
    {
      header: 'Customer',
      render: (order) => (
        <span className="font-medium text-gray-900">{order.customer.name}</span>
      ),
    },
    {
      header: 'Phone',
      render: (order) => (
        <span className="text-gray-900">{order.customer.phone}</span>
      ),
    },
    {
      header: 'Items',
      render: (order) => {
        const count = order.items.length;
        return `${count} item${count === 1 ? '' : 's'}`;
      },
    },
    {
      header: 'Total',
      render: (order) => (
        <span className="font-medium text-gray-900">
          {formatMoney(order.pricing.totalAmount, order.pricing.currency)}
        </span>
      ),
    },
    {
      header: 'Order Status',
      render: (order) => (
        <Badge variant="default">{order.orderStatus}</Badge>
      ),
    },
    {
      header: 'Payment Status',
      render: (order) => (
        <Badge variant={order.paymentStatus === 'PAID' ? 'success' : 'default'}>
          {order.paymentStatus}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      render: (order) => (
        <div className="flex items-center gap-2">
          <IconButton
            size="sm"
            onClick={() => handleView(order.id)}
            aria-label={`View order ${order.orderCode}`}
          >
            👁️
          </IconButton>
          <IconButton
          disabled={order.orderStatus !== 'PENDING'}
            size="sm"
            onClick={() => handleEdit(order.id)}
            aria-label={`Edit order ${order.orderCode}`}
          >
            ✏️
          </IconButton>
          <IconButton
            size="sm"
            onClick={() => {
              const orderCode = order.orderCode;
              if (orderCode) {
                setDeleteOrderCode(orderCode);
              }
            }}
            disabled={order.orderStatus !== 'PENDING'}
            aria-label={`Delete order ${order.orderCode}`}
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
          Orders
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={handleRefresh}>
            Refresh
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>Create Order</Button>
        </div>
      </div>
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      {loading && items.length === 0 ? (
        <div className="mt-6 text-center text-gray-500">Loading orders...</div>
      ) : (
        <DataTable
          columns={columns}
          data={paginatedItems}
          getRowId={(order) => order.id}
          emptyMessage="No orders found"
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
        title="Create Order"
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
        <form onSubmit={handleSubmitCreate(handleCreateSubmit)} className="space-y-6">
          {/* Customer Section */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Customer
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Customer ID"
                  {...registerCreate('customer.customerId')}
                  error={errorsCreate.customer?.customerId?.message}
                  placeholder="Enter customer ID"
                />
                <Input
                  label="Customer Name"
                  {...registerCreate('customer.name')}
                  error={errorsCreate.customer?.name?.message}
                  placeholder="Enter customer name"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone"
                  type="tel"
                  {...registerCreate('customer.phone')}
                  error={errorsCreate.customer?.phone?.message}
                  placeholder="Enter phone number"
                />
                <Input
                  label="Email"
                  type="email"
                  {...registerCreate('customer.email')}
                  error={errorsCreate.customer?.email?.message}
                  placeholder="Enter email address"
                />
              </div>
            </div>
          </section>

          {/* Items Section */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Items
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendCreateItem({ productId: '', quantity: 1, unitPrice: 0 })}
              >
                + Add Item
              </Button>
            </div>
            {errorsCreate.items && (
              <p className="text-sm text-red-600 mb-2">{errorsCreate.items.message}</p>
            )}
            <div className="space-y-4">
              {createItemFields.map((field, index) => {
                const watchedProductId = watchCreate(`items.${index}.productId`);
                const product = products.find((p) => p.id === watchedProductId);
                const unitPrice = getProductPrice(watchedProductId);

                return (
                  <div key={field.id} className="border border-gray-200 rounded-md p-4">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
                      {createItemFields.length > 1 && (
                        <IconButton
                          type="button"
                          size="sm"
                          onClick={() => removeCreateItem(index)}
                          aria-label={`Remove item ${index + 1}`}
                        >
                          🗑️
                        </IconButton>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Select
                          label="Product"
                          {...registerCreate(`items.${index}.productId`, {
                            onChange: (e) => {
                              const productId = e.target.value;
                              if (productId) {
                                const price = getProductPrice(productId);
                                setValueCreate(`items.${index}.unitPrice`, price);
                              }
                            },
                          })}
                          options={[
                            { value: '', label: 'Select a product', disabled: true },
                            ...products.map((p) => ({ value: p.id, label: p.name })),
                          ]}
                          error={errorsCreate.items?.[index]?.productId?.message}
                        />
                        {watchedProductId && product && (
                          <p className="mt-1 text-xs text-gray-500">
                            {product.name} - {formatMoney(product.price, product.currency)}
                          </p>
                        )}
                      </div>
                      <div>
                        <Input
                          label="Quantity"
                          type="number"
                          {...registerCreate(`items.${index}.quantity`, { valueAsNumber: true })}
                          error={errorsCreate.items?.[index]?.quantity?.message}
                          placeholder="1"
                          min="1"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                        <Input
                          label="Unit Price"
                          type="number"
                          step="0.01"
                          {...registerCreate(`items.${index}.unitPrice`, { valueAsNumber: true })}
                          error={errorsCreate.items?.[index]?.unitPrice?.message}
                          placeholder="0"
                          min="0"
                        />
                      {watchedProductId && unitPrice > 0 && (
                        <p className="mt-1 text-xs text-gray-500">
                          Suggested: {formatMoney(unitPrice, 'VND')}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Shipping Address Section */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Shipping Address
            </h3>
            <div className="space-y-4">
              <Input
                label="Receiver Name"
                {...registerCreate('shippingAddress.receiverName')}
                error={errorsCreate.shippingAddress?.receiverName?.message}
                placeholder="Enter receiver name"
              />
              <Input
                label="Receiver Phone"
                type="tel"
                {...registerCreate('shippingAddress.receiverPhone')}
                error={errorsCreate.shippingAddress?.receiverPhone?.message}
                placeholder="Enter receiver phone"
              />
              <div>
                <label htmlFor="create-fullAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Address
                </label>
                <textarea
                  id="create-fullAddress"
                  {...registerCreate('shippingAddress.fullAddress')}
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 focus:ring-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter full address"
                />
                {errorsCreate.shippingAddress?.fullAddress && (
                  <p className="mt-1 text-sm text-red-600">
                    {errorsCreate.shippingAddress.fullAddress.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Payment Section */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Payment
            </h3>
            <Select
              label="Payment Method"
              {...registerCreate('paymentMethod')}
              options={[
                { value: '', label: 'Select payment method', disabled: true },
                { value: 'CASH', label: 'Cash' },
                { value: 'CARD', label: 'Card' },
                { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
                { value: 'E_WALLET', label: 'E-Wallet' },
              ]}
              error={errorsCreate.paymentMethod?.message}
            />
          </section>
        </form>
      </Modal>
      <Modal
        open={viewOrderId !== null}
        title={
          viewOrderId
            ? `View Order: ${items.find((o) => o.id === viewOrderId)?.orderCode || ''}`
            : 'View Order'
        }
        onClose={() => setViewOrderId(null)}
        footer={
          <Button onClick={() => setViewOrderId(null)}>Close</Button>
        }
      >
        {viewOrderId && (() => {
          const order = items.find((o) => o.id === viewOrderId);
          if (!order) {
            return (
              <div className="py-4">
                <p className="text-gray-600">Order not found.</p>
              </div>
            );
          }
          return <OrderDetailsContent order={order} />;
        })()}
      </Modal>
      <Modal
        open={editOrderId !== null}
        title={
          editOrderId
            ? `Edit Order: ${items.find((o) => o.id === editOrderId)?.orderCode || ''}`
            : 'Edit Order'
        }
        onClose={handleEditCancel}
        footer={
          <>
            <Button variant="secondary" onClick={handleEditCancel}>
              Close
            </Button>
            {editOrderId && (() => {
              const order = items.find((o) => o.id === editOrderId);
              if (!order) return null;
              const isCancellable =
                order.orderCode &&
                order.orderStatus?.toLowerCase() === 'pending';
              return (
                <Button
                  variant="outline"
                  onClick={() => order.orderCode && setCancelOrderCode(order.orderCode)}
                  disabled={!isCancellable || isCancelling || !order.orderCode}
                >
                  {isCancelling ? 'Cancelling…' : 'Cancel Order'}
                </Button>
              );
            })()}
          </>
        }
      >
        {cancelError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{cancelError}</p>
          </div>
        )}
        {editOrderId && (() => {
          const order = items.find((o) => o.id === editOrderId);
          if (!order) {
            return (
              <div className="py-4">
                <p className="text-gray-600">Order not found.</p>
              </div>
            );
          }
          return <OrderDetailsContent order={order} />;
        })()}
      </Modal>
      <ConfirmDialog
        open={deleteOrderCode !== null}
        title="Delete Order"
        message={`Are you sure you want to delete order ${deleteOrderCode || ''}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={() => deleteOrderCode && handleDelete(deleteOrderCode)}
        onCancel={() => setDeleteOrderCode(null)}
        variant="danger"
      />
      <ConfirmDialog
        open={cancelOrderCode !== null}
        title="Cancel Order"
        message={`Are you sure you want to cancel order ${cancelOrderCode || ''}? This action cannot be undone.`}
        confirmLabel="Cancel Order"
        cancelLabel="Keep Order"
        onConfirm={() => cancelOrderCode && handleCancelOrder(cancelOrderCode)}
        onCancel={() => setCancelOrderCode(null)}
        variant="danger"
      />
    </div>
  );
}

