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
  Badge,
  Alert
} from 'antd';
import { 
  PlusOutlined, 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  TruckOutlined,
  DollarOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import type { WarehouseOutEntity } from '../types';
import { 
  listWarehouseOuts, 
  getWarehouseOutStats,
  deleteWarehouseOut
} from '../fake/warehouse-out.store';
import { WAREHOUSE_OUT_STATUSES, OUT_TYPES } from '../types';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search } = Input;

const WarehouseOutList: React.FC = () => {
  const [outs, setOuts] = useState<WarehouseOutEntity[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [selectedOut, setSelectedOut] = useState<WarehouseOutEntity | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    dateRange: null as any,
    search: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const outsData = listWarehouseOuts();
      const statsData = getWarehouseOutStats();
      setOuts(outsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading warehouse outs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id: string) => {
    deleteWarehouseOut(id);
    loadData();
  };

  const handleViewDetail = (out: WarehouseOutEntity) => {
    setSelectedOut(out);
    setShowDetail(true);
  };

  const getStatusColor = (status: string) => {
    const statusConfig = WAREHOUSE_OUT_STATUSES.find(s => s.key === status);
    return statusConfig?.color || 'default';
  };

  const getTypeColor = (type: string) => {
    const typeConfig = OUT_TYPES.find(t => t.key === type);
    return typeConfig?.color || 'default';
  };

  const filteredOuts = outs.filter(out => {
    if (filters.status && out.status !== filters.status) return false;
    if (filters.type && out.outType !== filters.type) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        out.outNo.toLowerCase().includes(searchLower) ||
        out.warehouseName.toLowerCase().includes(searchLower) ||
        out.customerName?.toLowerCase().includes(searchLower) ||
        out.reference?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const columns: ColumnsType<WarehouseOutEntity> = [
    {
      title: 'Mã phiếu',
      dataIndex: 'outNo',
      key: 'outNo',
      width: 120,
      render: (text: string) => <strong>{text}</strong>
    },
    {
      title: 'Loại xuất',
      dataIndex: 'outType',
      key: 'outType',
      width: 120,
      render: (type: string) => {
        const typeConfig = OUT_TYPES.find(t => t.key === type);
        return (
          <Tag color={getTypeColor(type)}>
            {typeConfig?.label || type}
          </Tag>
        );
      }
    },
    {
      title: 'Kho',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
      width: 120
    },
    {
      title: 'Khách hàng/Người nhận',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 180,
      ellipsis: true,
      render: (name: string, record: WarehouseOutEntity) => (
        <div>
          <div>{name || '-'}</div>
          {record.salesOrderId && (
            <div className="text-xs text-blue-600">ĐH: {record.salesOrderId}</div>
          )}
          {record.productionOrderId && (
            <div className="text-xs text-orange-600">LSX: {record.productionOrderId}</div>
          )}
        </div>
      )
    },
    {
      title: 'Giá trị',
      key: 'value',
      width: 120,
      render: (_, record: WarehouseOutEntity) => (
        <div className="text-right">
          <div className="font-medium">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(record.totalValue)}
          </div>
        </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const statusConfig = WAREHOUSE_OUT_STATUSES.find(s => s.key === status);
        const icon = status === 'COMPLETED' ? <CheckCircleOutlined /> : 
                    status === 'PENDING' ? <ClockCircleOutlined /> :
                    status === 'APPROVED' ? <CheckCircleOutlined /> :
                    status === 'DRAFT' ? <EditOutlined /> : <ExclamationCircleOutlined />;
        return (
          <Tag color={getStatusColor(status)} icon={icon}>
            {statusConfig?.label || status}
          </Tag>
        );
      }
    },
    {
      title: 'Ngày xuất',
      dataIndex: 'outDate',
      key: 'outDate',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN')
    },
    {
      title: 'Người tạo',
      key: 'createdBy',
      width: 120,
      render: (user: string, record: WarehouseOutEntity) => (
        <div>
          {record.completedBy || record.approvedBy || '-'}
        </div>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      render: (_, record: WarehouseOutEntity) => (
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

  if (showDetail && selectedOut) {
    // TODO: Implement WarehouseOutDetail component
    return (
      <div className="p-6">
        <Button onClick={() => setShowDetail(false)}>Quay lại</Button>
        <h2>Chi tiết phiếu xuất kho: {selectedOut.outNo}</h2>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Quản lý xuất kho</h1>
        <p className="text-gray-600">Theo dõi và quản lý các lệnh xuất kho trong hệ thống</p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng phiếu xuất"
              value={stats.totalOuts}
              prefix={<TruckOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đã hoàn thành"
              value={stats.completedOuts}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Chờ xử lý"
              value={stats.pendingOuts}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Giá trị xuất"
              value={stats.completedValue || 0}
              prefix={<DollarOutlined />}
              precision={0}
              formatter={(value) => new Intl.NumberFormat('vi-VN').format(Number(value))}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Type Statistics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col span={24}>
          <Card title="Thống kê theo loại xuất">
            <Row gutter={[16, 16]}>
              {OUT_TYPES.map(type => (
                <Col xs={24} sm={12} lg={4.8} key={type.key}>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold" style={{ color: getTypeColor(type.key) }}>
                      {stats.outTypes?.[type.key] || 0}
                    </div>
                    <div className="text-sm text-gray-600">{type.label}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Today's Activity Alert */}
      {stats.todayOuts > 0 && (
        <Alert
          message={`Hôm nay có ${stats.todayOuts} phiếu xuất kho`}
          type="info"
          showIcon
          className="mb-4"
        />
      )}

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
              {WAREHOUSE_OUT_STATUSES.map(status => (
                <Option key={status.key} value={status.key}>
                  {status.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Select
              placeholder="Loại xuất"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => setFilters({...filters, type: value || ''})}
            >
              {OUT_TYPES.map(type => (
                <Option key={type.key} value={type.key}>
                  {type.label}
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
              Tạo phiếu xuất
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Out Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredOuts}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredOuts.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} phiếu xuất`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default WarehouseOutList;

