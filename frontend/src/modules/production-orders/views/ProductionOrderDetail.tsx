import {
  Card,
  Descriptions,
  Divider,
  InputNumber,
  Space,
  Table,
  Tag,
  Typography,
  Select,
} from "antd";
import { useParams, Link } from "react-router-dom";
import {
  getProductionOrder,
  updateMoQtyDone,
  updateProductionOrderStatus,
} from "../fake/production-orders.store";

export function ProductionOrderDetail() {
  const { id } = useParams();
  const mo = id ? getProductionOrder(id) : null;

  if (!mo) return <Card>Không tìm thấy lệnh sản xuất</Card>;

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Typography.Title level={3} style={{ margin: 0 }}>
          {mo.moNo}
        </Typography.Title>

        <Space>
          <Select
            value={mo.status}
            style={{ width: 180 }}
            onChange={(v) => updateProductionOrderStatus(mo.id, v)}
            options={[
              { value: "DRAFT", label: "DRAFT" },
              { value: "RELEASED", label: "RELEASED" },
              { value: "RUNNING", label: "RUNNING" },
              { value: "DONE", label: "DONE" },
              { value: "CANCELLED", label: "CANCELLED" },
            ]}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Qty done</span>
            <InputNumber
              min={0}
              max={Number(mo.qtyPlan)}
              value={Number(mo.qtyDone)}
              onChange={(v) => updateMoQtyDone(mo.id, Number(v || 0))}
            />
          </div>
        </Space>
      </div>

      <Card>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Trạng thái">
            <Tag>{mo.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="SO">
            {mo.salesOrderId ? (
              <Link to={`/sales-orders/${mo.salesOrderId}`}>
                {mo.soOrderNo ?? "Sales Order"}
              </Link>
            ) : (
              "-"
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Sản phẩm" span={2}>
            {mo.productStyleName}
          </Descriptions.Item>

          <Descriptions.Item label="Kế hoạch">{mo.qtyPlan}</Descriptions.Item>
          <Descriptions.Item label="Hoàn thành">{mo.qtyDone}</Descriptions.Item>
        </Descriptions>

        <Divider />

        <Typography.Title level={5} style={{ marginTop: 0 }}>
          Breakdown (Size/Color)
        </Typography.Title>

        <Table
          size="small"
          rowKey="id"
          pagination={false}
          dataSource={mo.breakdowns}
          columns={[
            { title: "Size", dataIndex: "sizeCode", width: 120 },
            { title: "Color", dataIndex: "colorCode", width: 160 },
            { title: "VariantId", dataIndex: "productVariantId" },
            {
              title: "Qty plan",
              dataIndex: "qtyPlan",
              align: "right",
              width: 140,
            },
            {
              title: "Qty done",
              dataIndex: "qtyDone",
              align: "right",
              width: 140,
            },
          ]}
        />

        <Divider />

        <Typography.Title level={5} style={{ marginTop: 0 }}>
          Material Requirements (mock theo BOM)
        </Typography.Title>

        <Table
          size="small"
          rowKey="id"
          pagination={false}
          dataSource={mo.materialRequirements}
          columns={[
            { title: "SKU", dataIndex: "itemSku", width: 120 },
            { title: "Vật tư", dataIndex: "itemName" },
            {
              title: "Loại",
              dataIndex: "itemType",
              width: 120,
              render: (v) => <Tag>{v}</Tag>,
            },
            { title: "UOM", dataIndex: "uom", width: 90 },
            {
              title: "Req",
              dataIndex: "qtyRequired",
              align: "right",
              width: 120,
            },
            {
              title: "Issued",
              dataIndex: "qtyIssued",
              align: "right",
              width: 120,
            },
            {
              title: "Wastage %",
              dataIndex: "wastagePercent",
              align: "right",
              width: 120,
            },
          ]}
        />
      </Card>
    </Space>
  );
}
