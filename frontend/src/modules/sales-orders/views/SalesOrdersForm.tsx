import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeftOutlined,
  PlusOutlined,
  DeleteOutlined,
 
} from '@ant-design/icons';
import { createSalesOrder, updateSalesOrder } from '../api/create-sales-order';
import { getSalesOrderById } from '../api/get-sales-orders';
import type { SalesOrderFormData, SalesOrderType } from '../types';

const orderTypeLabels = {
  sale: 'Bán hàng',
  purchase: 'Mua hàng',
  return: 'Trả hàng',
  exchange: 'Đổi hàng',
};

const paymentMethods = [
  'Tiền mặt',
  'Chuyển khoản',
  'Thẻ tín dụng',
  'Thẻ ghi nợ',
  'Ví điện tử',
  'COD',
];

const currencies = [
  { value: 'VND', label: 'VND - Việt Nam Đồng' },
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
];

export function SalesOrdersForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<SalesOrderFormData>({
    customerId: '',
    orderType: 'sale',
    paymentMethod: 'Tiền mặt',
    currency: 'VND',
    items: [],
    shippingFee: 0,
    discountAmount: 0,
    discountPercent: 0,
    taxEnabled: true,
    taxPercent: 10,
    notes: '',
    shippingAddress: '',
    billingAddress: '',
    expectedDeliveryDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing && id) {
      loadOrder();
    }
  }, [id, isEditing]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await getSalesOrderById(id!);
      const order = response.data.data;
      
      setFormData({
        customerId: order.customerId,
        orderType: order.orderType,
        paymentMethod: order.paymentMethod,
        currency: order.currency,
        items: order.items.map(item => ({
          productId: item.productId,
          qty: item.qty,
          unitPrice: item.unitPrice,
          discountPercent: item.discountPercent,
          taxPercent: item.taxPercent,
          note: item.note || '',
        })),
        shippingFee: order.shippingFee,
        discountAmount: order.discountAmount,
        discountPercent: order.discountPercent,
        taxEnabled: order.taxEnabled,
        taxPercent: order.taxPercent,
        notes: order.notes || '',
        shippingAddress: order.shippingAddress || '',
        billingAddress: order.billingAddress || '',
        expectedDeliveryDate: order.expectedDeliveryDate ? order.expectedDeliveryDate.split('T')[0] : '',
      });
    } catch (error) {
      console.error('Error loading sales order:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        productId: '',
        qty: 1,
        unitPrice: 0,
        discountPercent: 0,
        taxPercent: 10,
        note: '',
      }],
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateItem = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => 
      sum + (item.qty * item.unitPrice), 0
    );
    
    const discountAmount = (subtotal * formData.discountPercent / 100) + formData.discountAmount;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = formData.taxEnabled ? (taxableAmount * formData.taxPercent / 100) : 0;
    const total = taxableAmount + taxAmount + formData.shippingFee;
    
    return { subtotal, taxAmount, total };
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.customerId) {
      newErrors.customerId = 'Vui lòng chọn khách hàng';
    }
    
    if (formData.items.length === 0) {
      newErrors.items = 'Vui lòng thêm ít nhất một sản phẩm';
    }
    
    formData.items.forEach((item, index) => {
      if (!item.productId) {
        newErrors[`item_${index}_productId`] = 'Vui lòng chọn sản phẩm';
      }
      if (item.qty <= 0) {
        newErrors[`item_${index}_qty`] = 'Số lượng phải lớn hơn 0';
      }
      if (item.unitPrice <= 0) {
        newErrors[`item_${index}_unitPrice`] = 'Đơn giá phải lớn hơn 0';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      
      const submitData = {
        ...formData,
        expectedDeliveryDate: formData.expectedDeliveryDate || undefined,
      };
      
      if (isEditing) {
        await updateSalesOrder(id!, submitData);
      } else {
        await createSalesOrder(submitData);
      }
      
      navigate('/sales-orders');
    } catch (error) {
      console.error('Error saving sales order:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const { subtotal, taxAmount, total } = calculateTotals();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
              {isEditing ? 'Chỉnh sửa đơn hàng' : 'Tạo đơn hàng mới'}
            </h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Thông tin cơ bản</h3>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Khách hàng *
                    </label>
                    <select
                      value={formData.customerId}
                      onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Chọn khách hàng</option>
                      {/* TODO: Load customers from API */}
                      <option value="1">Khách hàng mẫu 1</option>
                      <option value="2">Khách hàng mẫu 2</option>
                    </select>
                    {errors.customerId && (
                      <p className="mt-1 text-sm text-red-600">{errors.customerId}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Loại đơn hàng *
                    </label>
                    <select
                      value={formData.orderType}
                      onChange={(e) => setFormData(prev => ({ ...prev, orderType: e.target.value as SalesOrderType }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      {Object.entries(orderTypeLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phương thức thanh toán *
                    </label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      {paymentMethods.map(method => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Đơn vị tiền tệ *
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      {currencies.map(currency => (
                        <option key={currency.value} value={currency.value}>{currency.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày giao hàng dự kiến
                  </label>
                  <input
                    type="date"
                    value={formData.expectedDeliveryDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, expectedDeliveryDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Sản phẩm</h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PlusOutlined className="-ml-0.5 mr-2 h-4 w-4" />
                    Thêm sản phẩm
                  </button>
                </div>
              </div>
              
              <div className="px-6 py-4">
                {errors.items && (
                  <p className="mb-4 text-sm text-red-600">{errors.items}</p>
                )}
                
                {formData.items.length > 0 ? (
                  <div className="space-y-4">
                    {formData.items.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-medium text-gray-900">
                            Sản phẩm {index + 1}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <DeleteOutlined className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Sản phẩm *
                            </label>
                            <select
                              value={item.productId}
                              onChange={(e) => updateItem(index, 'productId', e.target.value)}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Chọn sản phẩm</option>
                              {/* TODO: Load products from API */}
                              <option value="1">Sản phẩm mẫu 1</option>
                              <option value="2">Sản phẩm mẫu 2</option>
                            </select>
                            {errors[`item_${index}_productId`] && (
                              <p className="mt-1 text-sm text-red-600">{errors[`item_${index}_productId`]}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Số lượng *
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.qty}
                              onChange={(e) => updateItem(index, 'qty', parseFloat(e.target.value) || 0)}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors[`item_${index}_qty`] && (
                              <p className="mt-1 text-sm text-red-600">{errors[`item_${index}_qty`]}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Đơn giá *
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors[`item_${index}_unitPrice`] && (
                              <p className="mt-1 text-sm text-red-600">{errors[`item_${index}_unitPrice`]}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Ghi chú
                            </label>
                            <input
                              type="text"
                              value={item.note}
                              onChange={(e) => updateItem(index, 'note', e.target.value)}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Ghi chú sản phẩm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Chưa có sản phẩm nào</p>
                    <button
                      type="button"
                      onClick={addItem}
                      className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Thêm sản phẩm đầu tiên
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Thông tin bổ sung</h3>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ giao hàng
                    </label>
                    <textarea
                      value={formData.shippingAddress}
                      onChange={(e) => setFormData(prev => ({ ...prev, shippingAddress: e.target.value }))}
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Địa chỉ giao hàng"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ thanh toán
                    </label>
                    <textarea
                      value={formData.billingAddress}
                      onChange={(e) => setFormData(prev => ({ ...prev, billingAddress: e.target.value }))}
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Địa chỉ thanh toán"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ghi chú đơn hàng"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Tính toán</h3>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phí vận chuyển
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.shippingFee}
                    onChange={(e) => setFormData(prev => ({ ...prev, shippingFee: parseFloat(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giảm giá (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.discountPercent}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountPercent: parseFloat(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giảm giá (VNĐ)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discountAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountAmount: parseFloat(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="taxEnabled"
                    checked={formData.taxEnabled}
                    onChange={(e) => setFormData(prev => ({ ...prev, taxEnabled: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="taxEnabled" className="ml-2 block text-sm text-gray-900">
                    Tính thuế
                  </label>
                </div>

                {formData.taxEnabled && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thuế (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={formData.taxPercent}
                      onChange={(e) => setFormData(prev => ({ ...prev, taxPercent: parseFloat(e.target.value) || 0 }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Totals */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Tổng kết</h3>
              </div>
              <div className="px-6 py-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tạm tính:</span>
                  <span>{subtotal.toLocaleString('vi-VN')} {formData.currency}</span>
                </div>
                {formData.shippingFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Phí vận chuyển:</span>
                    <span>{formData.shippingFee.toLocaleString('vi-VN')} {formData.currency}</span>
                  </div>
                )}
                {(formData.discountAmount > 0 || formData.discountPercent > 0) && (
                  <div className="flex justify-between text-sm">
                    <span>Giảm giá:</span>
                    <span className="text-red-600">
                      -{((subtotal * formData.discountPercent / 100) + formData.discountAmount).toLocaleString('vi-VN')} {formData.currency}
                    </span>
                  </div>
                )}
                {formData.taxEnabled && taxAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Thuế:</span>
                    <span>{taxAmount.toLocaleString('vi-VN')} {formData.currency}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Tổng cộng:</span>
                  <span>{total.toLocaleString('vi-VN')} {formData.currency}</span>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4">
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {submitting ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Tạo đơn hàng')}
                  </button>
                  <Link
                    to="/sales-orders"
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-medium text-center hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Hủy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
