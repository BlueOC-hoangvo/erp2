import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Progress,
  Tag,
  Button,
  DatePicker,
  Select,
  Space,
  Typography,
  List,
  Avatar,
  Timeline,
  Alert,
  Badge
} from 'antd';
import {
  ShoppingOutlined,
  DollarOutlined,
  UserOutlined,
  FileTextOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  EyeOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

// Helper functions for formatting
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('vi-VN');
};
import {
  listSuppliers,
  listPurchaseOrders,
  getPurchasingStats
} from '../fake/purchasing.store';
import type { SupplierEntity, PurchaseOrderEntity } from '../types';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const PurchasingDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<SupplierEntity[]>([]);
  const [orders, setOrders] = useState<PurchaseOrderEntity[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    try {
      const suppliersData = listSuppliers();
      const ordersData = listPurchaseOrders();
      const statsData = getPurchasingStats();
      setSuppliers(suppliersData);
      setOrders(ordersData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading purchasing dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Chart data for purchase trends
  const purchaseTrendData = [
    { month: 'Tháng 1', amount: 120000000 },
    { month: 'Tháng 2', amount: 145000000 },
    { month: 'Tháng 3', amount: 98000000 },
    { month: 'Tháng 4', amount: 167000000 },
    { month: 'Tháng 5', amount: 189000000 },
    { month: 'Tháng 6', amount: 210000000 },
  ];

  // Chart data for order status distribution
  const orderStatusData = [
    { status: 'Chờ duyệt', value: 12, color: '#faad14' },
    { status: 'Đã duyệt', value: 8, color: '#52c41a' },
    { status: 'Đã nhận hàng', value: 25, color: '#1890ff' },
    { status: 'Hủy', value: 3, color: '#ff4d4f' },
  ];

  // Top suppliers by value
  const topSuppliers = suppliers
    .slice(0, 5)
    .map(supplier => ({
      ...supplier,
      totalOrders: Math.floor(Math.random() * 20) + 5,
      totalValue: Math.floor(Math.random() * 500000000) + 100000000,
    }))
    .sort((a, b) => b.totalValue - a.totalValue);

  // Recent activities
  const recentActivities = [
    {
      id: 1,
      type: 'order_created',
      message: 'Tạo đơn mua hàng #PO-2024-001 từ ABC Corp',
      time: '2 phút trước',
      icon: <FileTextOutlined />,
      color: '#1890ff'
    },
    {
      id: 2,
      type: 'supplier_approved',
      message: 'Nhà cung cấp XYZ Ltd đã được duyệt',
      time: '15 phút trước',
      icon: <CheckCircleOutlined />,
      color: '#52c41a'
    },
    {
      id: 3,
      type: 'payment_overdue',
      message: 'Thanh toán quá hạn cho supplier DEF Inc',
      time: '1 giờ trước',
      icon: <AlertOutlined />,
      color: '#ff4d4f'
    },
    {
      id: 4,
      type: 'order_received',
      message: 'Nhận hàng từ GHI Supplies',
      time: '2 giờ trước',
      icon: <CheckCircleOutlined />,
      color: '#52c41a'
    }
  ];

  // Pending tasks
  const pendingTasks = [
    {
      id: 1,
      task: 'Duyệt đơn mua hàng #PO-2024-015',
      priority: 'high',
      dueDate: '2024-01-15'
    },
    {
      id: 2,
      task: 'Cập nhật thông tin nhà cung cấp JKL Co',
      priority: 'medium',
      dueDate: '2024-01-16'
    },
    {
      id: 3,
      task: 'Kiểm tra đơn hàng chậm trễ',
      priority: 'high',
      dueDate: '2024-01-14'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff4d4f';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Cao';
      case 'medium': return 'Trung bình';
      case 'low': return 'Thấp';
      default: return 'Không xác định';
    }
  };

  const topSuppliersColumns: ColumnsType<any> = [
    {
      title: 'Nhà cung cấp',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: any) => (
        <div className="flex items-center space-x-3">
          <Avatar icon={<UserOutlined />} />
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-sm text-gray-500">{record.code}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Số đơn hàng',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
      align: 'center',
      render: (value: number) => (
        <Badge count={value} style={{ backgroundColor: '#52c41a' }} />
      )
    },
    {
      title: 'Giá trị đơn hàng',
      dataIndex: 'totalValue',
      key: 'totalValue',
      align: 'right',
      render: (value: number) => (
        <span className="font-medium text-blue-600">
          {formatCurrency(value)}
        </span>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
          {status === 'ACTIVE' ? 'Hoạt động' : 'Tạm dừng'}
        </Tag>
      )
    }
  ];

  const renderKPI = (title: string, value: number, prefix: React.ReactNode, suffix?: string, trend?: number, color?: string) => (
    <Card className="h-full">
      <Statistic
        title={title}
        value={value}
        prefix={prefix}
        suffix={suffix}
        valueStyle={{ color: color || '#000' }}
      />
      {trend !== undefined && (
        <div className="mt-2 flex items-center text-sm">
          {trend > 0 ? (
            <ArrowUpOutlined className="text-green-500 mr-1" />
          ) : (
            <ArrowDownOutlined className="text-red-500 mr-1" />
          )}
          <span className={trend > 0 ? 'text-green-500' : 'text-red-500'}>
            {Math.abs(trend)}% so với tháng trước
          </span>
        </div>
      )}
    </Card>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <Title level={2} className="mb-2">Dashboard Mua hàng</Title>
            <Text type="secondary">
              Tổng quan tình hình mua hàng và quản lý nhà cung cấp
            </Text>
          </div>
          <Space>
            <Select
              placeholder="Trạng thái"
              style={{ width: 120 }}
              value={selectedStatus}
              onChange={setSelectedStatus}
            >
              <Option value="">Tất cả</Option>
              <Option value="PENDING">Chờ duyệt</Option>
              <Option value="APPROVED">Đã duyệt</Option>
              <Option value="RECEIVED">Đã nhận</Option>
            </Select>
            <RangePicker />
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => navigate('/purchasing/orders')}
            >
              Tạo đơn mới
            </Button>
          </Space>
        </div>
      </div>

      {/* KPI Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          {renderKPI('Tổng mua hàng tháng này', 2450000000, <ShoppingOutlined />, 'VND', 12.5, '#1890ff')}
        </Col>
        <Col xs={24} sm={12} lg={6}>
          {renderKPI('Số đơn hàng chờ duyệt', 15, <ClockCircleOutlined />, 'đơn', -8.2, '#faad14')}
        </Col>
        <Col xs={24} sm={12} lg={6}>
          {renderKPI('Giá trị đơn hàng TB', 45000000, <DollarOutlined />, 'VND', 5.3, '#52c41a')}
        </Col>
        <Col xs={24} sm={12} lg={6}>
          {renderKPI('Tỷ lệ đúng hạn', 92.5, <CheckCircleOutlined />, '%', 3.2, '#722ed1')}
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={16}>
          <Card title="Xu hướng mua hàng 6 tháng gần đây" className="h-80">
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <div className="text-center">
                <div className="text-4xl text-gray-400 mb-2">📊</div>
                <div className="text-gray-600">Biểu đồ xu hướng mua hàng</div>
                <div className="text-sm text-gray-500 mt-1">
                  {purchaseTrendData.map(item => (
                    <div key={item.month} className="text-left">
                      {item.month}: {formatCurrency(item.amount)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Phân bố trạng thái đơn hàng" className="h-80">
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <div className="text-center">
                <div className="text-4xl text-gray-400 mb-2">🥧</div>
                <div className="text-gray-600">Biểu đồ phân bố trạng thái</div>
                <div className="text-sm text-gray-500 mt-1">
                  {orderStatusData.map(item => (
                    <div key={item.status} className="text-left flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      {item.status}: {item.value} đơn
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Data Tables Row */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={14}>
          <Card 
            title="Top nhà cung cấp" 
            extra={
              <Button type="link" onClick={() => navigate('/purchasing/suppliers')}>
                Xem tất cả
              </Button>
            }
          >
            <Table
              columns={topSuppliersColumns}
              dataSource={topSuppliers}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="Hoạt động gần đây">
            <Timeline>
              {recentActivities.map(activity => (
                <Timeline.Item
                  key={activity.id}
                  dot={<span style={{ color: activity.color }}>{activity.icon}</span>}
                >
                  <div>
                    <div className="text-sm">{activity.message}</div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>
      </Row>

      {/* Pending Tasks */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Nhiệm vụ chờ xử lý" extra={<Button type="link">Xem tất cả</Button>}>
            <List
              dataSource={pendingTasks}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <div className="flex justify-between items-center">
                        <span>{item.task}</span>
                        <Tag color={getPriorityColor(item.priority)}>
                          {getPriorityText(item.priority)}
                        </Tag>
                      </div>
                    }
                    description={`Hạn chót: ${formatDate(item.dueDate)}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Cảnh báo">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Alert
                message="3 đơn hàng đến hạn thanh toán"
                description="Cần thanh toán trong 3 ngày tới để tránh phí phạt."
                type="warning"
                showIcon
                action={
                  <Button size="small" type="link">
                    Xem chi tiết
                  </Button>
                }
              />
              <Alert
                message="2 nhà cung cấp cần gia hạn hợp đồng"
                description="Hợp đồng với ABC Corp và XYZ Ltd sắp hết hạn."
                type="info"
                showIcon
                action={
                  <Button size="small" type="link">
                    Xem chi tiết
                  </Button>
                }
              />
              <Alert
                message="Tồn kho nguyên vật liệu thấp"
                description="5 mặt hàng cần đặt mua thêm để đảm bảo sản xuất."
                type="error"
                showIcon
                action={
                  <Button size="small" type="link">
                    Xem chi tiết
                  </Button>
                }
              />
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PurchasingDashboard;
