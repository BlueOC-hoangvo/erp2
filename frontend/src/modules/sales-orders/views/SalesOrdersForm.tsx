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
} from "antd";
import {
  ArrowLeftOutlined,
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { getSalesOrder } from "../fake/sales-orders.store";
import type {
  SalesOrderEntity,
  SoBreakdown,
} from "../fake/sales-orders.store";

interface BreakdownModalData {
  visible: boolean;
  breakdownIndex: number;
  itemIndex: number;
  data: {
    sizeCode: string;
    colorCode: string;
    qty: number;
  };
}

interface FormData {
  customerName: string;
  dueDate?: string;
  items: Array<{
    id: string;
    lineNo: number;
    productStyleId: string;
    productStyleCode?: string;
    itemName: string;
    uom: string;
    qtyTotal: number;
    unitPrice: number;
    amount: number;
    breakdowns: SoBreakdown[];
  }>;
}

const { Title } = Typography;
const { Option } = Select;

const uid = (prefix = "soi") =>
  `${prefix}_${Math.random().toString(16).slice(2)}_${Math.random()
    .toString(16)
    .slice(2)}`;

const productStyles = [
  { id: "STYLE_001", code: "TSH001", name: "Áo thun basic" },
  { id: "STYLE_002", code: "POLO002", name: "Áo polo" },
  { id: "STYLE_003", code: "HOOD003", name: "Áo hoodie" },
  { id: "STYLE_004", code: "TEE004", name: "Áo tee graphic" },
  { id: "STYLE_005", code: "LONG005", name: "Áo dài tay" },
];

const sizeCodes = ["XS", "S", "M", "L", "XL", "XXL"];
const colorCodes = ["BLACK", "WHITE", "RED", "BLUE", "GREEN", "GRAY"];

export function SalesOrdersForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    customerName: "",
    items: [],
  });

  const [breakdownModal, setBreakdownModal] = useState<BreakdownModalData>({
    visible: false,
    breakdownIndex: -1,
    itemIndex: -1,
    data: {
      sizeCode: "M",
      colorCode: "BLACK",
      qty: 0,
    },
  });

  useEffect(() => {
    if (id) {
      loadSalesOrder();
    }
  }, [id]);

  const loadSalesOrder = () => {
    if (!id) return;

    const so = getSalesOrder(id);
    if (!so) {
      message.error("Không tìm thấy đơn hàng");
      navigate("/sales-orders");
      return;
    }

    setFormData({
      customerName: so.customerName,
      dueDate: so.dueDate,
      items: so.items,
    });

    form.setFieldsValue({
      customerName: so.customerName,
      dueDate: so.dueDate ? dayjs(so.dueDate) : undefined,
    });
  };

  const addItem = () => {
    const newItem: FormData["items"][number] = {
      id: uid("soi"),
      lineNo: formData.items.length + 1,
      productStyleId: "",
      productStyleCode: "",
      itemName: "",
      uom: "pcs",
      qtyTotal: 0,
      unitPrice: 0,
      amount: 0,
      breakdowns: [],
    };

    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateItem = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === index) {
          const updated = { ...item, [field]: value };

          // Auto-update itemName and productStyleCode when productStyleId changes
          if (field === "productStyleId") {
            const style = productStyles.find((s) => s.id === value);
            if (style) {
              updated.itemName = style.name;
              updated.productStyleCode = style.code;
            }
          }

          // Recalculate amount when qty or price changes
          if (field === "qtyTotal" || field === "unitPrice") {
            updated.amount = Number(updated.qtyTotal) * Number(updated.unitPrice);
          }

          return updated;
        }
        return item;
      }),
    }));
  };

  const addBreakdown = (itemIndex: number) => {
    setBreakdownModal({
      visible: true,
      breakdownIndex: -1, // -1 means add new
      itemIndex,
      data: {
        sizeCode: "M",
        colorCode: "BLACK",
        qty: 0,
      },
    });
  };

  const editBreakdown = (itemIndex: number, breakdownIndex: number) => {
    const breakdown = formData.items[itemIndex].breakdowns[breakdownIndex];
    setBreakdownModal({
      visible: true,
      breakdownIndex,
      itemIndex,
      data: {
        sizeCode: breakdown.sizeCode,
        colorCode: breakdown.colorCode,
        qty: breakdown.qty,
      },
    });
  };

  const saveBreakdown = () => {
    const { itemIndex, breakdownIndex, data } = breakdownModal;

    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === itemIndex) {
          const newBreakdown: SoBreakdown = {
            id: uid("bd"),
            productVariantId: `${data.sizeCode}_${data.colorCode}`,
            sizeCode: data.sizeCode,
            colorCode: data.colorCode,
            qty: data.qty,
          };

          if (breakdownIndex === -1) {
            // Add new
            return {
              ...item,
              breakdowns: [...item.breakdowns, newBreakdown],
            };
          } else {
            // Edit existing
            const updatedBreakdowns = [...item.breakdowns];
            updatedBreakdowns[breakdownIndex] = {
              ...updatedBreakdowns[breakdownIndex],
              ...newBreakdown,
            };
            return {
              ...item,
              breakdowns: updatedBreakdowns,
            };
          }
        }
        return item;
      }),
    }));

    setBreakdownModal({ ...breakdownModal, visible: false });
  };

  const removeBreakdown = (itemIndex: number, breakdownIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === itemIndex) {
          return {
            ...item,
            breakdowns: item.breakdowns.filter((_, bi) => bi !== breakdownIndex),
          };
        }
        return item;
      }),
    }));
  };

  const handleSubmit = async (values: any) => {
    if (formData.items.length === 0) {
      message.error("Vui lòng thêm ít nhất một sản phẩm");
      return;
    }

    setSaving(true);

    try {
      // Save to localStorage (simulating API call)
      const salesOrders = JSON.parse(localStorage.getItem("fake_sales_orders_v2") || "[]");

      if (id) {
        // Update existing
        const index = salesOrders.findIndex((so: SalesOrderEntity) => so.id === id);
        if (index !== -1) {
          salesOrders[index] = {
            ...salesOrders[index],
            customerName: values.customerName,
            dueDate: values.dueDate?.format("YYYY-MM-DD"),
            items: formData.items,
            updatedAt: new Date().toISOString(),
          };
        }
      } else {
        // Create new
        const newOrder: SalesOrderEntity = {
          id: uid("so"),
          orderNo: `SO-${new Date().getFullYear()}-${String(salesOrders.length + 1).padStart(4, "0")}`,
          customerId: "CUST_" + Date.now(),
          customerName: values.customerName,
          status: "DRAFT",
          orderDate: new Date().toISOString(),
          dueDate: values.dueDate?.format("YYYY-MM-DD"),
          isInternal: false,
          items: formData.items,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        salesOrders.unshift(newOrder);
      }

      localStorage.setItem("fake_sales_orders_v2", JSON.stringify(salesOrders));
      message.success(id ? "Cập nhật đơn hàng thành công" : "Tạo đơn hàng thành công");
      navigate("/sales-orders");
    } catch (error) {
      message.error("Có lỗi xảy ra khi lưu đơn hàng");
    } finally {
      setSaving(false);
    }
  };

  const itemColumns = [
    {
      title: "Line",
      dataIndex: "lineNo",
      width: 60,
      render: (_: any, _record: FormData["items"][number], index: number) => (
        <span>{index + 1}</span>
      ),
    },
    {
      title: "Style",
      dataIndex: "productStyleId",
      width: 150,
      render: (value: string, _record: FormData["items"][number], index: number) => (
        <Select
          value={value}
          style={{ width: "100%" }}
          onChange={(v) => updateItem(index, "productStyleId", v)}
          placeholder="Chọn style"
        >
          {productStyles.map((style) => (
            <Option key={style.id} value={style.id}>
              {style.code}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "itemName",
      render: (value: string) => <span>{value || "-"}</span>,
    },
    {
      title: "SL",
      dataIndex: "qtyTotal",
      width: 100,
      render: (value: number, _record: FormData["items"][number], index: number) => (
        <InputNumber
          min={0}
          value={value}
          onChange={(v) => updateItem(index, "qtyTotal", v)}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "unitPrice",
      width: 120,
      render: (value: number, _record: FormData["items"][number], index: number) => (
        <InputNumber
          min={0}
          value={value}
          onChange={(v) => updateItem(index, "unitPrice", v)}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "amount",
      width: 120,
      render: (value: number) => (
        <span className="font-semibold">
          {Number(value || 0).toLocaleString("vi-VN")} VND
        </span>
      ),
    },
    {
      title: "Breakdown",
      key: "breakdown",
      width: 120,
      render: (_: any, record: FormData["items"][number], index: number) => (
        <Button
          type="link"
          size="small"
          onClick={() => addBreakdown(index)}
        >
          Quản lý ({record.breakdowns.length})
        </Button>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 80,
      render: (_: any, _record: FormData["items"][number], index: number) => (
        <Button
          type="text"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => removeItem(index)}
        />
      ),
    },
  ];

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
            loading={saving}
          >
            Lưu đơn hàng
          </Button>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            customerName: "",
          }}
        >
          <Card title="Thông tin cơ bản">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="customerName"
                label="Khách hàng"
                rules={[{ required: true, message: "Vui lòng nhập tên khách hàng" }]}
              >
                <Input placeholder="Nhập tên khách hàng" />
              </Form.Item>
              <Form.Item name="dueDate" label="Ngày giao hàng">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </div>
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
              dataSource={formData.items}
              columns={itemColumns}
              rowKey="id"
              pagination={false}
              expandable={{
                expandedRowRender: (record, index) => (
                  <div className="p-4">
                    <Title level={5}>Breakdown Size/Color</Title>
                    <Table
                      dataSource={record.breakdowns}
                      columns={[
                        { title: "Size", dataIndex: "sizeCode", width: 100 },
                        { title: "Color", dataIndex: "colorCode", width: 120 },
                        { title: "Variant ID", dataIndex: "productVariantId" },
                        {
                          title: "Qty",
                          dataIndex: "qty",
                          width: 100,
                          align: "right" as const,
                        },
                        {
                          title: "",
                          width: 80,
                          render: (_: any, _bd: SoBreakdown, bdIndex: number) => (
                            <Space>
                              <Button
                                size="small"
                                onClick={() => editBreakdown(index, bdIndex)}
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
                      rowKey="id"
                      pagination={false}
                      size="small"
                    />
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
          <div>
            <label>Size:</label>
            <Select
              value={breakdownModal.data.sizeCode}
              onChange={(v) =>
                setBreakdownModal({
                  ...breakdownModal,
                  data: { ...breakdownModal.data, sizeCode: v },
                })
              }
              style={{ width: "100%", marginTop: 8 }}
            >
              {sizeCodes.map((size) => (
                <Option key={size} value={size}>
                  {size}
                </Option>
              ))}
            </Select>
          </div>
          <div>
            <label>Color:</label>
            <Select
              value={breakdownModal.data.colorCode}
              onChange={(v) =>
                setBreakdownModal({
                  ...breakdownModal,
                  data: { ...breakdownModal.data, colorCode: v },
                })
              }
              style={{ width: "100%", marginTop: 8 }}
            >
              {colorCodes.map((color) => (
                <Option key={color} value={color}>
                  {color}
                </Option>
              ))}
            </Select>
          </div>
          <div>
            <label>Số lượng:</label>
            <InputNumber
              min={0}
              value={breakdownModal.data.qty}
              onChange={(v) =>
                setBreakdownModal({
                  ...breakdownModal,
                  data: { ...breakdownModal.data, qty: Number(v || 0) },
                })
              }
              style={{ width: "100%", marginTop: 8 }}
            />
          </div>
        </Space>
      </Modal>
    </div>
  );
}
