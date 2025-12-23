import { Button, Card, Space, Table, Tag, Typography, Row, Col, Statistic } from "antd";
import { useNavigate } from "react-router-dom";
import { listWarehouseInRecords } from "../fake/warehouse-in.store";
import { WAREHOUSE_IN_TYPES, WAREHOUSE_IN_STATUS } from "../types";
import type { WarehouseInEntity } from "../types";

export function WarehouseInList() {
  const navigate = useNavigate();
  const records = listWarehouseInRecords();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const columns = [
    {
      title: "Số phiếu nhập",
      dataIndex: "inNo",
      width: 140,
      render: (v: string, r: WarehouseInEntity) => (
        <Button type="link" onClick={() => navigate(`/warehouse/in/${r.id}`)}>
          {v}
        </Button>
      ),
    },
    {
      title: "Loại nhập",
      dataIndex: "inType",
      width: 120,
      render: (v: string) => {
        const type = WAREHOUSE_IN_TYPES[v as keyof typeof WAREHOUSE_IN_TYPES];
        return <Tag color={type.color}>{type.label}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 120,
      render: (v: string) => {
        const status = WAREHOUSE_IN_STATUS[v as keyof typeof WAREHOUSE_IN_STATUS];
        return <Tag color={status.color}>{status.label}</Tag>;
      },
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplierName",
      width: 150,
      render: (v: string) => v || "-",
    },
    {
      title: "Ngày nhập",
      dataIndex: "inDate",
      width: 100,
      render: (v: string) => formatDate(v),
    },
    {
      title: "Kho nhập",
      dataIndex: "warehouse",
      width: 100,
    },
    {
      title: "Khu vực",
      dataIndex: "area",
      width: 100,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      width: 120,
      align: "right" as const,
      render: (v: number) => `${v.toLocaleString("vi-VN")} VND`,
    },
    {
      title: "Người tạo",
      dataIndex: "createdBy",
      width: 120,
    },
    {
      title: "Thao tác",
      width: 160,
      render: (_: any, r: WarehouseInEntity) => (
        <Space>
          <Button 
            size="small"
            onClick={() => navigate(`/warehouse/in/${r.id}`)}
          >
            Xem
          </Button>
          <Button 
            size="small"
            onClick={() => navigate(`/warehouse/in/${r.id}/edit`)}
          >
            Sửa
          </Button>
        </Space>
      ),
    },
  ];

  const stats = {
    total: records.length,
    received: records.filter((r: any) => r.status === 'RECEIVED').length,
    pending: records.filter((r: any) => r.status === 'SUBMITTED' || r.status === 'APPROVED').length,
    totalAmount: records.reduce((sum: number, r: any) => sum + r.totalAmount, 0)
  };

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <Typography.Title level={3} style={{ margin: 0 }}>
        Quản lý nhập kho
      </Typography.Title>

      {/* Statistics */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="Tổng phiếu nhập" value={stats.total} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Đã nhận" value={stats.received} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Chờ xử lý" value={stats.pending} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Tổng giá trị" value={stats.totalAmount} suffix="VND" precision={0} valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>
      </Row>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <Typography.Title level={4} style={{ margin: 0 }}>
            Danh sách phiếu nhập
          </Typography.Title>
          <Button 
            type="primary" 
            onClick={() => navigate('/warehouse/in/create')}
          >
            Tạo phiếu nhập mới
          </Button>
        </div>

        <Table<WarehouseInEntity>
          rowKey="id"
          dataSource={records}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </Space>
  );
}

