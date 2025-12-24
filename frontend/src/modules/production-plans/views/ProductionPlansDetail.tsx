import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Button,
  Card,
  Descriptions,
  Space,
  Table,
  Tag,
  Typography,
  Progress,
  Statistic,
  Row,
  Col,
  Divider,
  Alert,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { getProductionPlan, updateProductionPlan } from "../fake/production-plans.store";
import { PRODUCTION_PLAN_STATUSES, PRODUCTION_PLAN_PRIORITIES } from "../types";
import type { ProductionPlanEntity } from "../types";

export function ProductionPlansDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<ProductionPlanEntity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundPlan = getProductionPlan(id);
      if (!foundPlan) {
        navigate("/production/plan");
        return;
      }
      setPlan(foundPlan);
    }
    setLoading(false);
  }, [id, navigate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getProgress = () => {
    if (!plan) return 0;
    return Math.round((plan.completedQuantity / plan.totalQuantity) * 100);
  };

  const getStatusColor = (status: string) => {
    return PRODUCTION_PLAN_STATUSES[status as keyof typeof PRODUCTION_PLAN_STATUSES]?.color || 'default';
  };

  const getPriorityColor = (priority: string) => {
    return PRODUCTION_PLAN_PRIORITIES[priority as keyof typeof PRODUCTION_PLAN_PRIORITIES]?.color || 'default';
  };

  const handleStatusChange = (newStatus: string) => {
    if (!plan) return;
    const updated = updateProductionPlan(plan.id, { status: newStatus as any });
    if (updated) {
      setPlan(updated);
    }
  };

  const itemColumns = [
    {
      title: "STT",
      key: "lineNo",
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      width: 180,
    },
    {
      title: "Style Code",
      dataIndex: "productStyleCode",
      width: 120,
    },
    {
      title: "Work Center",
      dataIndex: "workCenter",
      width: 120,
    },
    {
      title: "Số lượng kế hoạch",
      dataIndex: "plannedQuantity",
      width: 130,
      align: "right" as const,
      render: (v: number) => v.toLocaleString("vi-VN"),
    },
    {
      title: "Số lượng thực tế",
      dataIndex: "actualQuantity",
      width: 130,
      align: "right" as const,
      render: (v: number) => v.toLocaleString("vi-VN"),
    },
    {
      title: "Tiến độ",
      key: "progress",
      width: 120,
      render: (_: any, record: any) => {
        const percent = Math.round((record.actualQuantity / record.plannedQuantity) * 100);
        return <Progress percent={percent} size="small" status={record.status === 'COMPLETED' ? 'success' : 'active'} />;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 120,
      render: (v: string) => {
        const status = v === 'PENDING' ? 'Chờ xử lý' : v === 'IN_PROGRESS' ? 'Đang thực hiện' : 'Hoàn thành';
        const color = v === 'PENDING' ? 'default' : v === 'IN_PROGRESS' ? 'blue' : 'green';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Giờ ước tính",
      dataIndex: "estimatedHours",
      width: 110,
      align: "right" as const,
      render: (v: number) => `${v}h`,
    },
    {
      title: "Giờ thực tế",
      dataIndex: "actualHours",
      width: 110,
      align: "right" as const,
      render: (v: number) => `${v}h`,
    },
  ];

  const breakdownColumns = [
    {
      title: "Size",
      dataIndex: "sizeCode",
      width: 80,
    },
    {
      title: "Color",
      dataIndex: "colorCode",
      width: 100,
    },
    {
      title: "Kế hoạch",
      dataIndex: "plannedQty",
      width: 100,
      align: "right" as const,
      render: (v: number) => v.toLocaleString("vi-VN"),
    },
    {
      title: "Thực tế",
      dataIndex: "actualQty",
      width: 100,
      align: "right" as const,
      render: (v: number) => v.toLocaleString("vi-VN"),
    },
    {
      title: "Work Station",
      dataIndex: "workStation",
      width: 140,
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (!plan) return <div>Không tìm thấy kế hoạch</div>;

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <Space>
            <Link to="/production/plan">
              <Button icon={<ArrowLeftOutlined />}>Quay lại</Button>
            </Link>
            <Title level={3} style={{ margin: 0 }}>
              {plan.planNo} - {plan.planName}
            </Title>
          </Space>
          <Space>
            <Button 
              icon={<EditOutlined />} 
              onClick={() => navigate(`/production/plan/${plan.id}/edit`)}
            >
              Chỉnh sửa
            </Button>
          </Space>
        </div>

        {/* Overview Cards */}
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tiến độ tổng thể"
                value={getProgress()}
                suffix="%"
                valueStyle={{ color: getProgress() === 100 ? '#3f8600' : '#1890ff' }}
              />
              <Progress 
                percent={getProgress()} 
                status={plan.status === 'COMPLETED' ? 'success' : 'active'}
                showInfo={false}
                className="mt-2"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Sản phẩm hoàn thành"
                value={plan.completedQuantity}
                suffix={`/${plan.totalQuantity}`}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Số hạng mục"
                value={plan.items.length}
                suffix="items"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Trạng thái</div>
                <Tag color={getStatusColor(plan.status)} style={{ fontSize: '14px' }}>
                  {PRODUCTION_PLAN_STATUSES[plan.status].label}
                </Tag>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Plan Information */}
        <Card title="Thông tin kế hoạch">
          <Descriptions column={3}>
            <Descriptions.Item label="Mã kế hoạch">{plan.planNo}</Descriptions.Item>
            <Descriptions.Item label="Tên kế hoạch">{plan.planName}</Descriptions.Item>
            <Descriptions.Item label="Khách hàng">{plan.customerName || "-"}</Descriptions.Item>
            <Descriptions.Item label="Ngày bắt đầu">{formatDate(plan.startDate)}</Descriptions.Item>
            <Descriptions.Item label="Ngày kết thúc">{formatDate(plan.endDate)}</Descriptions.Item>
            <Descriptions.Item label="Độ ưu tiên">
              <Tag color={getPriorityColor(plan.priority)}>
                {PRODUCTION_PLAN_PRIORITIES[plan.priority].label}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả" span={3}>{plan.description}</Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Items Table */}
        <Card title="Danh sách sản phẩm sản xuất">
          <Table
            dataSource={plan.items}
            columns={itemColumns}
            rowKey="id"
            pagination={false}
            expandable={{
              expandedRowRender: (record) => (
                <div className="p-4">
                  <Title level={5}>Chi tiết breakdown</Title>
                  <Table
                    dataSource={record.breakdowns}
                    columns={breakdownColumns}
                    rowKey="id"
                    pagination={false}
                    size="small"
                  />
                </div>
              ),
            }}
          />
        </Card>

        {/* Status Change Actions */}
        {plan.status !== 'COMPLETED' && (
          <Card title="Thao tác">
            <Space>
              {plan.status === 'PLANNED' && (
                <Button 
                  type="primary" 
                  icon={<ClockCircleOutlined />}
                  onClick={() => handleStatusChange('IN_PROGRESS')}
                >
                  Bắt đầu thực hiện
                </Button>
              )}
              {plan.status === 'IN_PROGRESS' && (
                <Button 
                  type="primary" 
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleStatusChange('COMPLETED')}
                >
                  Hoàn thành kế hoạch
                </Button>
              )}
              <Button 
                danger
                onClick={() => handleStatusChange('CANCELLED')}
              >
                Hủy kế hoạch
              </Button>
            </Space>
          </Card>
        )}
      </Space>
    </div>
  );
}

const { Title } = Typography;
