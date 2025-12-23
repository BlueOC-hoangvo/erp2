import { Button, Card, Space, Table, Tag, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { listSalesOrders } from "../fake/sales-orders.store";
import type { SalesOrderEntity } from "../fake/sales-orders.store";

export function SalesOrdersList() {
  const nav = useNavigate();
  const data = listSalesOrders();

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <Typography.Title level={3} style={{ margin: 0 }}>
        Đơn hàng
      </Typography.Title>

      <Card>
        <Table<SalesOrderEntity>
          rowKey="id"
          dataSource={data}
          columns={[
            { title: "Mã", dataIndex: "code", width: 160 },
            { title: "Khách hàng", dataIndex: "customerName" },
            {
              title: "Trạng thái",
              dataIndex: "status",
              width: 140,
              render: (v) => <Tag>{v}</Tag>,
            },
            {
              title: "Tổng",
              dataIndex: "total",
              align: "right",
              render: (v) => <b>{v.toLocaleString("vi-VN")} VND</b>,
            },
            {
              title: "",
              width: 120,
              render: (_, r) => (
                <Button onClick={() => nav(`/sales-orders/${r.id}`)}>
                  Xem
                </Button>
              ),
            },
          ]}
        />
      </Card>
    </Space>
  );
}
