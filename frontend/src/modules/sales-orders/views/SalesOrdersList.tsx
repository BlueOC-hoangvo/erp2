import { Button, Card, Space, Table, Tag, Typography } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { listSalesOrders, initializeDemoData } from "../fake/sales-orders.store";
import type { SalesOrderEntity } from "../fake/sales-orders.store";
import { useEffect } from "react";

export function SalesOrdersList() {
  const nav = useNavigate();
  const data = listSalesOrders();

  useEffect(() => {
    // Initialize demo data if no data exists
    initializeDemoData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <div className="flex items-center justify-between">
        <Typography.Title level={3} style={{ margin: 0 }}>
          Đơn hàng
        </Typography.Title>
        <Button type="primary" onClick={() => nav("/sales-orders/create")}>
          Tạo đơn hàng mới
        </Button>
      </div>

      <Card>
        <Table<SalesOrderEntity>
          rowKey="id"
          dataSource={data}
          columns={[
            {
              title: "Mã đơn hàng",
              dataIndex: "orderNo",
              width: 160,
              render: (v, r) => (
                <Link to={`/sales-orders/${r.id}`} className="font-medium text-blue-600">
                  {v}
                </Link>
              ),
            },
            {
              title: "Khách hàng",
              dataIndex: "customerName",
              width: 200,
            },
            {
              title: "Ngày đặt hàng",
              dataIndex: "orderDate",
              width: 120,
              render: (v) => formatDate(v),
            },
            {
              title: "Ngày giao",
              dataIndex: "dueDate",
              width: 120,
              render: (v) => v ? formatDate(v) : "-",
            },
            {
              title: "Trạng thái",
              dataIndex: "status",
              width: 140,
              render: (v) => (
                <Tag color={
                  v === "DRAFT" ? "default" :
                  v === "CONFIRMED" ? "blue" :
                  v === "IN_PRODUCTION" ? "orange" :
                  v === "DONE" ? "green" :
                  "red"
                }>
                  {v}
                </Tag>
              ),
            },
            {
              title: "Thao tác",
              width: 160,
              render: (_, r) => (
                <Space>
                  <Button onClick={() => nav(`/sales-orders/${r.id}`)}>
                    Xem
                  </Button>
                  <Button 
                    onClick={() => nav(`/sales-orders/${r.id}/edit`)}
                    type="link"
                  >
                    Sửa
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Card>
    </Space>
  );
}
