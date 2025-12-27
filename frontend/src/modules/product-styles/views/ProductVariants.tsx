import {
  Button,
  Input,
  Space,
  Table,
  Typography,
  message,
  Tag,
  Select,
  Modal,
  Form,
  Switch,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getProductVariants,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
} from "../../products/api/product-variants.api";
import type { ProductVariant } from "../../products/api/product-variants.api";

import { getProductStyles } from "../../products/api/product-styles.api";
import { getSizes } from "../../products/api/sizes.api";
import { getColors } from "../../products/api/colors.api";

export default function ProductVariants() {
  const qc = useQueryClient();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [q, setQ] = useState("");

  const [productStyleId, setProductStyleId] = useState<number | undefined>(undefined);
  const [sizeId, setSizeId] = useState<number | undefined>(undefined);
  const [colorId, setColorId] = useState<number | undefined>(undefined);
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProductVariant | null>(null);

  const { data: stylesData, isLoading: stylesLoading } = useQuery({
    queryKey: ["product-styles-select"],
    queryFn: async () => getProductStyles({ page: 1, pageSize: 1000 }),
  });

  const { data: sizesData, isLoading: sizesLoading } = useQuery({
    queryKey: ["sizes-select"],
    queryFn: async () => getSizes({ page: 1, pageSize: 1000 }),
  });

  const { data: colorsData, isLoading: colorsLoading } = useQuery({
    queryKey: ["colors-select"],
    queryFn: async () => getColors({ page: 1, pageSize: 1000 }),
  });

  const styles = (stylesData as any)?.data?.items || [];
  const sizes = (sizesData as any)?.data?.items || [];
  const colors = (colorsData as any)?.data?.items || [];

  const queryKey = useMemo(
    () => [
      "product-variants",
      { page, pageSize, q, isActive, productStyleId, sizeId, colorId },
    ],
    [page, pageSize, q, isActive, productStyleId, sizeId, colorId]
  );

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await getProductVariants({
        page,
        pageSize,
        q: q || undefined,
        isActive,
        productStyleId,
        sizeId,
        colorId,
      });
      return res;
    },
  });

  // ✅ mutations
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

  const resetFilters = () => {
    setPage(1);
    setQ("");
    setIsActive(undefined);
    setProductStyleId(undefined);
    setSizeId(undefined);
    setColorId(undefined);
  };

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <div className="flex items-center justify-between">
        <Typography.Title level={3} style={{ margin: 0 }}>
          Biến thể sản phẩm
        </Typography.Title>

        <Space>
          <Button onClick={resetFilters}>Reset lọc</Button>
          <Button
            type="primary"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            Thêm biến thể
          </Button>
        </Space>
      </div>

      <Space wrap>
        <Input.Search
          placeholder="Tìm theo SKU..."
          allowClear
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onSearch={(val) => {
            setPage(1);
            setQ(val.trim());
          }}
          style={{ width: 220 }}
        />

        <Select
          allowClear
          placeholder="Trạng thái"
          style={{ width: 170 }}
          value={isActive}
          options={[
            { value: true, label: "Hoạt động" },
            { value: false, label: "Không hoạt động" },
          ]}
          onChange={(val) => {
            setPage(1);
            setIsActive(val);
          }}
        />

        <Select
          allowClear
          showSearch
          placeholder="Kiểu dáng"
          style={{ width: 220 }}
          loading={stylesLoading}
          value={productStyleId}
          optionFilterProp="label"
          options={styles.map((s: any) => ({
            value: s.id,
            label: s.name,
          }))}
          onChange={(val) => {
            setPage(1);
            setProductStyleId(val);
          }}
        />

        <Select
          allowClear
          showSearch
          placeholder="Kích thước"
          style={{ width: 190 }}
          loading={sizesLoading}
          value={sizeId}
          optionFilterProp="label"
          options={sizes.map((s: any) => ({
            value: s.id,
            label: s.name || s.code,
          }))}
          onChange={(val) => {
            setPage(1);
            setSizeId(val);
          }}
        />

        <Select
          allowClear
          showSearch
          placeholder="Màu sắc"
          style={{ width: 220 }}
          loading={colorsLoading}
          value={colorId}
          optionFilterProp="label"
          options={colors.map((c: any) => ({
            value: c.id,
            label: c.name,
          }))}
          onChange={(val) => {
            setPage(1);
            setColorId(val);
          }}
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
            width: 160,
            render: (ps) => ps?.name || "-",
          },
          {
            title: "Kích thước",
            dataIndex: "size",
            width: 140,
            render: (s) => s?.name || s?.code || "-",
          },
          {
            title: "Màu sắc",
            dataIndex: "color",
            width: 170,
            render: (c) => (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    display: "inline-block",
                    width: 16,
                    height: 16,
                    backgroundColor: c?.code || "#ccc",
                    border: "1px solid #ddd",
                  }}
                />
                {c?.name || "-"}
              </div>
            ),
          },
          {
            title: "Trạng thái",
            dataIndex: "isActive",
            width: 140,
            render: (v) => (
              <Tag color={v ? "green" : "red"}>
                {v ? "Hoạt động" : "Không hoạt động"}
              </Tag>
            ),
          },
          {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            width: 150,
            render: (v) => (v ? new Date(v).toLocaleDateString("vi-VN") : "-"),
          },
          {
            title: "Thao tác",
            width: 160,
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
        scroll={{ x: 950 }}
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
    queryFn: async () => getProductStyles({ page: 1, pageSize: 20 }),
  });

  const { data: sizesData } = useQuery({
    queryKey: ["sizes-select"],
    queryFn: async () => getSizes({ page: 1, pageSize: 20 }),
  });

  const { data: colorsData } = useQuery({
    queryKey: ["colors-select"],
    queryFn: async () => getColors({ page: 1, pageSize: 20 }),
  });

  const styles = (stylesData as any)?.data?.items || [];
  const sizes = (sizesData as any)?.data?.items || [];
  const colors = (colorsData as any)?.data?.items || [];

  useEffect(() => {
    if (!visible) return;

    if (productVariant) {
      form.setFieldsValue({
        sku: productVariant.sku ?? undefined,
        productStyleId: (productVariant as any)?.productStyle?.id ?? (productVariant as any)?.productStyleId,
        sizeId: (productVariant as any)?.size?.id ?? (productVariant as any)?.sizeId,
        colorId: (productVariant as any)?.color?.id ?? (productVariant as any)?.colorId,
        isActive: !!productVariant.isActive,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ isActive: true });
    }
  }, [visible, productVariant, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onOk(values);
    } catch {
    }
  };

  return (
    <Modal
      title={productVariant ? "Sửa biến thể" : "Thêm biến thể mới"}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      width={650}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="sku"
          label="SKU"
          rules={[{ max: 60, message: "SKU không được vượt quá 60 ký tự" }]}
        >
          <Input placeholder="Nhập SKU (tùy chọn)" />
        </Form.Item>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 16,
          }}
        >
          <Form.Item
            name="productStyleId"
            label="Kiểu dáng"
            rules={[{ required: true, message: "Vui lòng chọn kiểu dáng" }]}
          >
            <Select
              placeholder="Chọn kiểu dáng"
              showSearch
              optionFilterProp="label"
              options={styles.map((s: any) => ({
                value: s.id,
                label: s.name,
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
              optionFilterProp="label"
              options={sizes.map((s: any) => ({
                value: s.id,
                label: s.name || s.code,
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
              optionFilterProp="label"
              options={colors.map((c: any) => ({
                value: c.id,
                label: c.name,
              }))}
            />
          </Form.Item>
        </div>

        <Form.Item name="isActive" label="Trạng thái" valuePropName="checked">
          <Switch checkedChildren="Hoạt động" unCheckedChildren="Không hoạt động" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
