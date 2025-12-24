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
  Progress, 
  Tooltip,
  Select,
  DatePicker,
  Input,
} from 'antd';
import { 
  PlusOutlined, 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,

  TeamOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

import type { ProductionOrderEntity } from '../types';
import { 
  listProductionOrders, 
  getProductionOrderStats,
  deleteProductionOrder
} from '../fake/production-orders.store';
import { PRODUCTION_ORDER_STATUSES, PRIORITY_LEVELS } from '../types';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search } = Input;

const ProductionOrdersList: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<ProductionOrderEntity[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    dateRange: null as any,
    search: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const ordersData = listProductionOrders();
      const statsData = getProductionOrderStats();
      setOrders(ordersData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading production orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id: string) => {
    deleteProductionOrder(id);
    loadData();
  };

  const handleViewDetail = (order: ProductionOrderEntity) => {
    navigate(`/production/orders/${order.id}`);
  };

  const getStatusColor = (status: string) => {
    const statusConfig = PRODUCTION_ORDER_STATUSES.find(s => s.key === status);
    return statusConfig?.color || 'default';
  };

  const getPriorityColor = (priority: string) => {
    const priorityConfig = PRIORITY_LEVELS.find(p => p.key === priority);
    return priorityConfig?.color || 'default';
  };

  const getCompletionRate = (order: ProductionOrderEntity) => {
    return order.totalQuantity > 0 
      ? Math.round((order.completedQuantity / order.totalQuantity) * 100)
      : 0;
  };

  const filteredOrders = orders.filter(order => {
    if (filters.status && order.status !== filters.status) return false;
    if (filters.priority && order.priority !== filters.priority) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        order.orderNo.toLowerCase().includes(searchLower) ||
        order.productName.toLowerCase().includes(searchLower) ||
        order.customerName?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const columns: ColumnsType<ProductionOrderEntity> = [
    {
      title: 'Mã lệnh',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 120,
      render: (text: string) => <strong>{text}</strong>
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      ellipsis: true,
      render: (text: string, record: ProductionOrderEntity) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">{record.productStyleCode}</div>
        </div>
      )
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 150,
      ellipsis: true
    },
    {
      title: 'Số lượng',
      key: 'quantity',
      width: 120,
      render: (_, record: ProductionOrderEntity) => (
        <div className="text-center">
          <div className="font-medium">{record.completedQuantity}/{record.totalQuantity}</div>
          <Progress 
            percent={getCompletionRate(record)} 
            size="small" 
            showInfo={false}
            strokeColor={getCompletionRate(record) === 100 ? '#52c41a' : '#1890ff'}
          />
        </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const statusConfig = PRODUCTION_ORDER_STATUSES.find(s => s.key === status);
        return (
          <Tag color={getStatusColor(status)}>
            {statusConfig?.label || status}
          </Tag>
        );
      }
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: string) => {
        const priorityConfig = PRIORITY_LEVELS.find(p => p.key === priority);
        return (
          <Tag color={getPriorityColor(priority)}>
            {priorityConfig?.label || priority}
          </Tag>
        );
      }
    },
    {
      title: 'Đội sản xuất',
      dataIndex: 'assignedTeam',
      key: 'assignedTeam',
      width: 120
    },
    {
      title: 'Thời gian',
      key: 'time',
      width: 150,
      render: (_, record: ProductionOrderEntity) => (
        <div className="text-xs">
          <div>BĐ: {new Date(record.startDate).toLocaleDateString('vi-VN')}</div>
          <div>KT: {new Date(record.endDate).toLocaleDateString('vi-VN')}</div>
        </div>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      render: (_, record: ProductionOrderEntity) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button 
              type="link" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Quản lý lệnh sản xuất</h1>
        <p className="text-gray-600">Theo dõi và quản lý các lệnh sản xuất trong hệ thống</p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng lệnh"
              value={stats.totalOrders}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đang sản xuất"
              value={stats.inProgressOrders}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Hoàn thành"
              value={stats.completedOrders}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tỷ lệ hoàn thành"
              value={stats.completionRate}
              suffix="%"
              prefix={<TrophyOutlined />}
              precision={1}
              valueStyle={{ color: '#722ed1' }}
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
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Select
              placeholder="Trạng thái"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => setFilters({...filters, status: value || ''})}
            >
              {PRODUCTION_ORDER_STATUSES.map(status => (
                <Option key={status.key} value={status.key}>
                  {status.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Select
              placeholder="Ưu tiên"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => setFilters({...filters, priority: value || ''})}
            >
              {PRIORITY_LEVELS.map(priority => (
                <Option key={priority.key} value={priority.key}>
                  {priority.label}
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
            <Button type="primary" icon={<PlusOutlined />} block>
              Tạo lệnh mới
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
              `${range[0]}-${range[1]} của ${total} lệnh sản xuất`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default ProductionOrdersList;

