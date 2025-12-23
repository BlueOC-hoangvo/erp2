import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Table,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { URLS } from "@/routes/urls";
import {
  getQuotation,
  upsertQuotation,
  type QuotationStatus,
} from "../fake/quotations.store";

type Row = {
  key: string;
  productSku?: string;
  productName: string;
  qty: number;
  unitPrice: number;
};

function money(n: number) {
  return (n || 0).toLocaleString("vi-VN");
}

export default function QuotationForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const nav = useNavigate();

  const editing = id ? getQuotation(id) : null;

  const [code, setCode] = useState(editing?.code ?? "");
  const [customerName, setCustomerName] = useState(editing?.customerName ?? "");
  const [status, setStatus] = useState<QuotationStatus>(
    editing?.status ?? "draft"
  );
  const [validUntil, setValidUntil] = useState<string>(
    editing?.validUntil ? editing.validUntil.slice(0, 10) : ""
  );
  const [discountAmount, setDiscountAmount] = useState<number>(
    editing?.discountAmount ?? 0
  );

  const [rows, setRows] = useState<Row[]>(
    editing?.items?.length
      ? editing.items.map((it) => ({
          key: it.id,
          productSku: it.productSku,
          productName: it.productName,
          qty: it.qty,
          unitPrice: it.unitPrice,
        }))
      : [{ key: "row1", productSku: "", productName: "", qty: 1, unitPrice: 0 }]
  );

  // generate code once (no Date.now in render)
  useEffect(() => {
    if (isEdit) return;
    if (code) return;
    const year = new Date().getFullYear();
    setCode(`Q-${year}-0001`);
  }, [isEdit, code]);

  const computed = useMemo(() => {
    const lineTotals = rows.map(
      (r) => (Number(r.qty) || 0) * (Number(r.unitPrice) || 0)
    );
    const subtotal = lineTotals.reduce((a, b) => a + b, 0);
    const discount = Number(discountAmount) || 0;
    const total = Math.max(0, subtotal - discount);
    return { subtotal, total, lineTotals };
  }, [rows, discountAmount]);

  const columns: ColumnsType<Row> = useMemo(
    () => [
      {
        title: "SKU",
        dataIndex: "productSku",
        key: "productSku",
        width: 160,
        render: (_, r, idx) => (
          <Input
            value={r.productSku}
            onChange={(e) =>
              setRows((s) => {
                const next = [...s];
                next[idx] = { ...next[idx], productSku: e.target.value };
                return next;
              })
            }
          />
        ),
      },
      {
        title: "Sản phẩm",
        dataIndex: "productName",
        key: "productName",
        render: (_, r, idx) => (
          <Input
            value={r.productName}
            onChange={(e) =>
              setRows((s) => {
                const next = [...s];
                next[idx] = { ...next[idx], productName: e.target.value };
                return next;
              })
            }
          />
        ),
      },
      {
        title: "SL",
        dataIndex: "qty",
        key: "qty",
        width: 120,
        align: "right",
        render: (_, r, idx) => (
          <InputNumber
            style={{ width: "100%" }}
            value={r.qty}
            min={0}
            onChange={(v) =>
              setRows((s) => {
                const next = [...s];
                next[idx] = { ...next[idx], qty: Number(v ?? 0) };
                return next;
              })
            }
          />
        ),
      },
      {
        title: "Đơn giá",
        dataIndex: "unitPrice",
        key: "unitPrice",
        width: 160,
        align: "right",
        render: (_, r, idx) => (
          <InputNumber
            style={{ width: "100%" }}
            value={r.unitPrice}
            min={0}
            formatter={(v) => money(Number(v || 0))}
            parser={(v) => Number(String(v || "0").replace(/[^\d]/g, ""))}
            onChange={(v) =>
              setRows((s) => {
                const next = [...s];
                next[idx] = { ...next[idx], unitPrice: Number(v ?? 0) };
                return next;
              })
            }
          />
        ),
      },
      {
        title: "Thành tiền",
        key: "lineTotal",
        width: 180,
        align: "right",
        render: (_, __, idx) => <b>{money(computed.lineTotals[idx])} VND</b>,
      },
      {
        title: "",
        key: "actions",
        width: 90,
        render: (_, r) => (
          <Button
            danger
            disabled={rows.length <= 1}
            onClick={() => setRows((s) => s.filter((x) => x.key !== r.key))}
          >
            Xóa
          </Button>
        ),
      },
    ],
    [rows.length, computed.lineTotals]
  );

  const onSave = () => {
    const payload = {
      id: isEdit ? String(id) : `q_${Math.random().toString(16).slice(2)}`, // id fake, ok
      code: code.trim() || "Q-0000-0000",
      customerId: editing?.customerId ?? "mock_customer",
      customerName: customerName.trim() || "Khách hàng (mock)",
      validUntil: validUntil ? new Date(validUntil).toISOString() : undefined,
      status,
      subtotal: computed.subtotal,
      discountAmount: Number(discountAmount) || 0,
      total: computed.total,
      items: rows.map((r) => ({
        id: r.key,
        productId: r.productSku || r.key,
        productSku: r.productSku || undefined,
        productName: r.productName || "Sản phẩm (mock)",
        qty: Number(r.qty) || 0,
        unitPrice: Number(r.unitPrice) || 0,
        lineTotal: (Number(r.qty) || 0) * (Number(r.unitPrice) || 0),
      })),
    };

    const saved = upsertQuotation(payload);
    nav(URLS.SALES_QUOTATION_DETAIL(saved.id));
  };

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <Typography.Title level={3} style={{ margin: 0 }}>
          {isEdit ? "Sửa báo giá" : "Tạo báo giá"}
        </Typography.Title>

        <Space>
          <Button onClick={() => nav(URLS.SALES_QUOTATIONS)}>Quay lại</Button>
          <Button type="primary" onClick={onSave}>
            Lưu
          </Button>
        </Space>
      </div>

      <Card>
        <Form layout="vertical">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item label="Mã báo giá">
              <Input value={code} onChange={(e) => setCode(e.target.value)} />
            </Form.Item>

            <Form.Item label="Trạng thái">
              <Select
                value={status}
                onChange={(v) => setStatus(v)}
                options={[
                  { value: "draft", label: "draft" },
                  { value: "sent", label: "sent" },
                  { value: "accepted", label: "accepted" },
                  { value: "rejected", label: "rejected" },
                  { value: "expired", label: "expired" },
                ]}
              />
            </Form.Item>

            <Form.Item label="Hạn báo giá">
              <Input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />
            </Form.Item>

            <Form.Item className="md:col-span-2" label="Khách hàng (tên)">
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Chiết khấu">
              <InputNumber
                style={{ width: "100%" }}
                value={discountAmount}
                min={0}
                formatter={(v) => money(Number(v || 0))}
                parser={(v) => Number(String(v || "0").replace(/[^\d]/g, ""))}
                onChange={(v) => setDiscountAmount(Number(v ?? 0))}
              />
            </Form.Item>
          </div>
        </Form>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">Dòng hàng</div>
            <Button
              onClick={() =>
                setRows((s) => [
                  ...s,
                  {
                    key: `row_${s.length + 1}`,
                    productSku: "",
                    productName: "",
                    qty: 1,
                    unitPrice: 0,
                  },
                ])
              }
            >
              + Thêm dòng
            </Button>
          </div>

          <Table
            rowKey="key"
            columns={columns}
            dataSource={rows}
            pagination={false}
          />

          <div className="mt-4 flex justify-end">
            <div className="w-full max-w-sm space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính</span>
                <span>{money(computed.subtotal)} VND</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Chiết khấu</span>
                <span>- {money(discountAmount)} VND</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Tổng</span>
                <span>{money(computed.total)} VND</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Space>
  );
}
