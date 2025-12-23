import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Statistic,
  Row,
  Col,
  Input,
  Modal,
  Form,
  Select,
  Tooltip,
  Popconfirm,
  message
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  BankOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

import type { SupplierEntity } from '../types';
import {
  listSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getPurchasingStats
} from '../fake/purchasing.store';
import { SUPPLIER_STATUSES } from '../types';

const { Search } = Input;
const { Option } = Select;

const SuppliersList: React.FC = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<SupplierEntity[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<SupplierEntity | null>(null);
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const suppliersData = listSuppliers();
      const statsData = getPurchasingStats();
      setSuppliers(suppliersData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading suppliers:', error);
      message.error('Lỗi khi tải dữ liệu nhà cung cấp');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredSuppliers = suppliers.filter(supplier => {
    if (!searchTerm) return true;
    return (
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.phone.includes(searchTerm)
    );
  });

  const handleCreate = () => {
    setEditingSupplier(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (supplier: SupplierEntity) => {
    setEditingSupplier(supplier);
    form.setFieldsValue(supplier);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const success = deleteSupplier(id);
      if (success) {
        message.success('Xóa nhà cung cấp thành công');
        loadData();
      } else {
        message.error('Không thể xóa nhà cung cấp');
      }
    } catch (error) {
      message.error('Lỗi khi xóa nhà cung cấp');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingSupplier) {
        const updated = updateSupplier(editingSupplier.id, values);
        if (updated) {
          message.success('Cập nhật nhà cung cấp thành công');
        } else {
          message.error('Không thể cập nhật nhà cung cấp');
        }
      } else {
        createSupplier(values);
        message.success('Tạo nhà cung cấp thành công');
      }
      setIsModalVisible(false);
      loadData();
    } catch (error) {
      message.error('Lỗi khi lưu nhà cung cấp');
    }
  };

  const getStatusColor = (status: string) => {
    const statusConfig = SUPPLIER_STATUSES.find(s => s.key === status);
    return statusConfig?.color || 'default';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const columns: ColumnsType<SupplierEntity> = [
    {
      title: 'Mã NCC',
      dataIndex: 'code',
      key: 'code',
      width: 100,
      render: (text: string) => <strong>{text}</strong>
    },
    {
      title: 'Tên nhà cung cấp',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      render: (text: string, record: SupplierEntity) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <UserOutlined />
            {record.contactPerson}
          </div>
        </div>
      )
    },
    {
      title: 'Liên hệ',
      key: 'contact',
      width: 150,
      render: (_, record: SupplierEntity) => (
        <div className="text-xs">
          <div className="flex items-center gap-1 mb-1">
            <PhoneOutlined />
            {record.phone}
          </div>
          <div className="flex items-center gap-1">
            <MailOutlined />
            {record.email}
          </div>
        </div>
      )
    },
    {
      title: 'Điều khoản TT',
      dataIndex: 'paymentTerms',
      key: 'paymentTerms',
      width: 100,
      render: (days: number) => `${days} ngày`
    },
    {
      title: 'Hạn mức',
      dataIndex: 'creditLimit',
      key: 'creditLimit',
      width: 120,
      render: (amount: number) => formatCurrency(amount)
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusConfig = SUPPLIER_STATUSES.find(s => s.key === status);
        return (
          <Tag color={getStatusColor(status)}>
            {statusConfig?.label || status}
          </Tag>
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      render: (_, record: SupplierEntity) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa nhà cung cấp này?"
              onConfirm={() => handleDelete(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Quản lý nhà cung cấp</h1>
        <p className="text-gray-600">Thông tin và quản lý các nhà cung cấp trong hệ thống</p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Tổng nhà cung cấp"
              value={stats.totalSuppliers}
              prefix={<BankOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Đơn hàng chờ duyệt"
              value={stats.pendingOrders}
              prefix={<PlusOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} lg={8}>
          <Card>
            <Statistic
              title="Giá trị còn nợ"
              value={stats.outstandingAmount}
              prefix={<BankOutlined />}
              precision={0}
              valueStyle={{ color: '#52c41a' }}
              formatter={(value) => formatCurrency(Number(value))}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters and Actions */}
      <Card className="mb-4">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} lg={8}>
            <Search
              placeholder="Tìm kiếm nhà cung cấp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Select
              placeholder="Trạng thái"
              allowClear
              style={{ width: '100%' }}
              onChange={() => {}}
            >
              {SUPPLIER_STATUSES.map(status => (
                <Option key={status.key} value={status.key}>
                  {status.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={24} lg={8}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} block>
              Thêm nhà cung cấp
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Suppliers Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredSuppliers}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredSuppliers.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} nhà cung cấp`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingSupplier ? 'Chỉnh sửa nhà cung cấp' : 'Thêm nhà cung cấp mới'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="code"
                label="Mã nhà cung cấp"
                rules={[{ required: true, message: 'Vui lòng nhập mã nhà cung cấp' }]}
              >
                <Input placeholder="VD: SUP001" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên nhà cung cấp"
                rules={[{ required: true, message: 'Vui lòng nhập tên nhà cung cấp' }]}
              >
                <Input placeholder="Tên công ty" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="contactPerson"
                label="Người liên hệ"
                rules={[{ required: true, message: 'Vui lòng nhập tên người liên hệ' }]}
              >
                <Input placeholder="Họ và tên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
              >
                <Input placeholder="0123456789" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input placeholder="email@example.com" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          >
            <Input.TextArea rows={3} placeholder="Địa chỉ đầy đủ" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="paymentTerms"
                label="Điều khoản thanh toán (ngày)"
                rules={[{ required: true, message: 'Vui lòng nhập số ngày' }]}
              >
                <Input type="number" placeholder="30" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="creditLimit"
                label="Hạn mức tín dụng (VND)"
                rules={[{ required: true, message: 'Vui lòng nhập hạn mức' }]}
              >
                <Input type="number" placeholder="100000000" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="taxCode"
                label="Mã số thuế"
              >
                <Input placeholder="0123456789" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="bankAccount"
                label="Tài khoản ngân hàng"
              >
                <Input placeholder="1234567890" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select placeholder="Chọn trạng thái">
              {SUPPLIER_STATUSES.map(status => (
                <Option key={status.key} value={status.key}>
                  {status.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SuppliersList;
