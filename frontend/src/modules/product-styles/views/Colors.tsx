import { Button, Input, Space, Table, Typography, message, Tag, Modal, Form, Switch } from "antd";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getColors, createColor, updateColor, deleteColor } from "../../products/api/colors.api";
import type { Color } from "../../products/api/colors.api";

export default function Colors() {
  const qc = useQueryClient();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [q, setQ] = useState("");
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Color | null>(null);

  const queryKey = useMemo(
    () => ["colors", { page, pageSize, q, isActive }],
    [page, pageSize, q, isActive]
  );

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await getColors({ 
        page, 
        pageSize, 
        q: q || undefined, 
        isActive 
      });
      return res;
    },
  });

  const createMut = useMutation({
    mutationFn: (body: any) => createColor(body),
    onSuccess: async () => {
      message.success("Tạo màu sắc thành công");
      await qc.invalidateQueries({ queryKey: ["colors"] });
      setOpen(false);
      setEditing(null);
    },
    onError: (e: any) => message.error(e?.message || "Tạo thất bại"),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, body }: { id: number; body: any }) => 
      updateColor(id, body),
    onSuccess: async () => {
      message.success("Cập nhật thành công");
      await qc.invalidateQueries({ queryKey: ["colors"] });
      setOpen(false);
      setEditing(null);
    },
    onError: (e: any) => message.error(e?.message || "Cập nhật thất bại"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteColor(id),
    onSuccess: async () => {
      message.success("Đã xóa");
      await qc.invalidateQueries({ queryKey: ["colors"] });
    },
    onError: (e: any) => message.error(e?.message || "Xóa thất bại"),
  });

  const rows: Color[] = (data as any)?.data?.items ?? [];
  const meta = (data as any)?.data;

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <div className="flex items-center justify-between">
        <Typography.Title level={3} style={{ margin: 0 }}>
          Màu sắc
        </Typography.Title>
        <Button 
          type="primary" 
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          Thêm màu sắc
        </Button>
      </div>

      <Space>
        <Input.Search
          placeholder="Tìm kiếm theo mã/tên..."
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

      <Table<Color>
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
            width: 100,
            render: (v) => (
              <span style={{ fontWeight: 500 }}>{v}</span>
            ),
          },
          {
            title: "Tên màu",
            dataIndex: "name",
            width: 150,
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
        scroll={{ x: 700 }}
      />

      <ColorFormModal
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
        color={editing}
        loading={createMut.isPending || updateMut.isPending}
      />
    </Space>
  );
}


// Form Modal Component


interface ColorFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
  color?: Color | null;
  loading?: boolean;
}

function ColorFormModal({
  visible,
  onCancel,
  onOk,
  color,
  loading = false,
}: ColorFormModalProps) {
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
      title={color ? "Sửa màu sắc" : "Thêm màu sắc mới"}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      width={500}
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
          name="code"
          label="Mã màu"
          rules={[
            { required: true, message: "Vui lòng nhập mã màu" },
            { max: 30, message: "Mã không được vượt quá 30 ký tự" },
          ]}
        >
          <Input placeholder="Nhập mã màu" />
        </Form.Item>

        <Form.Item
          name="name"
          label="Tên màu"
          rules={[
            { required: true, message: "Vui lòng nhập tên màu" },
            { max: 80, message: "Tên không được vượt quá 80 ký tự" },
          ]}
        >
          <Input placeholder="Nhập tên màu" />
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
      </Form>
    </Modal>
  );
}
