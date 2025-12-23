import {
  Card,
  Descriptions,
  Divider,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { useParams, Link } from "react-router-dom";
import { getSalesOrder } from "../fake/sales-orders.store";

export function SalesOrdersDetail() {
  const { id } = useParams();
  const so = id ? getSalesOrder(id) : null;

  if (!so) {
    return <Card>Không tìm thấy đơn hàng</Card>;
  }

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <Typography.Title level={3}>{so.code}</Typography.Title>

      <Card>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Khách hàng">
            {so.customerName}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag>{so.status}</Tag>
          </Descriptions.Item>

          {so.quotationId && (
            <Descriptions.Item label="Báo giá" span={2}>
              <Link to={`/sales/quotations/${so.quotationId}`}>
                {so.quotationCode}
              </Link>
            </Descriptions.Item>
          )}
        </Descriptions>

        <Divider />

        <Table
          pagination={false}
          rowKey="id"
          dataSource={so.items}
          columns={[
            { title: "SKU", dataIndex: "productSku", width: 140 },
            { title: "Sản phẩm", dataIndex: "productName" },
            { title: "SL", dataIndex: "qty", align: "right", width: 100 },
            {
              title: "Đơn giá",
              dataIndex: "unitPrice",
              align: "right",
              width: 160,
              render: (v) => v.toLocaleString("vi-VN"),
            },
            {
              title: "Thành tiền",
              dataIndex: "lineTotal",
              align: "right",
              width: 180,
              render: (v) => <b>{v.toLocaleString("vi-VN")} VND</b>,
            },
          ]}
        />

        <Divider />

        <div className="flex justify-end">
          <div className="w-80 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span>{so.subtotal.toLocaleString("vi-VN")} VND</span>
            </div>
            <div className="flex justify-between">
              <span>Chiết khấu</span>
              <span>- {so.discountAmount.toLocaleString("vi-VN")} VND</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Tổng</span>
              <span>{so.total.toLocaleString("vi-VN")} VND</span>
            </div>
          </div>
        </div>
      </Card>
    </Space>
  );
}
