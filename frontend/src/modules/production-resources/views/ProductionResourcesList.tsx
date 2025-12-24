import { Button, Card, Space, Table, Tag, Typography, Tabs, Statistic, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { listProductionResources } from "../fake/production-resources.store";
import { PRODUCTION_RESOURCE_TYPES, PRODUCTION_RESOURCE_STATUS } from "../types";
import type { ProductionResourceEntity } from "../types";
import { useMemo } from "react";

export function ProductionResourcesList() {
  const navigate = useNavigate();
  const resources = listProductionResources();

  // Calculate statistics
  const stats = useMemo(() => {
    const total = resources.length;
    const active = resources.filter(r => r.status === 'ACTIVE').length;
    const maintenance = resources.filter(r => r.status === 'MAINTENANCE').length;
    const avgEfficiency = resources.reduce((sum, r) => sum + r.efficiency, 0) / total || 0;

    return {
      total,
      active,
      maintenance,
      avgEfficiency: Math.round(avgEfficiency)
    };
  }, [resources]);

  const columns = [
    {
      title: "Mã nguồn lực",
      dataIndex: "resourceCode",
      width: 140,
    },
    {
      title: "Tên nguồn lực",
      dataIndex: "resourceName",
      width: 200,
    },
    {
      title: "Loại",
      dataIndex: "resourceType",
      width: 120,
      render: (v: string) => {
        const type = PRODUCTION_RESOURCE_TYPES[v as keyof typeof PRODUCTION_RESOURCE_TYPES];
        return <Tag color={type.color}>{type.label}</Tag>;
      },
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      width: 100,
    },
    {
      title: "Công suất",
      dataIndex: "capacity",
      width: 100,
      align: "right" as const,
      render: (v: number, r: ProductionResourceEntity) => {
        if (!v) return "-";
        const unit = r.resourceType === 'WORKER' ? 'pcs/ngày' : r.resourceType === 'SPACE' ? 'm²' : 'pcs/h';
        return `${v.toLocaleString("vi-VN")} ${unit}`;
      },
    },
    {
      title: "Hiệu suất",
      dataIndex: "efficiency",
      width: 80,
      align: "right" as const,
      render: (v: number) => (
        <span className={v >= 90 ? 'text-green-600' : v >= 70 ? 'text-orange-600' : 'text-red-600'}>
          {v}%
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 120,
      render: (v: string) => {
        const status = PRODUCTION_RESOURCE_STATUS[v as keyof typeof PRODUCTION_RESOURCE_STATUS];
        return <Tag color={status.color}>{status.label}</Tag>;
      },
    },
    {
      title: "Địa điểm",
      dataIndex: "location",
      width: 150,
    },
    {
      title: "Chi phí/giờ",
      dataIndex: "costPerHour",
      width: 120,
      align: "right" as const,
      render: (v: number) => v ? `${v.toLocaleString("vi-VN")} VND` : "-",
    },
    {
      title: "Thao tác",
      width: 160,
      render: (_: any, r: ProductionResourceEntity) => (
        <Space>
          <Button 
            size="small"
            onClick={() => navigate(`/production/resources/${r.id}`)}
          >
            Xem
          </Button>
          <Button 
            size="small"
            onClick={() => navigate(`/production/resources/${r.id}/edit`)}
          >
            Sửa
          </Button>
        </Space>
      ),
    },
  ];

  const getResourceTypeData = () => {
    const typeCount = resources.reduce((acc, resource) => {
      acc[resource.resourceType] = (acc[resource.resourceType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(typeCount).map(([type, count]) => ({
      type: PRODUCTION_RESOURCE_TYPES[type as keyof typeof PRODUCTION_RESOURCE_TYPES].label,
      count,
      color: PRODUCTION_RESOURCE_TYPES[type as keyof typeof PRODUCTION_RESOURCE_TYPES].color
    }));
  };

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <Typography.Title level={3} style={{ margin: 0 }}>
        Nguồn lực sản xuất
      </Typography.Title>

      {/* Statistics Cards */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số nguồn lực"
              value={stats.total}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đang hoạt động"
              value={stats.active}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đang bảo trì"
              value={stats.maintenance}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Hiệu suất TB"
              value={stats.avgEfficiency}
              suffix="%"
              valueStyle={{ color: stats.avgEfficiency >= 85 ? '#52c41a' : '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Resource Type Overview */}
      <Card title="Phân loại nguồn lực">
        <Row gutter={16}>
          {getResourceTypeData().map((item, index) => (
            <Col span={4} key={index}>
              <div style={{ textAlign: 'center', padding: '16px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: item.color }}>
                  {item.count}
                </div>
                <div style={{ color: '#666' }}>{item.type}</div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Resources Table */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Typography.Title level={4} style={{ margin: 0 }}>
            Danh sách nguồn lực
          </Typography.Title>
          <Button 
            type="primary" 
            onClick={() => navigate('/production/resources/create')}
          >
            Thêm nguồn lực mới
          </Button>
        </div>
        <Table<ProductionResourceEntity>
          rowKey="id"
          dataSource={resources}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </Space>
  );
}
