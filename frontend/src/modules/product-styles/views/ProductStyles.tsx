import { Button, Input, Space, Table, Typography, message, Tag } from "antd";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProductStyles, createProductStyle, updateProductStyle, deleteProductStyle } from "../../products/api/product-styles.api";
import type { ProductStyle } from "../../products/api/product-styles.api";
import { useNavigate } from "react-router-dom";

export default function ProductStyles() {
  const qc = useQueryClient();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [q, setQ] = useState("");
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProductStyle | null>(null);

  const queryKey = useMemo(
    () => ["product-styles", { page, pageSize, q, isActive }],
    [page, pageSize, q, isActive]
  );

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await getProductStyles({ 
        page, 
        pageSize, 
        q: q || undefined, 
        isActive 
      });
      return res;
    },
  });

  const createMut = useMutation({
    mutationFn: (body: any) => createProductStyle(body),
    onSuccess: async () => {
      message.success("Tạo kiểu dáng thành công");
      await qc.invalidateQueries({ queryKey: ["product-styles"] });
      setOpen(false);
      setEditing(null);
    },
    onError: (e: any) => message.error(e?.message || "Tạo thất bại"),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, body }: { id: number; body: any }) => 
      updateProductStyle(id, body),
    onSuccess: async () => {
      message.success("Cập nhật thành công");
      await qc.invalidateQueries({ queryKey: ["product-styles"] });
      setOpen(false);
      setEditing(null);
    },
    onError: (e: any) => message.error(e?.message || "Cập nhật thất bại"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteProductStyle(id),
    onSuccess: async () => {
      message.success("Đã xóa");
      await qc.invalidateQueries({ queryKey: ["product-styles"] });
    },
    onError: (e: any) => message.error(e?.message || "Xóa thất bại"),
  });

  // Access data đúng theo API structure
  const rows: ProductStyle[] = (data as any)?.data?.items ?? [];
  const meta = (data as any)?.data;

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <div className="flex items-center justify-between">
        <Typography.Title level={3} style={{ margin: 0 }}>
          Kiểu dáng sản phẩm
        </Typography.Title>
        <Button 
          type="primary" 
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          Thêm kiểu dáng
        </Button>
      </div>

      <Space>
        <Input.Search
          placeholder="Tìm kiếm theo tên/mã/ghi chú..."
          allowClear
          onSearch={(val) => {
            setPage(1);
            setQ(val.trim());
          }}
          style={{ width: 300 }}
        />

        <Input
          placeholder="Lọc theo trạng thái (true/false)..."
          allowClear
          onChange={(e) => {
            setPage(1);
            const val = e.target.value.trim();
            if (val === "true") setIsActive(true);
            else if (val === "false") setIsActive(false);
            else setIsActive(undefined);
          }}
          style={{ width: 200 }}
        />
      </Space>

      <Table<ProductStyle>
        rowKey="id"
        loading={isLoading}
        dataSource={rows}
        pagination={{
          current: meta?.page ?? page,
          pageSize: meta?.pageSize ?? pageSize,
          total: meta?.total ?? rows.length,
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps);
          },
        }}
        columns={[
          {
            title: "Mã",
            dataIndex: "code",
            width: 120,
            render: (v) => v || "-",
          },
          {
            title: "Tên kiểu dáng",
            dataIndex: "name",
            width: 200,
            render: (v, r) => (
              <div>
                <div style={{ fontWeight: 500 }}>{v}</div>
                {r.note && (
                  <div style={{ color: "#666", fontSize: 12 }}>
                    {r.note}
                  </div>
                )}
              </div>
            ),
          },
          {
            title: "Trạng thái",
            dataIndex: "isActive",
            width: 100,
            render: (isActive) => (
              <Tag color={isActive ? "green" : "red"}>
                {isActive ? "Hoạt động" : "Không hoạt động"}
              </Tag>
            ),
          },
          {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            width: 150,
            render: (v) => new Date(v).toLocaleDateString("vi-VN"),
          },
          {
            title: "Thao tác",
            width: 150,
            render: (_, r) => (
              <Space>
                <a
                  onClick={() => {
                    setEditing(r);
                    setOpen(true);
                  }}
                >
                  Sửa
                </a>
                <a 
                  onClick={() => deleteMut.mutate(Number(r.id))}
                  style={{ color: "red" }}
                >
                  Xóa
                </a>
              </Space>
            ),
          },
        ]}
        scroll={{ x: 800 }}
      />

      <ProductStyleFormModal
        visible={open}
        onCancel={() => {
          setOpen(false);
          setEditing(null);
        }}
        onOk={(values) => {
          if (editing?.id) {
            updateMut.mutate({ id: Number(editing.id), body: values });
          } else {
            createMut.mutate(values);
          }
        }}
        productStyle={editing}
        loading={createMut.isPending || updateMut.isPending}
      />
    </Space>
  );
}

// Form Modal Component
import { Modal, Form, Switch } from "antd";

interface ProductStyleFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
  productStyle?: ProductStyle | null;
  loading?: boolean;
}

function ProductStyleFormModal({
  visible,
  onCancel,
  onOk,
  productStyle,
  loading = false,
}: ProductStyleFormModalProps) {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onOk(values);
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  return (
    <Modal
      title={productStyle ? "Sửa kiểu dáng" : "Thêm kiểu dáng mới"}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      width={600}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          isActive: true,
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Form.Item
            name="code"
            label="Mã kiểu dáng"
            rules={[{ max: 50, message: "Mã không được vượt quá 50 ký tự" }]}
          >
            <Input placeholder="Nhập mã kiểu dáng (tùy chọn)" />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Trạng thái"
            valuePropName="checked"
          >
            <Switch 
              checkedChildren="Hoạt động" 
              unCheckedChildren="Không hoạt động"
            />
          </Form.Item>
        </div>

        <Form.Item
          name="name"
          label="Tên kiểu dáng"
          rules={[
            { required: true, message: "Vui lòng nhập tên kiểu dáng" },
            { max: 200, message: "Tên không được vượt quá 200 ký tự" },
          ]}
        >
          <Input placeholder="Nhập tên kiểu dáng" />
        </Form.Item>

        <Form.Item
          name="note"
          label="Ghi chú"
          rules={[{ max: 255, message: "Ghi chú không được vượt quá 255 ký tự" }]}
        >
          <Input.TextArea 
            placeholder="Nhập ghi chú (tùy chọn)"
            rows={3}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
