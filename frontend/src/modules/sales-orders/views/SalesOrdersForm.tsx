import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Table,
  Typography,
  message,
  Row,
  Col,
  Popconfirm,
} from "antd";
import {
  ArrowLeftOutlined,
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useSalesOrder, useCreateSalesOrder, useUpdateSalesOrder } from "../api/hooks/useSalesOrders";
import { convertToFormData, convertFormToApiRequest, validateSalesOrder } from "../utils/mappers";

const { Title, Text } = Typography;
const { Option } = Select;

// Mock data for demo - trong thực tế sẽ lấy từ API
const productStyles = [
  { id: "1", code: "TSH001", name: "Áo thun basic" },
  { id: "2", code: "POLO002", name: "Áo polo" },
  { id: "3", code: "HOOD003", name: "Áo hoodie" },
  { id: "4", code: "TEE004", name: "Áo tee graphic" },
  { id: "5", code: "LONG005", name: "Áo dài tay" },
];

const customers = [
  { id: "1", name: "Khách hàng A", code: "KH001" },
  { id: "2", name: "Khách hàng B", code: "KH002" },
  { id: "3", name: "Khách hàng C", code: "KH003" },
];

interface BreakdownItem {
  productVariantId: string;
  qty: string;
  id?: string;
}

interface FormItem {
  lineNo: number;
  productStyleId: string;
  itemName: string;
  uom: string;
  qtyTotal: string;
  unitPrice: string;
  note?: string;
  breakdowns: BreakdownItem[];
}

export function SalesOrdersForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<FormItem[]>([]);
  const [breakdownModal, setBreakdownModal] = useState<{
    visible: boolean;
    itemIndex: number;
    breakdownIndex: number;
    data: {
      productVariantId: string;
      qty: string;
    };
  }>({
    visible: false,
    itemIndex: -1,
    breakdownIndex: -1,
    data: {
      productVariantId: "",
      qty: "0",
    },
  });

  // API hooks
  const { data: salesOrder, isLoading: loadingOrder, error } = useSalesOrder(id || "");
  const createMutation = useCreateSalesOrder();
  const updateMutation = useUpdateSalesOrder();

  useEffect(() => {
    if (id && salesOrder) {
      // Load existing sales order
      const formData = convertToFormData((salesOrder as any).data);
      setItems(formData.items);
      
      form.setFieldsValue({
        orderNo: formData.orderNo,
        customerId: formData.customerId,
        orderDate: formData.orderDate ? dayjs(formData.orderDate) : undefined,
        dueDate: formData.dueDate ? dayjs(formData.dueDate) : undefined,
        note: formData.note,
        isInternal: formData.isInternal,
      });
    }
  }, [salesOrder, id, form]);

  const addItem = () => {
    setItems(prev => {
      const newItem: FormItem = {
        lineNo: prev.length + 1,
        productStyleId: "",
        itemName: "",
        uom: "pcs",
        qtyTotal: "0",
        unitPrice: "0",
        note: "",
        breakdowns: [],
      };
      return [...prev, newItem];
    });
  };

  const removeItem = (index: number) => {
    setItems(prev => {
      const newItems = prev.filter((_, i) => i !== index);
      // Re-number line items
      return newItems.map((item, i) => ({ ...item, lineNo: i + 1 }));
    });
  };

  const updateItem = (index: number, field: keyof FormItem, value: any) => {
    setItems(prev => prev.map((item, i) => {
      if (i === index) {
        const updated = { ...item, [field]: value };
        
        // Auto-update itemName when productStyleId changes
        if (field === "productStyleId") {
          const style = productStyles.find(s => s.id === value);
          if (style) {
            updated.itemName = style.name;
          }
        }
        
        return updated;
      }
      return item;
    }));
  };

  const openBreakdownModal = (itemIndex: number, breakdownIndex: number = -1) => {
    const item = items[itemIndex];
    const breakdown = breakdownIndex >= 0 ? item.breakdowns[breakdownIndex] : null;
    
    setBreakdownModal({
      visible: true,
      itemIndex,
      breakdownIndex,
      data: {
        productVariantId: breakdown?.productVariantId || "",
        qty: breakdown?.qty || "0",
      },
    });
  };

  const saveBreakdown = () => {
    const { itemIndex, breakdownIndex, data } = breakdownModal;
    
    if (!data.productVariantId || !data.qty) {
      message.error("Vui lòng nhập đầy đủ thông tin breakdown");
      return;
    }

    setItems(prev => prev.map((item, i) => {
      if (i === itemIndex) {
        const newBreakdown: BreakdownItem = {
          productVariantId: data.productVariantId,
          qty: data.qty,
        };

        if (breakdownIndex === -1) {
          // Add new
          return {
            ...item,
            breakdowns: [...item.breakdowns, newBreakdown],
          };
        } else {
          // Update existing
          const updatedBreakdowns = [...item.breakdowns];
          updatedBreakdowns[breakdownIndex] = newBreakdown;
          return {
            ...item,
            breakdowns: updatedBreakdowns,
          };
        }
      }
      return item;
    }));

    setBreakdownModal({ ...breakdownModal, visible: false });
  };

  const removeBreakdown = (itemIndex: number, breakdownIndex: number) => {
    setItems(prev => prev.map((item, i) => {
      if (i === itemIndex) {
        return {
          ...item,
          breakdowns: item.breakdowns.filter((_, bi) => bi !== breakdownIndex),
        };
      }
      return item;
    }));
  };

  const handleSubmit = async (values: any) => {
    // Validation
    const validationErrors = validateSalesOrder({
      ...values,
      items,
    });

    if (validationErrors.length > 0) {
      message.error(validationErrors[0]);
      return;
    }

    setSaving(true);

    try {
      const apiData = convertFormToApiRequest({
        ...values,
        orderDate: values.orderDate?.format('YYYY-MM-DD'),
        dueDate: values.dueDate?.format('YYYY-MM-DD'),
        items,
      });

      if (id) {
        // Update existing
        await updateMutation.mutateAsync({ id, data: apiData });
        message.success("Cập nhật đơn hàng thành công");
      } else {
        // Create new
        await createMutation.mutateAsync(apiData);
        message.success("Tạo đơn hàng thành công");
      }
      
      navigate("/sales-orders");
    } catch (error: any) {
      message.error(error?.message || "Có lỗi xảy ra khi lưu đơn hàng");
    } finally {
      setSaving(false);
    }
  };

  const itemColumns = [
    {
      title: "STT",
      key: "lineNo",
      width: 60,
      render: (_: any, _record: FormItem, index: number) => (
        <Text>{index + 1}</Text>
      ),
    },
    {
      title: "Sản phẩm",
      key: "productStyleId",
      width: 150,
      render: (_: any, _record: FormItem, index: number) => (
        <Select
          value={items[index]?.productStyleId}
          style={{ width: "100%" }}
          onChange={(v) => updateItem(index, "productStyleId", v)}
          placeholder="Chọn sản phẩm"
          loading={loadingOrder}
        >
          {productStyles.map((style) => (
            <Option key={style.id} value={style.id}>
              {style.code} - {style.name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Tên sản phẩm",
      key: "itemName",
      render: (_: any, _record: FormItem, index: number) => (
        <Input
          value={items[index]?.itemName}
          onChange={(e) => updateItem(index, "itemName", e.target.value)}
          placeholder="Tên sản phẩm"
        />
      ),
    },
    {
      title: "Đơn vị",
      key: "uom",
      width: 80,
      render: (_: any, _record: FormItem, index: number) => (
        <Input
          value={items[index]?.uom}
          onChange={(e) => updateItem(index, "uom", e.target.value)}
          placeholder="Đơn vị"
        />
      ),
    },
    {
      title: "Số lượng",
      key: "qtyTotal",
      width: 100,
      render: (_: any, _record: FormItem, index: number) => (
        <InputNumber
          min={0}
          value={parseFloat(items[index]?.qtyTotal || "0")}
          onChange={(v) => updateItem(index, "qtyTotal", String(v || 0))}
          style={{ width: "100%" }}
          placeholder="Số lượng"
        />
      ),
    },
    {
      title: "Đơn giá",
      key: "unitPrice",
      width: 120,
      render: (_: any, _record: FormItem, index: number) => (
        <InputNumber
          min={0}
          value={parseFloat(items[index]?.unitPrice || "0")}
          onChange={(v) => updateItem(index, "unitPrice", String(v || 0))}
          style={{ width: "100%" }}
          placeholder="Đơn giá"
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          parser={(value) => Number(value!.replace(/\$\s?|(,*)/g, ""))}
        />
      ),
    },
    {
      title: "Thành tiền",
      key: "amount",
      width: 120,
      render: (_: any, _record: FormItem, index: number) => {
        const qty = parseFloat(items[index]?.qtyTotal || "0");
        const price = parseFloat(items[index]?.unitPrice || "0");
        const amount = qty * price;
        return (
          <Text strong>
            {amount.toLocaleString("vi-VN")} VND
          </Text>
        );
      },
    },
    {
      title: "Breakdown",
      key: "breakdown",
      width: 120,
      render: (_: any, _record: FormItem, index: number) => (
        <Button
          type="link"
          size="small"
          onClick={() => openBreakdownModal(index)}
        >
          Quản lý ({items[index]?.breakdowns?.length || 0})
        </Button>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 80,
      render: (_: any, _record: FormItem, index: number) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa sản phẩm này?"
          onConfirm={() => removeItem(index)}
          okText="Có"
          cancelText="Không"
        >
          <Button
            type="text"
            danger
            size="small"
            icon={<DeleteOutlined />}
          />
        </Popconfirm>
      ),
    },
  ];

  if (loadingOrder) {
    return (
      <div style={{ padding: 24 }}>
        <Card loading />
      </div>
    );
  }

  if (error && id) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
          <Space direction="vertical" align="center" style={{ width: "100%" }}>
            <ExclamationCircleOutlined style={{ fontSize: 48, color: "#faad14" }} />
            <Title level={4}>Không tìm thấy đơn hàng</Title>
            <Text>Đơn hàng này có thể đã bị xóa hoặc không tồn tại.</Text>
            <Link to="/sales-orders">
              <Button type="primary">Quay lại danh sách</Button>
            </Link>
          </Space>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <Space>
            <Link to="/sales-orders">
              <Button icon={<ArrowLeftOutlined />}>Quay lại</Button>
            </Link>
            <Title level={3} style={{ margin: 0 }}>
              {id ? "Chỉnh sửa đơn hàng" : "Tạo đơn hàng mới"}
            </Title>
          </Space>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={() => form.submit()}
            loading={saving || createMutation.isPending || updateMutation.isPending}
          >
            Lưu đơn hàng
          </Button>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            isInternal: false,
          }}
        >
          <Card title="Thông tin cơ bản">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="orderNo"
                  label="Mã đơn hàng"
                  rules={[{ required: true, message: "Vui lòng nhập mã đơn hàng" }]}
                >
                  <Input placeholder="Nhập mã đơn hàng" disabled={!!id} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="customerId"
                  label="Khách hàng"
                  rules={[{ required: true, message: "Vui lòng chọn khách hàng" }]}
                >
                  <Select placeholder="Chọn khách hàng" showSearch>
                    {customers.map((customer) => (
                      <Option key={customer.id} value={customer.id}>
                        {customer.name} ({customer.code})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="orderDate"
                  label="Ngày đặt hàng"
                  rules={[{ required: true, message: "Vui lòng chọn ngày đặt hàng" }]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="dueDate" label="Ngày giao hàng">
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="isInternal" label="Nội bộ" valuePropName="checked">
                  <Select placeholder="Chọn loại đơn hàng">
                    <Option value={false}>Khách hàng</Option>
                    <Option value={true}>Nội bộ</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="note" label="Ghi chú">
              <Input.TextArea rows={3} placeholder="Nhập ghi chú..." />
            </Form.Item>
          </Card>

          <Card
            title="Sản phẩm"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={addItem}>
                Thêm sản phẩm
              </Button>
            }
          >
            <Table
              dataSource={items}
              columns={itemColumns}
              rowKey={(_record, index) => `item-${index}`}
              pagination={false}
              expandable={{
                expandedRowRender: (_record, index) => (
                  <div style={{ padding: 16, backgroundColor: "#fafafa" }}>
                    <Title level={5}>Chi tiết Breakdown</Title>
                    {items[index]?.breakdowns?.length > 0 ? (
                      <Table
                        dataSource={items[index].breakdowns}
                        columns={[
                          { title: "Product Variant ID", dataIndex: "productVariantId" },
                          { title: "Số lượng", dataIndex: "qty" },
                          {
                            title: "",
                            width: 120,
                            render: (_: any, _bd: BreakdownItem, bdIndex: number) => (
                              <Space>
                                <Button
                                  size="small"
                                  onClick={() => openBreakdownModal(index, bdIndex)}
                                >
                                  Sửa
                                </Button>
                                <Button
                                  size="small"
                                  danger
                                  onClick={() => removeBreakdown(index, bdIndex)}
                                >
                                  Xóa
                                </Button>
                              </Space>
                            ),
                          },
                        ]}
                        rowKey={(bd) => `breakdown-${index}-${bd.productVariantId}`}
                        pagination={false}
                        size="small"
                      />
                    ) : (
                      <Text type="secondary">Chưa có breakdown nào</Text>
                    )}
                    <Button
                      type="link"
                      size="small"
                      onClick={() => openBreakdownModal(index)}
                      style={{ marginTop: 8 }}
                    >
                      + Thêm breakdown
                    </Button>
                  </div>
                ),
              }}
            />
          </Card>
        </Form>
      </Space>

      {/* Breakdown Modal */}
      <Modal
        title="Quản lý Breakdown"
        open={breakdownModal.visible}
        onOk={saveBreakdown}
        onCancel={() => setBreakdownModal({ ...breakdownModal, visible: false })}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Form.Item label="Product Variant ID">
            <Input
              value={breakdownModal.data.productVariantId}
              onChange={(e) =>
                setBreakdownModal({
                  ...breakdownModal,
                  data: { ...breakdownModal.data, productVariantId: e.target.value },
                })
              }
              placeholder="Nhập Product Variant ID"
            />
          </Form.Item>
          <Form.Item label="Số lượng">
            <InputNumber
              min={0}
              value={parseFloat(breakdownModal.data.qty || "0")}
              onChange={(v) =>
                setBreakdownModal({
                  ...breakdownModal,
                  data: { ...breakdownModal.data, qty: String(v || 0) },
                })
              }
              style={{ width: "100%" }}
              placeholder="Nhập số lượng"
            />
          </Form.Item>
        </Space>
      </Modal>
    </div>
  );
}
