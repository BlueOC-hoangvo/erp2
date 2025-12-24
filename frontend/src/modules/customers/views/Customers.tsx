import { Button, Input, Space, Table, Typography, message } from "antd";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnsType } from "antd/es/table";

import { getCustomers } from "@/modules/customers/api/get-customers";
import { deleteCustomer } from "@/modules/customers/api/delete-customer";
import type { Customer } from "@/modules/customers/types";
import CustomerFormModal from "@/modules/customers/components/CustomerFormModal";
import { useNavigate } from "react-router-dom";

export default function Customers() {
  const qc = useQueryClient();
  const nav = useNavigate();

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);

  const queryKey = useMemo(() => ["customers", { q, page, pageSize }], [q, page, pageSize]);

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => getCustomers({ q, page, pageSize }),
    placeholderData: (prev) => prev,
  });

  const delMut = useMutation({
    mutationFn: (id: string) => deleteCustomer(id),
    onSuccess: async () => {
      message.success("Đã xoá khách hàng");
      await qc.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (e: any) => message.error(e?.message || "Xoá thất bại"),
  });

  const cols: ColumnsType<Customer> = [
    { title: "Mã", dataIndex: "code", width: 120, render: (v) => v || "-" },
    { title: "Tên khách hàng", dataIndex: "name", render: (v) => <b>{v}</b> },
    { title: "SĐT", dataIndex: "phone", width: 140, render: (v) => v || "-" },
    { title: "Email", dataIndex: "email", width: 220, render: (v) => v || "-" },
    { title: "Địa chỉ", dataIndex: "address", render: (v) => v || "-" },
    {
      title: "Thao tác",
      key: "actions",
      width: 240,
      render: (_, row) => (
        <Space>
          <Button onClick={() => nav(`/sales/customers/${row.id}`)}>Xem</Button>
          <Button
            onClick={() => {
              setEditing(row);
              setOpen(true);
            }}
          >
            Sửa
          </Button>
          <Button danger loading={delMut.isPending} onClick={() => delMut.mutate(row.id)}>
            Xoá
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <div>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Khách hàng
          </Typography.Title>
          <Typography.Text type="secondary">Danh sách khách hàng</Typography.Text>
        </div>

        <Button
          type="primary"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          Thêm khách hàng
        </Button>
      </Space>

      <div style={{ marginTop: 12, marginBottom: 12 }}>
        <Input.Search
          allowClear
          placeholder="Tìm theo tên / SĐT / email..."
          onSearch={(val) => {
            setQ(val.trim());
            setPage(1);
          }}
        />
      </div>

      <Table
        rowKey="id"
        loading={isLoading}
        columns={cols}
        dataSource={data?.items || []}
        pagination={{
          current: data?.page ?? page,
          pageSize: data?.pageSize ?? pageSize,
          total: data?.total ?? 0,
          showSizeChanger: true,
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps);
          },
        }}
      />

      <CustomerFormModal
        open={open}
        onClose={() => setOpen(false)}
        customer={editing}
        onSuccess={async () => {
          setOpen(false);
          await qc.invalidateQueries({ queryKey: ["customers"] });
        }}
      />
    </div>
  );
}
