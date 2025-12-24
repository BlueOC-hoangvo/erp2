import { Modal, Form, Input, message } from "antd";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import type { Customer } from "../types";
import { addCustomer } from "../api/add-customer";
import { updateCustomer } from "../api/update-customer";

type Props = {
  open: boolean;
  onClose: () => void;
  customer: Customer | null;
  onSuccess: () => void | Promise<void>;
};

type FormValues = {
  code?: string;
  name: string;
  taxCode?: string;
  phone?: string;
  email?: string;
  address?: string;
  note?: string;
};

export default function CustomerFormModal({ open, onClose, customer, onSuccess }: Props) {
  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (!open) return;
    if (customer) form.setFieldsValue({ ...customer } as any);
    else form.resetFields();
  }, [open, customer, form]);

  const createMut = useMutation({
    mutationFn: (body: FormValues) => addCustomer(body),
  });

  const updateMut = useMutation({
    mutationFn: (body: FormValues) => updateCustomer(customer!.id, body),
  });

  const onOk = async () => {
    try {
      const values = await form.validateFields();
      if (customer) {
        await updateMut.mutateAsync(values);
        message.success("Đã cập nhật khách hàng");
      } else {
        await createMut.mutateAsync(values);
        message.success("Đã tạo khách hàng");
      }
      await onSuccess();
    } catch (e: any) {
      if (e?.errorFields) return; // antd validate
      message.error(e?.message || "Lưu thất bại");
    }
  };

  return (
    <Modal
      open={open}
      title={customer ? "Sửa khách hàng" : "Thêm khách hàng"}
      onCancel={onClose}
      onOk={onOk}
      confirmLoading={createMut.isPending || updateMut.isPending}
      okText="Lưu"
      cancelText="Huỷ"
      destroyOnClose
    >
      <Form layout="vertical" form={form}>
        <Form.Item label="Mã" name="code">
          <Input placeholder="VD: CUS-001" />
        </Form.Item>

        <Form.Item label="Tên khách hàng" name="name" rules={[{ required: true, message: "Bắt buộc" }]}>
          <Input placeholder="Tên khách hàng" />
        </Form.Item>

        <Form.Item label="MST" name="taxCode">
          <Input />
        </Form.Item>

        <Form.Item label="SĐT" name="phone">
          <Input />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input />
        </Form.Item>

        <Form.Item label="Địa chỉ" name="address">
          <Input />
        </Form.Item>

        <Form.Item label="Ghi chú" name="note">
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
