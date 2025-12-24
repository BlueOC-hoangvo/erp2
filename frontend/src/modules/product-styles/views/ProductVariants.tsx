import { Button, Input, Space, Table, Typography, message, Tag, Select, Modal, Form, Switch } from "antd";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProductVariants, createProductVariant, updateProductVariant, deleteProductVariant } from "../../products/api/product-variants.api";
import type { ProductVariant } from "../../products/api/product-variants.api";
import { getProductStyles } from "../../products/api/product-styles.api";
import { getSizes } from "../../products/api/sizes.api";
import { getColors } from "../../products/api/colors.api";

export default function ProductVariants() {
  const qc = useQueryClient();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [q, setQ] = useState("");
  // const [productStyleId, setProductStyleId] = useState<number | undefined>(undefined);
  // const [sizeId, setSizeId] = useState<number | undefined>(undefined);
  // const [colorId, setColorId] = useState<number | undefined>(undefined);
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProductVariant | null>(null);

  const queryKey = useMemo(
    () => ["product-variants", { page, pageSize, q, isActive }],
    [page, pageSize, q, isActive]
  );

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await getProductVariants({ 
        page, 
        pageSize, 
        q: q || undefined, 
        isActive 
      });
      return res;
    },
  });

  const createMut = useMutation({
    mutationFn: (body: any) => createProductVariant(body),
    onSuccess: async () => {
      message.success("Tạo biến thể thành công");
      await qc.invalidateQueries({ queryKey: ["product-variants"] });
      setOpen(false);
      setEditing(null);
    },
    onError: (e: any) => message.error(e?.message || "Tạo thất bại"),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, body }: { id: number; body: any }) => 
      updateProductVariant(id, body),
    onSuccess: async () => {
      message.success("Cập nhật thành công");
      await qc.invalidateQueries({ queryKey: ["product-variants"] });
      setOpen(false);
      setEditing(null);
    },
    onError: (e: any) => message.error(e?.message || "Cập nhật thất bại"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteProductVariant(id),
    onSuccess: async () => {
      message.success("Đã xóa");
      await qc.invalidateQueries({ queryKey: ["product-variants"] });
    },
    onError: (e: any) => message.error(e?.message || "Xóa thất bại"),
  });

  const rows: ProductVariant[] = (data as any)?.data?.items ?? [];
  const meta = (data as any)?.data;

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <div className="flex items-center justify-between">
        <Typography.Title level={3} style={{ margin: 0 }}>
          Biến thể sản phẩm
        </Typography.Title>
        <Button 
          type="primary" 
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          Thêm biến thể
        </Button>
      </div>

      <Space wrap>
        <Input.Search
          placeholder="Tìm kiếm theo SKU..."
          allowClear
          onSearch={(val) => {
            setPage(1);
            setQ(val.trim());
          }}
          style={{ width: 200 }}
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

      <Table<ProductVariant>
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
            title: "SKU",
            dataIndex: "sku",
            width: 150,
            render: (v) => v || "-",
          },
          {
            title: "Kiểu dáng",
            dataIndex: "productStyle",
            width: 150,
            render: (ps) => ps?.name || "-",
          },
          {
            title: "Kích thước",
            dataIndex: "size",
            width: 120,
            render: (size) => size?.name || size?.code || "-",
          },
          {
            title: "Màu sắc",
            dataIndex: "color",
            width: 120,
            render: (color) => (
              <div>
                <span style={{ 
                  display: 'inline-block', 
                  width: 16, 
                  height: 16, 
                  backgroundColor: color?.code || '#ccc',
                  border: '1px solid #ddd',
                  marginRight: 8 
                }} />
                {color?.name || "-"}
              </div>
            ),
          },
          {
            title: "Trạng thái",
            dataIndex: "isActive",
            width: 120,
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
        scroll={{ x: 900 }}
      />

      <ProductVariantFormModal
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
        productVariant={editing}
        loading={createMut.isPending || updateMut.isPending}
      />
    </Space>
  );
}


// Form Modal Component


interface ProductVariantFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
  productVariant?: ProductVariant | null;
  loading?: boolean;
}

function ProductVariantFormModal({
  visible,
  onCancel,
  onOk,
  productVariant,
  loading = false,
}: ProductVariantFormModalProps) {
  const [form] = Form.useForm();

  const { data: stylesData } = useQuery({
    queryKey: ["product-styles-select"],
    queryFn: async () => {
      const res = await getProductStyles({ page: 1, pageSize: 1000 });
      return res;
    },
  });

  const { data: sizesData } = useQuery({
    queryKey: ["sizes-select"],
    queryFn: async () => {
      const res = await getSizes({ page: 1, pageSize: 1000 });
      return res;
    },
  });

  const { data: colorsData } = useQuery({
    queryKey: ["colors-select"],
    queryFn: async () => {
      const res = await getColors({ page: 1, pageSize: 1000 });
      return res;
    },
  });

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onOk(values);
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const styles = (stylesData as any)?.data?.items || [];
  const sizes = (sizesData as any)?.data?.items || [];
  const colors = (colorsData as any)?.data?.items || [];

  return (
    <Modal
      title={productVariant ? "Sửa biến thể" : "Thêm biến thể mới"}
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
        <Form.Item
          name="sku"
          label="SKU"
          rules={[{ max: 60, message: "SKU không được vượt quá 60 ký tự" }]}
        >
          <Input placeholder="Nhập SKU (tùy chọn)" />
        </Form.Item>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <Form.Item
            name="productStyleId"
            label="Kiểu dáng"
            rules={[{ required: true, message: "Vui lòng chọn kiểu dáng" }]}
          >
            <Select
              placeholder="Chọn kiểu dáng"
              showSearch
              optionFilterProp="children"
              options={styles.map((style: any) => ({
                value: style.id,
                label: style.name,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="sizeId"
            label="Kích thước"
            rules={[{ required: true, message: "Vui lòng chọn kích thước" }]}
          >
            <Select
              placeholder="Chọn kích thước"
              showSearch
              optionFilterProp="children"
              options={sizes.map((size: any) => ({
                value: size.id,
                label: size.name || size.code,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="colorId"
            label="Màu sắc"
            rules={[{ required: true, message: "Vui lòng chọn màu sắc" }]}
          >
            <Select
              placeholder="Chọn màu sắc"
              showSearch
              optionFilterProp="children"
              options={colors.map((color: any) => ({
                value: color.id,
                label: color.name,
              }))}
            />
          </Form.Item>
        </div>

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
      </Form>
    </Modal>
  );
}
