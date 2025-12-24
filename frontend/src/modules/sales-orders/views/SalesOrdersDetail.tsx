import {
  Card,
  Descriptions,
  Divider,
  Space,
  Table,
  Tag,
  Typography,
  Button,
  Select,
} from "antd";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getSalesOrder,
  updateSalesOrderStatus,
} from "../fake/sales-orders.store";
// import { createMoFromSalesOrderItem } from "@/modules/production-orders/fake/production-orders.store";

export function SalesOrdersDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const so = id ? getSalesOrder(id) : null;

  if (!so) return <Card>Không tìm thấy đơn hàng</Card>;

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Typography.Title level={3} style={{ margin: 0 }}>
          {so.orderNo}
        </Typography.Title>

        <Space>
          <Select
            value={so.status}
            style={{ width: 180 }}
            onChange={(v) => updateSalesOrderStatus(so.id, v)}
            options={[
              { value: "DRAFT", label: "DRAFT" },
              { value: "CONFIRMED", label: "CONFIRMED" },
              { value: "IN_PRODUCTION", label: "IN_PRODUCTION" },
              { value: "DONE", label: "DONE" },
              { value: "CANCELLED", label: "CANCELLED" },
            ]}
            disabled={so.status === "DONE" || so.status === "CANCELLED"}
          />
          {/* bước kế tiếp mình sẽ làm: tạo MO từ SO */}
          {so.status === "CONFIRMED" && (
            <Button
              type="primary"
              onClick={() => {
                // TODO: Implement MO creation
                // const created = so.items.map((it) =>
                //   createMoFromSalesOrderItem({
                //     salesOrderId: so.id,
                //     soOrderNo: so.orderNo,
                //     salesOrderItemId: it.id,
                //     productStyleId: it.productStyleId,
                //     productStyleCode: it.productStyleCode,
                //     productStyleName: it.itemName,
                //     qtyPlan: it.qtyTotal,
                //     dueDate: so.dueDate,
                //     breakdowns: it.breakdowns.map((b) => ({
                //       productVariantId: b.productVariantId,
                //       sizeCode: b.sizeCode,
                //       colorCode: b.colorCode,
                //       qty: b.qty,
                //     })),
                //   })
                // );

                // mở detail MO đầu tiên cho nhanh
                // const first = created[0];
                // if (first) nav(`/production/orders/${first.id}`);
                alert("Tính năng tạo lệnh sản xuất đang được phát triển");
              }}
            >
              Tạo lệnh sản xuất
            </Button>
          )}
        </Space>
      </div>

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
          rowKey="id"
          dataSource={so.items}
          pagination={false}
          columns={[
            { title: "Line", dataIndex: "lineNo", width: 80 },
            {
              title: "Style",
              dataIndex: "productStyleCode",
              width: 140,
              render: (v) => v ?? "-",
            },
            { title: "Mặt hàng", dataIndex: "itemName" },
            {
              title: "SL tổng",
              dataIndex: "qtyTotal",
              align: "right",
              width: 120,
            },
            {
              title: "Đơn giá",
              dataIndex: "unitPrice",
              align: "right",
              width: 160,
              render: (v) => Number(v || 0).toLocaleString("vi-VN"),
            },
            {
              title: "Thành tiền",
              dataIndex: "amount",
              align: "right",
              width: 180,
              render: (v) => (
                <b>{Number(v || 0).toLocaleString("vi-VN")} VND</b>
              ),
            },
          ]}
          expandable={{
            expandedRowRender: (r) => (
              <div className="p-2">
                <div className="text-sm font-semibold mb-2">
                  Breakdown Size/Color
                </div>
                <Table
                  size="small"
                  rowKey="id"
                  pagination={false}
                  dataSource={r.breakdowns}
                  columns={[
                    { title: "Size", dataIndex: "sizeCode", width: 120 },
                    { title: "Color", dataIndex: "colorCode", width: 160 },
                    { title: "VariantId", dataIndex: "productVariantId" },
                    {
                      title: "Qty",
                      dataIndex: "qty",
                      align: "right",
                      width: 120,
                    },
                  ]}
                />
              </div>
            ),
          }}
        />
      </Card>
    </Space>
  );
}
