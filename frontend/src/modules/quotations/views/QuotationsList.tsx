import { Button, Card, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { URLS } from "@/routes/urls";
import { listQuotations, type QuotationEntity } from "../fake/quotations.store";

function money(n: number) {
  return (n || 0).toLocaleString("vi-VN") + " VND";
}

function statusTag(s: QuotationEntity["status"]) {
  const map: Record<string, { color: string; label: string }> = {
    draft: { color: "default", label: "Draft" },
    sent: { color: "blue", label: "Sent" },
    accepted: { color: "green", label: "Accepted" },
    rejected: { color: "red", label: "Rejected" },
    expired: { color: "orange", label: "Expired" },
  };
  const m = map[s] ?? { color: "default", label: s };
  return <Tag color={m.color}>{m.label}</Tag>;
}

export default function QuotationsList() {
  const nav = useNavigate();
  const data = listQuotations();

  const columns: ColumnsType<QuotationEntity> = useMemo(
    () => [
      { title: "Mã", dataIndex: "code", key: "code", width: 160 },
      { title: "Khách hàng", dataIndex: "customerName", key: "customerName" },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        width: 140,
        render: (_, r) => statusTag(r.status),
      },
      {
        title: "Tổng",
        dataIndex: "total",
        key: "total",
        width: 160,
        align: "right",
        render: (_, r) => (
          <span className="font-semibold">{money(r.total)}</span>
        ),
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 180,
        render: (_, r) => new Date(r.createdAt).toLocaleString("vi-VN"),
      },
      {
        title: "",
        key: "action",
        width: 160,
        render: (_, r) => (
          <Space>
            <Button onClick={() => nav(URLS.SALES_QUOTATION_DETAIL(r.id))}>
              Xem
            </Button>
            <Button
              type="primary"
              onClick={() => nav(URLS.SALES_QUOTATION_EDIT(r.id))}
            >
              Sửa
            </Button>
          </Space>
        ),
      },
    ],
    [nav]
  );

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <Typography.Title level={3} style={{ margin: 0 }}>
          Báo giá
        </Typography.Title>

        <Button type="primary" onClick={() => nav(URLS.SALES_QUOTATION_CREATE)}>
          + Tạo báo giá
        </Button>
      </div>

      <Card>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </Space>
  );
}
