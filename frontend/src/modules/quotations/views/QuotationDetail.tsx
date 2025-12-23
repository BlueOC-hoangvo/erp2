import {
  Button,
  Card,
  Descriptions,
  Divider,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { URLS } from "@/routes/urls";
import {
  deleteQuotation,
  getQuotation,
  type QuotationItem,
} from "../fake/quotations.store";
import { createSalesOrderFromQuotation } from "@/modules/sales-orders/fake/sales-orders.store";

function money(n: number) {
  return (n || 0).toLocaleString("vi-VN") + " VND";
}

export default function QuotationDetail() {
  const { id } = useParams();
  const nav = useNavigate();

  const q = id ? getQuotation(id) : null;

  const columns: ColumnsType<QuotationItem> = useMemo(
    () => [
      {
        title: "SKU",
        dataIndex: "productSku",
        key: "productSku",
        width: 140,
        render: (v) => v ?? "-",
      },
      { title: "Sản phẩm", dataIndex: "productName", key: "productName" },
      { title: "SL", dataIndex: "qty", key: "qty", width: 100, align: "right" },
      {
        title: "Đơn giá",
        dataIndex: "unitPrice",
        key: "unitPrice",
        width: 160,
        align: "right",
        render: (_, r) => money(r.unitPrice),
      },
      {
        title: "Thành tiền",
        dataIndex: "lineTotal",
        key: "lineTotal",
        width: 180,
        align: "right",
        render: (_, r) => (
          <span className="font-semibold">{money(r.lineTotal)}</span>
        ),
      },
    ],
    []
  );

  if (!q) {
    return (
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Chi tiết báo giá
        </Typography.Title>
        <Card>Không tìm thấy báo giá.</Card>
      </Space>
    );
  }

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <Typography.Title level={3} style={{ margin: 0 }}>
          {q.code}
        </Typography.Title>

        <Space>
          <Button onClick={() => nav(URLS.SALES_QUOTATION_EDIT(q.id))}>
            Sửa
          </Button>
          <Button
            danger
            onClick={() => {
              const ok = confirm(`Xóa báo giá ${q.code}?`);
              if (!ok) return;
              deleteQuotation(q.id);
              nav(URLS.SALES_QUOTATIONS);
            }}
          >
            Xóa
          </Button>
          {/* Nút này mình sẽ làm LUỒNG ở bước tiếp theo */}
          <Button
            type="primary"
            onClick={() => {
              const so = createSalesOrderFromQuotation({
                id: q.id,
                code: q.code,
                customerId: q.customerId,
                customerName: q.customerName,
                subtotal: q.subtotal,
                discountAmount: q.discountAmount,
                total: q.total,
                items: q.items,
              });

              nav(`/sales-orders/${so.id}`);
            }}
          >
            Tạo đơn hàng
          </Button>
        </Space>
      </div>

      <Card>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Khách hàng">
            {q.customerName}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag>{q.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Hạn báo giá">
            {q.validUntil
              ? new Date(q.validUntil).toLocaleDateString("vi-VN")
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {new Date(q.createdAt).toLocaleString("vi-VN")}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Table
          rowKey="id"
          columns={columns}
          dataSource={q.items}
          pagination={false}
        />

        <Divider />

        <div className="flex justify-end">
          <div className="w-full max-w-sm space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Tạm tính</span>
              <span>{money(q.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Chiết khấu</span>
              <span>- {money(q.discountAmount)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Tổng</span>
              <span>{money(q.total)}</span>
            </div>
          </div>
        </div>
      </Card>
    </Space>
  );
}
