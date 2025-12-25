import { useState } from 'react';
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
import { PRODUCTION_ORDER_STATUSES } from '../types';
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



  const getCompletionRate = () => {
    return order.qtyPlan > 0 
      ? Math.round((Number(order.qtyCompleted) / Number(order.qtyPlan)) * 100)
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
          <div className="text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : '-'}</div>
        </div>
      )
    },
    ...(order.status === 'DONE' ? [{
      color: 'green',
      dot: <TrophyOutlined />,
      children: (
        <div>
          <div className="font-medium">Hoàn thành lệnh sản xuất</div>
          <div className="text-gray-500">{order.updatedAt ? new Date(order.updatedAt).toLocaleString('vi-VN') : '-'}</div>
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
              Lệnh sản xuất: {order.moNo}
            </h1>
            <div className="flex items-center space-x-2">
              <Tag color={getStatusColor(order.status)}>
                {PRODUCTION_ORDER_STATUSES.find(s => s.key === order.status)?.label}
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
        description={`Đã hoàn thành ${Number(order.qtyCompleted)}/${Number(order.qtyPlan)} sản phẩm`}
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
                    <strong>{order.moNo}</strong>
                  </Descriptions.Item>
                  <Descriptions.Item label="Sản phẩm" span={1}>
                    <div>
                      <div className="font-medium">{order.productStyle?.name || '-'}</div>
                      <div className="text-gray-500">{order.productStyle?.code || '-'}</div>
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Sales Order Item ID" span={1}>
                    {order.salesOrderItemId || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số lượng" span={1}>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {Number(order.qtyCompleted)}/{Number(order.qtyPlan)}
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
                      <div>Bắt đầu: {order.startDate ? new Date(order.startDate).toLocaleDateString('vi-VN') : '-'}</div>
                      <div>Dự kiến kết thúc: {order.dueDate ? new Date(order.dueDate).toLocaleDateString('vi-VN') : '-'}</div>
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Ghi chú" span={1}>
                    {order.note || '-'}
                  </Descriptions.Item>
                </Descriptions>

                <Divider />

                <div>
                  <h3 className="text-lg font-medium mb-4">Tiến độ thực hiện</h3>
                  <Timeline items={timelineData} />
                </div>
              </Card>
            </TabPane>

            <TabPane tab="Breakdown" key="items">
              <Card>
                <Table
                  columns={[
                    { title: "Size", dataIndex: "sizeCode", width: 120 },
                    { title: "Color", dataIndex: "colorCode", width: 160 },
                    { title: "VariantId", dataIndex: "productVariantId" },
                    {
                      title: "Qty plan",
                      dataIndex: "qtyPlan",
                      align: "right" as const,
                      width: 140,
                    },
                    {
                      title: "Qty done",
                      dataIndex: "qtyCompleted",
                      align: "right" as const,
                      width: 140,
                    },
                  ]}
                  dataSource={order.breakdowns || []}
                  rowKey="id"
                  pagination={false}
                  scroll={{ x: 800 }}
                />
              </Card>
            </TabPane>

            <TabPane tab="Vật tư" key="materials">
              <Card>
                <Table
                  columns={[
                    { title: "SKU", dataIndex: "itemSku", width: 120 },
                    { title: "Vật tư", dataIndex: "itemName" },
                    {
                      title: "Loại",
                      dataIndex: "itemType",
                      width: 120,
                      render: (v: string) => <Tag>{v}</Tag>,
                    },
                    { title: "UOM", dataIndex: "uom", width: 90 },
                    {
                      title: "Req",
                      dataIndex: "qtyRequired",
                      align: "right" as const,
                      width: 120,
                    },
                    {
                      title: "Issued",
                      dataIndex: "qtyIssued",
                      align: "right" as const,
                      width: 120,
                    },
                    {
                      title: "Wastage %",
                      dataIndex: "wastagePercent",
                      align: "right" as const,
                      width: 120,
                    },
                  ]}
                  dataSource={order.materialRequirements || []}
                  rowKey="id"
                  pagination={false}
                  scroll={{ x: 800 }}
                />
              </Card>
            </TabPane>

            <TabPane tab="Kiểm tra chất lượng" key="quality">
              <Card>
                <div className="text-center py-8 text-gray-500">
                  Chưa có bản kiểm tra chất lượng nào
                </div>
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
                  title="Trạng thái"
                  value={order.status}
                  valueStyle={{ color: getStatusColor(order.status) }}
                />
              </Col>
            </Row>
            
            <Divider />
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Số lượng hoàn thành:</span>
                <strong>{Number(order.qtyCompleted)}/{Number(order.qtyPlan)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Product Style ID:</span>
                <strong>{order.productStyleId}</strong>
              </div>
              <div className="flex justify-between">
                <span>Breakdown Items:</span>
                <strong>{order.breakdowns?.length || 0}</strong>
              </div>
              <div className="flex justify-between">
                <span>Material Requirements:</span>
                <strong>{order.materialRequirements?.length || 0}</strong>
              </div>
              <div className="flex justify-between">
                <span>Created:</span>
                <strong>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : '-'}</strong>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductionOrdersDetail;

