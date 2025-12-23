import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Descriptions,
  Tag,
  Progress,
  Timeline,
  Table,
  Button,
  Space,
  Tabs,
  Statistic,
  Divider,
  Alert
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  PrinterOutlined,
  ShareAltOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
  CalendarOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import type { ProductionOrderEntity } from '../types';
import { PRODUCTION_ORDER_STATUSES, PRIORITY_LEVELS } from '../types';
import { getProductionOrder } from '../fake/production-orders.store';

const { TabPane } = Tabs;

export function ProductionOrdersDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const order = id ? getProductionOrder(id) : null;

  if (!order) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Không tìm thấy lệnh sản xuất
            </h2>
            <p className="text-gray-600 mb-4">
              Lệnh sản xuất với ID "{id}" không tồn tại hoặc đã bị xóa.
            </p>
            <Button 
              type="primary" 
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/production/orders')}
            >
              Quay lại danh sách
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const handleBack = () => {
    navigate('/production/orders');
  };

  const getStatusColor = (status: string) => {
    const statusConfig = PRODUCTION_ORDER_STATUSES.find(s => s.key === status);
    return statusConfig?.color || 'default';
  };

  const getPriorityColor = (priority: string) => {
    const priorityConfig = PRIORITY_LEVELS.find(p => p.key === priority);
    return priorityConfig?.color || 'default';
  };

  const getCompletionRate = () => {
    return order.totalQuantity > 0 
      ? Math.round((order.completedQuantity / order.totalQuantity) * 100)
      : 0;
  };

  const getProgressStatus = () => {
    const rate = getCompletionRate();
    if (rate === 100) return 'success';
    if (rate > 0) return 'active';
    return 'normal';
  };

  const itemsColumns: ColumnsType<any> = [
    {
      title: 'Kích thước',
      dataIndex: 'sizeCode',
      key: 'sizeCode',
      width: 100
    },
    {
      title: 'Màu sắc',
      dataIndex: 'colorCode',
      key: 'colorCode',
      width: 100,
      render: (color: string) => (
        <Tag color={color.toLowerCase()}>{color}</Tag>
      )
    },
    {
      title: 'Số lượng kế hoạch',
      dataIndex: 'plannedQty',
      key: 'plannedQty',
      width: 120,
      align: 'center' as const
    },
    {
      title: 'Số lượng hoàn thành',
      dataIndex: 'completedQty',
      key: 'completedQty',
      width: 120,
      align: 'center' as const,
      render: (qty: number, record: any) => (
        <div>
          <div className="font-medium">{qty}</div>
          <Progress 
            percent={Math.round((qty / record.plannedQty) * 100)} 
            showInfo={false}
            size="small"
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
      title: 'Công đoạn',
      dataIndex: 'workCenter',
      key: 'workCenter',
      width: 120
    },
    {
      title: 'Người phụ trách',
      dataIndex: 'assignedWorker',
      key: 'assignedWorker',
      width: 150
    }
  ];

  const materialsColumns: ColumnsType<any> = [
    {
      title: 'Mã vật tư',
      dataIndex: 'materialCode',
      key: 'materialCode'
    },
    {
      title: 'Tên vật tư',
      dataIndex: 'materialName',
      key: 'materialName',
      ellipsis: true
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
      key: 'unit',
      width: 80
    },
    {
      title: 'Số lượng yêu cầu',
      dataIndex: 'requiredQty',
      key: 'requiredQty',
      width: 120,
      align: 'center' as const
    },
    {
      title: 'Số lượng đã dùng',
      dataIndex: 'consumedQty',
      key: 'consumedQty',
      width: 120,
      align: 'center' as const,
      render: (qty: number, record: any) => (
        <div>
          <div className="font-medium">{qty}</div>
          <Progress 
            percent={Math.round((qty / record.requiredQty) * 100)} 
            size="small" 
            showInfo={false}
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
        const statusMap = {
          'PENDING': { color: 'orange', label: 'Chờ' },
          'PARTIAL': { color: 'blue', label: 'Một phần' },
          'COMPLETED': { color: 'green', label: 'Hoàn thành' }
        };
        const config = statusMap[status as keyof typeof statusMap];
        return <Tag color={config?.color}>{config?.label}</Tag>;
      }
    }
  ];

  const qualityColumns: ColumnsType<any> = [
    {
      title: 'Điểm kiểm tra',
      dataIndex: 'checkPoint',
      key: 'checkPoint'
    },
    {
      title: 'Kết quả',
      dataIndex: 'result',
      key: 'result',
      width: 100,
      render: (result: string) => {
        const resultMap = {
          'PASS': { color: 'green', label: 'Đạt', icon: <CheckCircleOutlined /> },
          'FAIL': { color: 'red', label: 'Không đạt', icon: <ExclamationCircleOutlined /> },
          'PENDING': { color: 'orange', label: 'Chờ', icon: <ClockCircleOutlined /> }
        };
        const config = resultMap[result as keyof typeof resultMap];
        return (
          <Tag color={config?.color} icon={config?.icon}>
            {config?.label}
          </Tag>
        );
      }
    },
    {
      title: 'Người kiểm tra',
      dataIndex: 'checkedBy',
      key: 'checkedBy',
      width: 120
    },
    {
      title: 'Thời gian',
      dataIndex: 'checkedAt',
      key: 'checkedAt',
      width: 150,
      render: (time: string) => time ? new Date(time).toLocaleString('vi-VN') : '-'
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true
    }
  ];

  const timelineData = [
    {
      color: 'blue',
      dot: <CalendarOutlined />,
      children: (
        <div>
          <div className="font-medium">Tạo lệnh sản xuất</div>
          <div className="text-gray-500">{new Date(order.createdAt).toLocaleString('vi-VN')}</div>
        </div>
      )
    },
    ...(order.items.map((item) => ({
      color: item.status === 'COMPLETED' ? 'green' : item.status === 'IN_PROGRESS' ? 'blue' : 'gray',
      dot: item.status === 'COMPLETED' ? <CheckCircleOutlined /> : <ClockCircleOutlined />,
      children: (
        <div>
          <div className="font-medium">
            {item.sizeCode}/{item.colorCode} - {item.workCenter}
          </div>
          <div className="text-gray-500">
            {item.assignedWorker && `Phụ trách: ${item.assignedWorker}`}
            {item.startTime && ` - Bắt đầu: ${new Date(item.startTime).toLocaleString('vi-VN')}`}
            {item.endTime && ` - Kết thúc: ${new Date(item.endTime).toLocaleString('vi-VN')}`}
          </div>
        </div>
      )
    }))),
    ...(order.status === 'COMPLETED' ? [{
      color: 'green',
      dot: <TrophyOutlined />,
      children: (
        <div>
          <div className="font-medium">Hoàn thành lệnh sản xuất</div>
          <div className="text-gray-500">{new Date(order.updatedAt).toLocaleString('vi-VN')}</div>
        </div>
      )
    }] : [])
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
          >
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Lệnh sản xuất: {order.orderNo}
            </h1>
            <div className="flex items-center space-x-2">
              <Tag color={getStatusColor(order.status)}>
                {PRODUCTION_ORDER_STATUSES.find(s => s.key === order.status)?.label}
              </Tag>
              <Tag color={getPriorityColor(order.priority)}>
                {PRIORITY_LEVELS.find(p => p.key === order.priority)?.label}
              </Tag>
            </div>
          </div>
        </div>
        <Space>
          <Button icon={<EditOutlined />}>Chỉnh sửa</Button>
          <Button icon={<PrinterOutlined />}>In lệnh</Button>
          <Button icon={<ShareAltOutlined />} type="primary">Chia sẻ</Button>
        </Space>
      </div>

      {/* Progress Alert */}
      <Alert
        message={`Tiến độ hoàn thành: ${getCompletionRate()}%`}
        description={`Đã hoàn thành ${order.completedQuantity}/${order.totalQuantity} sản phẩm`}
        type={getCompletionRate() === 100 ? 'success' : 'info'}
        showIcon
        className="mb-6"
      />

      <Row gutter={[24, 24]}>
        {/* Left Column - Main Info */}
        <Col xs={24} lg={16}>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Tổng quan" key="overview">
              <Card>
                <Descriptions title="Thông tin chung" bordered column={2}>
                  <Descriptions.Item label="Mã lệnh" span={1}>
                    <strong>{order.orderNo}</strong>
                  </Descriptions.Item>
                  <Descriptions.Item label="Sản phẩm" span={1}>
                    <div>
                      <div className="font-medium">{order.productName}</div>
                      <div className="text-gray-500">{order.productStyleCode}</div>
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Khách hàng" span={1}>
                    {order.customerName || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Đội sản xuất" span={1}>
                    <Space>
                      <TeamOutlined />
                      {order.assignedTeam}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số lượng" span={1}>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {order.completedQuantity}/{order.totalQuantity}
                      </div>
                      <Progress 
                        percent={getCompletionRate()} 
                        status={getProgressStatus()}
                        strokeColor={getCompletionRate() === 100 ? '#52c41a' : '#1890ff'}
                      />
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời gian" span={1}>
                    <div>
                      <div>Bắt đầu: {new Date(order.startDate).toLocaleDateString('vi-VN')}</div>
                      <div>Dự kiến kết thúc: {new Date(order.endDate).toLocaleDateString('vi-VN')}</div>
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Giờ công" span={1}>
                    <div>
                      <div>Dự kiến: {order.estimatedHours}h</div>
                      <div>Thực tế: {order.actualHours}h</div>
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Ghi chú" span={2}>
                    {order.notes || '-'}
                  </Descriptions.Item>
                </Descriptions>

                <Divider />

                <div>
                  <h3 className="text-lg font-medium mb-4">Tiến độ thực hiện</h3>
                  <Timeline items={timelineData} />
                </div>
              </Card>
            </TabPane>

            <TabPane tab="Sản phẩm" key="items">
              <Card>
                <Table
                  columns={itemsColumns}
                  dataSource={order.items}
                  rowKey="id"
                  pagination={false}
                  scroll={{ x: 800 }}
                />
              </Card>
            </TabPane>

            <TabPane tab="Vật tư" key="materials">
              <Card>
                <Table
                  columns={materialsColumns}
                  dataSource={order.materials}
                  rowKey="id"
                  pagination={false}
                  scroll={{ x: 800 }}
                />
              </Card>
            </TabPane>

            <TabPane tab="Kiểm tra chất lượng" key="quality">
              <Card>
                {order.qualityChecks.length > 0 ? (
                  <Table
                    columns={qualityColumns}
                    dataSource={order.qualityChecks}
                    rowKey="id"
                    pagination={false}
                    scroll={{ x: 800 }}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Chưa có bản kiểm tra chất lượng nào
                  </div>
                )}
              </Card>
            </TabPane>
          </Tabs>
        </Col>

        {/* Right Column - Statistics */}
        <Col xs={24} lg={8}>
          <Card title="Thống kê" className="mb-4">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Tỷ lệ hoàn thành"
                  value={getCompletionRate()}
                  suffix="%"
                  precision={1}
                  valueStyle={{ color: getCompletionRate() === 100 ? '#52c41a' : '#1890ff' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Hiệu suất"
                  value={order.actualHours > 0 ? Math.round((order.estimatedHours / order.actualHours) * 100) : 0}
                  suffix="%"
                  precision={1}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Col>
            </Row>
            
            <Divider />
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Số lượng hoàn thành:</span>
                <strong>{order.completedQuantity}/{order.totalQuantity}</strong>
              </div>
              <div className="flex justify-between">
                <span>Giờ công dự kiến:</span>
                <strong>{order.estimatedHours}h</strong>
              </div>
              <div className="flex justify-between">
                <span>Giờ công thực tế:</span>
                <strong>{order.actualHours}h</strong>
              </div>
              <div className="flex justify-between">
                <span>Đội sản xuất:</span>
                <strong>{order.assignedTeam}</strong>
              </div>
              <div className="flex justify-between">
                <span>Công đoạn:</span>
                <strong>{order.workCenters.length}</strong>
              </div>
            </div>
          </Card>

          <Card title="Công đoạn sản xuất">
            <div className="space-y-2">
              {order.workCenters.map((center, index) => (
                <Tag key={index} color="blue" className="mb-2">
                  {center}
                </Tag>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductionOrdersDetail;

