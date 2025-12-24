import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Statistic,
  Row,
  Col,
  Input,
  Modal,
  Form,
  Select,
  DatePicker,
  Tooltip,
  Popconfirm,
  message,
  Progress
} from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

import type { PurchaseOrderEntity, PurchaseOrderItem } from '../types';
import {
  listPurchaseOrders,
  listSuppliers,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
  getPurchasingStats
} from '../fake/purchasing.store';
import { PURCHASE_ORDER_STATUSES } from '../types';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const PurchaseOrdersList: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<PurchaseOrderEntity[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    supplierId: '',
    search: '',
    dateRange: null as any
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrderEntity | null>(null);
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const ordersData = listPurchaseOrders();
      const suppliersData = listSuppliers();
      const statsData = getPurchasingStats();
      setOrders(ordersData);
      setSuppliers(suppliersData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading purchase orders:', error);
      message.error('Lỗi khi tải dữ liệu đơn mua hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredOrders = orders.filter(order => {
    if (filters.status && order.status !== filters.status) return false;
    if (filters.supplierId && order.supplierId !== filters.supplierId) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        order.orderNo.toLowerCase().includes(searchLower) ||
        order.supplierName.toLowerCase().includes(searchLower) ||
        order.notes.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const handleCreate = () => {
    setEditingOrder(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleViewDetail = (order: PurchaseOrderEntity) => {
    navigate(`/purchasing/orders/${order.id}`);
  };

  const handleEdit = (order: PurchaseOrderEntity) => {
    setEditingOrder(order);
    form.setFieldsValue(order);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const success = deletePurchaseOrder(id);
      if (success) {
        message.success('Xóa đơn mua hàng thành công');
        loadData();
      } else {
        message.error('Không thể xóa đơn mua hàng');
      }
    } catch (error) {
      message.error('Lỗi khi xóa đơn mua hàng');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingOrder) {
        const updated = updatePurchaseOrder(editingOrder.id, values);
        if (updated) {
          message.success('Cập nhật đơn mua hàng thành công');
        } else {
          message.error('Không thể cập nhật đơn mua hàng');
        }
      } else {
        createPurchaseOrder(values);
        message.success('Tạo đơn mua hàng thành công');
      }
      setIsModalVisible(false);
      loadData();
    } catch (error) {
      message.error('Lỗi khi lưu đơn mua hàng');
    }
  };

  const getStatusColor = (status: string) => {
    const statusConfig = PURCHASE_ORDER_STATUSES.find(s => s.key === status);
    return statusConfig?.color || 'default';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <ClockCircleOutlined />;
      case 'APPROVED':
        return <CheckCircleOutlined />;
      case 'RECEIVED':
        return <CheckCircleOutlined />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const getCompletionRate = (order: PurchaseOrderEntity) => {
    const totalItems = order.items.length;
    const completedItems = order.items.filter(item => item.status === 'COMPLETED').length;
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const columns: ColumnsType<PurchaseOrderEntity> = [
    {
      title: 'Mã đơn mua',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 120,
      render: (text: string) => <strong>{text}</strong>
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'supplierName',
      key: 'supplierName',
      ellipsis: true,
      render: (text: string, record: PurchaseOrderEntity) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">{record.supplierCode}</div>
        </div>
      )
    },
    {
      title: 'Ngày đặt hàng',
      dataIndex: 'orderDate',
      key: 'orderDate',
      width: 100,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN')
    },
    {
      title: 'Ngày dự kiến',
      dataIndex: 'expectedDate',
      key: 'expectedDate',
      width: 100,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN')
    },
    {
      title: 'Tiến độ',
      key: 'progress',
      width: 120,
      render: (_, record: PurchaseOrderEntity) => (
        <div>
          <Progress 
            percent={getCompletionRate(record)} 
            size="small" 
            showInfo={false}
            strokeColor={getCompletionRate(record) === 100 ? '#52c41a' : '#1890ff'}
          />
          <div className="text-xs text-center mt-1">
            {record.items.filter(item => item.status === 'COMPLETED').length}/{record.items.length} mặt hàng
          </div>
        </div>
      )
    },
    {
      title: 'Giá trị',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount: number) => formatCurrency(amount),
      align: 'right'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const statusConfig = PURCHASE_ORDER_STATUSES.find(s => s.key === status);
        return (
          <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
            {statusConfig?.label || status}
          </Tag>
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 140,
      render: (_, record: PurchaseOrderEntity) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa đơn mua hàng này?"
              onConfirm={() => handleDelete(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Quản lý đơn mua hàng</h1>
        <p className="text-gray-600">Theo dõi và quản lý các đơn mua hàng từ nhà cung cấp</p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={stats.totalOrders}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Chờ duyệt"
              value={stats.pendingOrders}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đã duyệt"
              value={stats.approvedOrders}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Giá trị còn nợ"
              value={stats.outstandingAmount}
              prefix={<DollarOutlined />}
              precision={0}
              valueStyle={{ color: '#722ed1' }}
              formatter={(value) => formatCurrency(Number(value))}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-4">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} lg={4}>
            <Search
              placeholder="Tìm kiếm..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Select
              placeholder="Trạng thái"
              allowClear
              style={{ width: '100%' }}
              value={filters.status || undefined}
              onChange={(value) => setFilters({...filters, status: value || ''})}
            >
              {PURCHASE_ORDER_STATUSES.map(status => (
                <Option key={status.key} value={status.key}>
                  {status.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Select
              placeholder="Nhà cung cấp"
              allowClear
              style={{ width: '100%' }}
              value={filters.supplierId || undefined}
              onChange={(value) => setFilters({...filters, supplierId: value || ''})}
            >
              {suppliers.map(supplier => (
                <Option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={24} lg={8}>
            <RangePicker
              style={{ width: '100%' }}
              onChange={(dates) => setFilters({...filters, dateRange: dates})}
            />
          </Col>
          <Col xs={24} sm={24} lg={4}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} block>
              Tạo đơn mới
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Orders Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredOrders.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} đơn mua hàng`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingOrder ? 'Chỉnh sửa đơn mua hàng' : 'Tạo đơn mua hàng mới'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        width={800}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="supplierId"
                label="Nhà cung cấp"
                rules={[{ required: true, message: 'Vui lòng chọn nhà cung cấp' }]}
              >
                <Select placeholder="Chọn nhà cung cấp">
                  {suppliers.map(supplier => (
                    <Option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="orderDate"
                label="Ngày đặt hàng"
                rules={[{ required: true, message: 'Vui lòng chọn ngày đặt hàng' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="expectedDate"
                label="Ngày dự kiến"
                rules={[{ required: true, message: 'Vui lòng chọn ngày dự kiến' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <Input.TextArea rows={3} placeholder="Ghi chú cho đơn hàng" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="currency"
                label="Đơn vị tiền tệ"
                rules={[{ required: true, message: 'Vui lòng chọn đơn vị tiền tệ' }]}
              >
                <Select>
                  <Option value="VND">VND</Option>
                  <Option value="USD">USD</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="exchangeRate"
                label="Tỷ giá"
              >
                <Input type="number" placeholder="1" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select placeholder="Chọn trạng thái">
              {PURCHASE_ORDER_STATUSES.map(status => (
                <Option key={status.key} value={status.key}>
                  {status.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PurchaseOrdersList;
