import { Card, Descriptions, Space, Tabs, Typography } from "antd";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCustomerById } from "../api/get-customer-by-id";

import CustomerContactsTab from "../components/CustomerContactsTab";
import CustomerNotesTab from "../components/CustomerNotesTab";
import CustomerHandbookTab from "../components/CustomerHandbookTab";

export default function CustomerDetail() {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["customer", id],
    queryFn: async () => getCustomerById(id!),
    enabled: !!id,
  });

  const c = data?.data;
  const customerId = String(id ?? "");

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <Typography.Title level={3} style={{ margin: 0 }}>
        Chi tiết khách hàng
      </Typography.Title>

      <Card loading={isLoading}>
        {c ? (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Mã">{c.code}</Descriptions.Item>
            <Descriptions.Item label="Tên">{c.name}</Descriptions.Item>
            <Descriptions.Item label="SĐT">{c.phone || "-"}</Descriptions.Item>
            <Descriptions.Item label="Email">
              {c.email || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ" span={2}>
              {c.address || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {c.status || "-"}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <div style={{ color: "#6b7280" }}>Không tìm thấy khách hàng.</div>
        )}
      </Card>

      <Card>
        <Tabs
          items={[
            {
              key: "contacts",
              label: "Liên hệ",
              children: <CustomerContactsTab customerId={customerId} />,
            },
            {
              key: "notes",
              label: "Ghi chú",
              children: <CustomerNotesTab customerId={customerId} />,
            },
            {
              key: "handbook",
              label: "Cẩm nang",
              children: <CustomerHandbookTab customerId={customerId} />,
            },
          ]}
        />
      </Card>
    </Space>
  );
}
