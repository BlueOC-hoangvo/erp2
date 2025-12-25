import React, { useState } from 'react';
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
  Input,
  message,
} from 'antd';
import { 
  PlusOutlined, 
  EyeOutlined, 
  DeleteOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  TrophyOutlined,
  PlayCircleOutlined,
  StopOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import type { ProductionOrderEntity, ProductionOrderQuery } from '../types';
import { 
  getProductionOrders,
  deleteProductionOrder as deleteProductionOrderApi,
  releaseProductionOrder,
  startProductionOrder,
  completeProductionOrder,
  cancelProductionOrder
} from '../api/production-orders.api';
import { PRODUCTION_ORDER_STATUSES } from '../types';

const { Option } = Select;
const { Search } = Input;

const ProductionOrdersList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState<ProductionOrderQuery>({
    page: 1,
    pageSize: 10,
  });
  const [filters, setFilters] = useState({
    status: '' as '' | "DRAFT" | "RELEASED" | "RUNNING" | "DONE" | "CANCELLED" | undefined,
    q: '',
  });

  // Load production orders
  const { data, isLoading } = useQuery({
    queryKey: ['production-orders', query],
    queryFn: () => getProductionOrders(query),
  });

  // Mutations for actions
  const deleteMutation = useMutation({
    mutationFn: deleteProductionOrderApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['production-orders'] });
      message.success('Xóa lệnh sản xuất thành công');
    },
    onError: () => {
      message.error('Có lỗi khi xóa lệnh sản xuất');
    },
  });

  const releaseMutation = useMutation({
    mutationFn: releaseProductionOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['production-orders'] });
      message.success('Phát hành lệnh sản xuất thành công');
    },
    onError: () => {
      message.error('Có lỗi khi phát hành lệnh sản xuất');
    },
  });

  const startMutation = useMutation({
    mutationFn: startProductionOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['production-orders'] });
      message.success('Bắt đầu sản xuất thành công');
    },
    onError: () => {
      message.error('Có lỗi khi bắt đầu sản xuất');
    },
  });

  const completeMutation = useMutation({
    mutationFn: completeProductionOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['production-orders'] });
      message.success('Hoàn thành lệnh sản xuất thành công');
    },
    onError: () => {
      message.error('Có lỗi khi hoàn thành lệnh sản xuất');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelProductionOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['production-orders'] });
      message.success('Hủy lệnh sản xuất thành công');
    },
    onError: () => {
      message.error('Có lỗi khi hủy lệnh sản xuất');
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleViewDetail = (order: ProductionOrderEntity) => {
    navigate(`/production/orders/${order.id}`);
  };

  const handleStatusAction = (order: ProductionOrderEntity, action: string) => {
    const id = order.id;
    switch (action) {
      case 'release':
        releaseMutation.mutate(id);
        break;
      case 'start':
        startMutation.mutate(id);
        break;
      case 'done':
        completeMutation.mutate(id);
        break;
      case 'cancel':
        cancelMutation.mutate(id);
        break;
    }
  };

  const getStatusColor = (status: string) => {
    const statusConfig = PRODUCTION_ORDER_STATUSES.find(s => s.key === status);
    return statusConfig?.color || 'default';
  };

  const getStatusLabel = (status: string) => {
    const statusConfig = PRODUCTION_ORDER_STATUSES.find(s => s.key === status);
    return statusConfig?.label || status;
  };

  const getCompletionRate = (order: ProductionOrderEntity) => {
    return order.qtyPlan > 0 
      ? Math.round((Number(order.qtyCompleted) / Number(order.qtyPlan)) * 100)
      : 0;
  };

  const getAvailableActions = (order: ProductionOrderEntity) => {
    const actions = [];
    switch (order.status) {
      case 'DRAFT':
        actions.push({ key: 'release', icon: <PlayCircleOutlined />, label: 'Phát hành' });
        actions.push({ key: 'cancel', icon: <StopOutlined />, label: 'Hủy' });
        break;
      case 'RELEASED':
        actions.push({ key: 'start', icon: <PlayCircleOutlined />, label: 'Bắt đầu' });
        actions.push({ key: 'cancel', icon: <StopOutlined />, label: 'Hủy' });
        break;
      case 'RUNNING':
        actions.push({ key: 'done', icon: <CheckCircleOutlined />, label: 'Hoàn thành' });
        break;
    }
    return actions;
  };

  const orders = data?.data?.items || [];
  const stats = {
    totalOrders: data?.data?.total || 0,
    inProgressOrders: orders.filter((o: ProductionOrderEntity) => o.status === 'RUNNING').length,
    completedOrders: orders.filter((o: ProductionOrderEntity) => o.status === 'DONE').length,
    completionRate: orders.length > 0 
      ? Math.round((orders.filter((o: ProductionOrderEntity) => o.status === 'DONE').length / orders.length) * 100)
      : 0,
  };

  const columns: ColumnsType<ProductionOrderEntity> = [
    {
      title: 'Mã lệnh',
      dataIndex: 'moNo',
      key: 'moNo',
      width: 120,
      render: (text: string) => <strong>{text}</strong>
    },
    {
      title: 'Sản phẩm',
      key: 'product',
      ellipsis: true,
      render: (_, record: ProductionOrderEntity) => (
        <div>
          <div className="font-medium">{record.productStyle?.name || 'N/A'}</div>
          <div className="text-xs text-gray-500">{record.productStyle?.code || 'N/A'}</div>
        </div>
      )
    },
    {
      title: 'Số lượng',
      key: 'quantity',
      width: 140,
      render: (_, record: ProductionOrderEntity) => (
        <div className="text-center">
          <div className="font-medium">{Number(record.qtyCompleted)}/{Number(record.qtyPlan)}</div>
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
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusLabel(status)}
        </Tag>
      )
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 120,
      render: (date: string) => date ? new Date(date).toLocaleDateString('vi-VN') : '-'
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 120,
      render: (date: string) => date ? new Date(date).toLocaleDateString('vi-VN') : '-'
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      ellipsis: true,
      render: (note: string) => note || '-'
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 200,
      render: (_, record: ProductionOrderEntity) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button 
              type="link" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          
          {/* Status Action Buttons */}
          {getAvailableActions(record).map(action => (
            <Tooltip key={action.key} title={action.label}>
              <Button 
                type="link" 
                icon={action.icon}
                onClick={() => handleStatusAction(record, action.key)}
                loading={
                  (action.key === 'release' && releaseMutation.isPending) ||
                  (action.key === 'start' && startMutation.isPending) ||
                  (action.key === 'done' && completeMutation.isPending) ||
                  (action.key === 'cancel' && cancelMutation.isPending)
                }
              />
            </Tooltip>
          ))}
          
          <Tooltip title="Xóa">
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleDelete(record.id)}
              loading={deleteMutation.isPending}
              disabled={record.status !== 'DRAFT'}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const handleTableChange = (pagination: any) => {
    setQuery({
      ...query,
      page: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  const handleFilterChange = () => {
    const newQuery = {
      ...query,
      page: 1,
      status: filters.status || undefined,
      q: filters.q || undefined,
    };
    setQuery(newQuery);
  };

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
              placeholder="Tìm kiếm theo mã lệnh..."
              onChange={(e) => setFilters({...filters, q: e.target.value})}
              onSearch={handleFilterChange}
            />
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Select
              placeholder="Trạng thái"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => setFilters({...filters, status: value || ''})}
              onBlur={handleFilterChange}
            >
              {PRODUCTION_ORDER_STATUSES.map(status => (
                <Option key={status.key} value={status.key}>
                  {status.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={24} lg={4}>
            <Button type="primary" icon={<PlusOutlined />} block onClick={() => navigate('/production/orders/create')}>
              Tạo lệnh mới
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Orders Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          loading={isLoading}
          onChange={handleTableChange}
          pagination={{
            current: query.page,
            pageSize: query.pageSize,
            total: data?.data?.total || 0,
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

