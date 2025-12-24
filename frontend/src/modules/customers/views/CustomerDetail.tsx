import { Button, Card, Input, List, Space, Typography, message } from "antd";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getCustomerById } from "../api/get-customer-by-id";
import { getCustomerNotes } from "../api/get-customer-notes";
import { addCustomerNote } from "../api/add-customer-note";
import { deleteCustomerNote } from "../api/delete-customer-note";

export default function CustomerDetail() {
  const { id } = useParams();
  const customerId = String(id);
  const qc = useQueryClient();

  const [content, setContent] = useState("");

  const qCustomer = useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => getCustomerById(customerId),
    enabled: !!customerId,
  });

  const qNotes = useQuery({
    queryKey: ["customer-notes", customerId],
    queryFn: () => getCustomerNotes(customerId),
    enabled: !!customerId,
  });

  const addNoteMut = useMutation({
    mutationFn: () => addCustomerNote(customerId, content.trim()),
    onSuccess: async () => {
      setContent("");
      message.success("Đã thêm ghi chú");
      await qc.invalidateQueries({ queryKey: ["customer-notes", customerId] });
    },
    onError: (e: any) => message.error(e?.message || "Thêm ghi chú thất bại"),
  });

  const delNoteMut = useMutation({
    mutationFn: (noteId: string) => deleteCustomerNote(customerId, noteId),
    onSuccess: async () => {
      message.success("Đã xoá ghi chú");
      await qc.invalidateQueries({ queryKey: ["customer-notes", customerId] });
    },
    onError: (e: any) => message.error(e?.message || "Xoá ghi chú thất bại"),
  });

  const customer = qCustomer.data;

  return (
    <div style={{ padding: 16 }}>
      <Space direction="vertical" style={{ width: "100%" }} size={12}>
        <Card loading={qCustomer.isLoading}>
          <Typography.Title level={3} style={{ marginTop: 0 }}>
            {customer?.name || "Khách hàng"}
          </Typography.Title>
          <Typography.Text type="secondary">
            {customer?.code ? `Mã: ${customer.code} • ` : ""}
            {customer?.phone ? `SĐT: ${customer.phone} • ` : ""}
            {customer?.email ? `Email: ${customer.email}` : ""}
          </Typography.Text>

          {customer?.address && (
            <div style={{ marginTop: 8 }}>
              <b>Địa chỉ:</b> {customer.address}
            </div>
          )}

          {customer?.note && (
            <div style={{ marginTop: 8 }}>
              <b>Ghi chú:</b> {customer.note}
            </div>
          )}
        </Card>

        <Card title="Ghi chú" loading={qNotes.isLoading}>
          <Space style={{ width: "100%" }}>
            <Input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập ghi chú..."
            />
            <Button
              type="primary"
              disabled={!content.trim()}
              loading={addNoteMut.isPending}
              onClick={() => addNoteMut.mutate()}
            >
              Thêm
            </Button>
          </Space>

          <div style={{ marginTop: 12 }}>
            <List
              dataSource={qNotes.data || []}
              locale={{ emptyText: "Chưa có ghi chú" }}
              renderItem={(n) => (
                <List.Item
                  actions={[
                    <Button
                      danger
                      size="small"
                      key="del"
                      loading={delNoteMut.isPending}
                      onClick={() => delNoteMut.mutate(n.id)}
                    >
                      Xoá
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={n.user?.fullName || n.user?.email || "System"}
                    description={n.createdAt}
                  />
                  <div>{n.content}</div>
                </List.Item>
              )}
            />
          </div>
        </Card>
      </Space>
    </div>
  );
}
