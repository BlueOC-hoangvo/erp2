import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Space,
  Typography,
  Row,
  Col,
  message,
  Divider,
  Table,
  Modal
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { createProductionOrder } from '../api/production-orders.api';
import type { ProductionOrderCreate } from '../types';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

interface BreakdownItem {
  key: string;
  productVariantId: number;
  sizeName: string;
  sizeCode: string;
  colorName: string;
  colorCode: string;
  qtyPlan: number;
}

const ProductionOrderForm: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [breakdowns, setBreakdowns] = useState<BreakdownItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<number[]>([]);

  // Mock data for product variants - trong thực tế sẽ fetch từ API
  const mockProductVariants = [
    { id: 1, size: { name: 'S', code: 'S' }, color: { name: 'Đỏ', code: 'RED' } },
    { id: 2, size: { name: 'M', code: 'M' }, color: { name: 'Đỏ', code: 'RED' } },
    { id: 3, size: { name: 'L', code: 'L' }, color: { name: 'Đỏ', code: 'RED' } },
    { id: 4, size: { name: 'S', code: 'S' }, color: { name: 'Xanh', code: 'BLUE' } },
    { id: 5, size: { name: 'M', code: 'M' }, color: { name: 'Xanh', code: 'BLUE' } },
    { id: 6, size: { name: 'L', code: 'L' }, color: { name: 'Xanh', code: 'BLUE' } },
  ];

  const createMutation = useMutation({
    mutationFn: createProductionOrder,
    onSuccess: (data) => {
      message.success('Tạo lệnh sản xuất thành công');
      navigate(`/production/orders/${data.data.id}`);
    },
    onError: (error: any) => {
      message.error(error?.message || 'Có lỗi khi tạo lệnh sản xuất');
    },
  });

  const handleSubmit = async (values: any) => {
    if (breakdowns.length === 0) {
      message.error('Vui lòng thêm ít nhất một breakdown');
      return;
    }

    const totalQtyPlan = breakdowns.reduce((sum, item) => sum + item.qtyPlan, 0);
    
    const orderData: ProductionOrderCreate = {
      moNo: values.moNo,
      productStyleId: values.productStyleId,
      qtyPlan: totalQtyPlan,
      startDate: values.startDate?.format('YYYY-MM-DD'),
      dueDate: values.dueDate?.format('YYYY-MM-DD'),
      note: values.note,
      salesOrderItemId: values.salesOrderItemId || null,
      breakdowns: breakdowns.map(item => ({
        productVariantId: item.productVariantId,
        qtyPlan: item.qtyPlan,
      }))
    };

    createMutation.mutate(orderData);
  };

  const handleAddBreakdowns = () => {
    setModalVisible(true);
  };

  const handleModalOk = () => {
    const newBreakdowns: BreakdownItem[] = selectedVariants.map((variantId, index) => {
      const variant = mockProductVariants.find(v => v.id === variantId);
      return {
        key: `${variantId}_${Date.now()}_${index}`,
        productVariantId: variantId,
        sizeName: variant?.size.name || '',
        sizeCode: variant?.size.code || '',
        colorName: variant?.color.name || '',
        colorCode: variant?.color.code || '',
        qtyPlan: 0,
      };
    });

    setBreakdowns([...breakdowns, ...newBreakdowns]);
    setSelectedVariants([]);
    setModalVisible(false);
  };

  const handleUpdateBreakdown = (key: string, field: keyof BreakdownItem, value: any) => {
    setBreakdowns(breakdowns.map(item => 
      item.key === key ? { ...item, [field]: value } : item
    ));
  };

  const handleRemoveBreakdown = (key: string) => {
    setBreakdowns(breakdowns.filter(item => item.key !== key));
  };

  const totalQty = breakdowns.reduce((sum, item) => sum + item.qtyPlan, 0);

  const breakdownColumns = [
    {
      title: 'Size',
      dataIndex: 'sizeName',
      key: 'sizeName',
      width: 80,
    },
    {
      title: 'Mã Size',
      dataIndex: 'sizeCode',
      key: 'sizeCode',
      width: 80,
    },
    {
      title: 'Màu',
      dataIndex: 'colorName',
      key: 'colorName',
      width: 100,
    },
    {
      title: 'Mã Màu',
      dataIndex: 'colorCode',
      key: 'colorCode',
      width: 100,
    },
    {
      title: 'Số lượng',
      dataIndex: 'qtyPlan',
      key: 'qtyPlan',
      width: 120,
      render: (qty: number, record: BreakdownItem) => (
        <InputNumber
          min={0}
          value={qty}
          onChange={(value) => handleUpdateBreakdown(record.key, 'qtyPlan', value)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 80,
      render: (_: any, record: BreakdownItem) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveBreakdown(record.key)}
        />
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Space>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/production/orders')}
          >
            Quay lại
          </Button>
          <Title level={3} style={{ margin: 0 }}>
            Tạo lệnh sản xuất mới
          </Title>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          startDate: dayjs(),
          dueDate: dayjs().add(7, 'day'),
        }}
      >
        <Row gutter={[24, 0]}>
          {/* Left Column */}
          <Col xs={24} lg={16}>
            <Card title="Thông tin lệnh sản xuất" className="mb-6">
              <Row gutter={[16, 0]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Mã lệnh (MO No)"
                    name="moNo"
                    rules={[{ required: true, message: 'Vui lòng nhập mã lệnh' }]}
                  >
                    <Input placeholder="Nhập mã lệnh sản xuất" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="ID Kiểu dáng sản phẩm"
                    name="productStyleId"
                    rules={[{ required: true, message: 'Vui lòng chọn kiểu dáng sản phẩm' }]}
                  >
                    <InputNumber 
                      placeholder="ID kiểu dáng" 
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 0]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Ngày bắt đầu"
                    name="startDate"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
                  >
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Ngày kết thúc"
                    name="dueDate"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
                  >
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 0]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="SO Item ID (tùy chọn)"
                    name="salesOrderItemId"
                  >
                    <InputNumber 
                      placeholder="ID của Sales Order Item" 
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Ghi chú"
                name="note"
              >
                <TextArea rows={4} placeholder="Ghi chú về lệnh sản xuất" />
              </Form.Item>
            </Card>

            {/* Breakdowns Section */}
            <Card 
              title={`Phân tích theo Size/Color (Tổng: ${totalQty.toLocaleString()})`}
              extra={
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={handleAddBreakdowns}
                >
                  Thêm breakdown
                </Button>
              }
            >
              <Table
                columns={breakdownColumns}
                dataSource={breakdowns}
                pagination={false}
                size="small"
                locale={{ emptyText: 'Chưa có breakdown nào. Click "Thêm breakdown" để bắt đầu.' }}
                rowKey="key"
              />
            </Card>
          </Col>

          {/* Right Column */}
          <Col xs={24} lg={8}>
            <Card title="Thông tin tổng quan" className="mb-6">
              <div className="space-y-4">
                <div>
                  <strong>Tổng số lượng kế hoạch:</strong>
                  <div className="text-2xl font-bold text-blue-600">
                    {totalQty.toLocaleString()}
                  </div>
                </div>
                <Divider />
                <div>
                  <strong>Số lượng breakdown:</strong>
                  <div className="text-lg">{breakdowns.length}</div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="space-y-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  size="large"
                  block
                  loading={createMutation.isPending}
                  disabled={breakdowns.length === 0}
                >
                  Tạo lệnh sản xuất
                </Button>
                <Button
                  size="large"
                  block
                  onClick={() => navigate('/production/orders')}
                >
                  Hủy
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Form>

      {/* Modal for selecting variants */}
      <Modal
        title="Chọn variants để thêm breakdown"
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        okText="Thêm"
        cancelText="Hủy"
        okButtonProps={{ disabled: selectedVariants.length === 0 }}
      >
        <div className="mb-4">
          <p>Chọn các variants (Size/Màu) để tạo breakdown:</p>
        </div>
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Chọn variants..."
          value={selectedVariants}
          onChange={setSelectedVariants}
        >
          {mockProductVariants.map(variant => (
            <Option key={variant.id} value={variant.id}>
              {variant.size.name}/{variant.size.code} - {variant.color.name}/{variant.color.code}
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default ProductionOrderForm;
