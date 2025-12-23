import { useState, useEffect } from 'react';
import { useParams, Link} from 'react-router-dom';
import { 
  ArrowLeftOutlined,
  EditOutlined,
  ClockCircleOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { TeamOutlined } from '@ant-design/icons';
import { getSalesOrderById } from '../api/get-sales-orders';
import { updateSalesOrderStatus } from '../api/create-sales-order';
import type { SalesOrder, SalesOrderStatus } from '../types';

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-yellow-100 text-yellow-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-emerald-100 text-emerald-800',
};

const paymentStatusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  partial: 'bg-blue-100 text-blue-800',
  refunded: 'bg-red-100 text-red-800',
};

const statusLabels = {
  draft: 'Nháp',
  confirmed: 'Đã xác nhận',
  processing: 'Đang xử lý',
  shipped: 'Đã giao hàng',
  delivered: 'Đã nhận hàng',
  cancelled: 'Đã hủy',
  completed: 'Hoàn thành',
};

const paymentStatusLabels = {
  pending: 'Chưa thanh toán',
  paid: 'Đã thanh toán',
  partial: 'Thanh toán một phần',
  refunded: 'Đã hoàn tiền',
};

const orderTypeLabels = {
  sale: 'Bán hàng',
  purchase: 'Mua hàng',
  return: 'Trả hàng',
  exchange: 'Đổi hàng',
};

const formatCurrency = (amount: number, currency = 'VND') => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function SalesOrdersDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<SalesOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<SalesOrderStatus>('draft');
  const [statusReason, setStatusReason] = useState('');

  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await getSalesOrderById(id!);
      setOrder(response.data.data);
    } catch (error) {
      console.error('Error loading sales order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!order) return;
    
    try {
      setUpdatingStatus(true);
      await updateSalesOrderStatus(order.id, {
        status: selectedStatus,
        reason: statusReason,
      });
      
      await loadOrder();
      setShowStatusModal(false);
      setStatusReason('');
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Không tìm thấy đơn hàng</div>
        <Link
          to="/sales-orders"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <ArrowLeftOutlined className="-ml-1 mr-2 h-5 w-5" />
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const availableStatuses = ['draft', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'completed'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/sales-orders"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftOutlined className="h-5 w-5 mr-1" />
            Quay lại
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Đơn hàng #{order.orderNumber}
            </h1>
            <p className="text-sm text-gray-600">
              Tạo ngày {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to={`/sales-orders/${order.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <EditOutlined className="-ml-1 mr-2 h-5 w-5" />
            Chỉnh sửa
          </Link>
        </div>
      </div>

      {/* Order Status and Info */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Trạng thái đơn hàng</h3>
                <div className="mt-2 flex items-center space-x-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                    {statusLabels[order.status as keyof typeof statusLabels]}
                  </span>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${paymentStatusColors[order.paymentStatus]}`}>
                    {paymentStatusLabels[order.paymentStatus as keyof typeof paymentStatusLabels]}
                  </span>
                  <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {orderTypeLabels[order.orderType]}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowStatusModal(true)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ClockCircleOutlined className="-ml-1 mr-2 h-5 w-5" />
              Cập nhật trạng thái
            </button>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Info */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Thông tin khách hàng</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <TeamOutlined className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900">
                    {order.customerName || `Khách hàng #${order.customerId}`}
                  </span>
                </div>
                {order.customerEmail && (
                  <div className="text-sm text-gray-600">
                    {order.customerEmail}
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Tổng kết đơn hàng</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <DollarOutlined className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900">
                    Tổng tiền: {formatCurrency(order.totalAmount, order.currency)}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Phương thức thanh toán: {order.paymentMethod}
                </div>
                {order.expectedDeliveryDate && (
                  <div className="text-sm text-gray-600">
                    Ngày giao hàng dự kiến: {formatDate(order.expectedDeliveryDate)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Sản phẩm trong đơn hàng</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số lượng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đơn giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng cộng
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.productName || `Sản phẩm #${item.productId}`}
                    </div>
                    {item.note && (
                      <div className="text-sm text-gray-500">
                        {item.note}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.qty}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(item.unitPrice, order.currency)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(item.totalPrice, order.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Totals */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tạm tính:</span>
                <span>{formatCurrency(order.subtotal, order.currency)}</span>
              </div>
              {order.shippingFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Phí vận chuyển:</span>
                  <span>{formatCurrency(order.shippingFee, order.currency)}</span>
                </div>
              )}
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Giảm giá:</span>
                  <span className="text-red-600">-{formatCurrency(order.discountAmount, order.currency)}</span>
                </div>
              )}
              {order.taxEnabled && order.taxAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Thuế ({order.taxPercent}%):</span>
                  <span>{formatCurrency(order.taxAmount, order.currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-semibold border-t pt-2">
                <span>Tổng cộng:</span>
                <span>{formatCurrency(order.totalAmount, order.currency)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Ghi chú</h3>
          </div>
          <div className="px-6 py-4">
            <p className="text-sm text-gray-900">{order.notes}</p>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Cập nhật trạng thái đơn hàng</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái mới
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as SalesOrderStatus)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  {availableStatuses.map(status => (
                    <option key={status} value={status}>
                      {statusLabels[status as keyof typeof statusLabels]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do thay đổi (tùy chọn)
                </label>
                <textarea
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Nhập lý do thay đổi trạng thái..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  Hủy
                </button>
                <button
                  onClick={handleStatusUpdate}
                  disabled={updatingStatus}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {updatingStatus ? 'Đang cập nhật...' : 'Cập nhật'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
