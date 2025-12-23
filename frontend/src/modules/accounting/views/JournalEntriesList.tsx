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
  DatePicker,
  Tooltip,
  Popconfirm,
  message,
  Divider,
  Typography
} from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  BankOutlined,
  CalculatorOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

import type { JournalEntryEntity, JournalEntryItem } from '../types';
import {
  listJournalEntries,
  listAccounts,
  createJournalEntry,
  getAccountingStats
} from '../fake/accounting.store';
import { JOURNAL_ENTRY_STATUSES } from '../types';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const JournalEntriesList: React.FC = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntryEntity[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntryEntity | null>(null);
  const [viewEntry, setViewEntry] = useState<JournalEntryEntity | null>(null);
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const entriesData = listJournalEntries();
      const accountsData = listAccounts();
      const statsData = getAccountingStats();
      setEntries(entriesData);
      setAccounts(accountsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading journal entries:', error);
      message.error('Lỗi khi tải dữ liệu bút toán');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = () => {
    setEditingEntry(null);
    form.resetFields();
    form.setFieldsValue({
      entryDate: new Date(),
      items: [{}, {}] // Start with 2 empty lines
    });
    setIsModalVisible(true);
  };

  const handleView = (entry: JournalEntryEntity) => {
    setViewEntry(entry);
  };

  const handleEdit = (entry: JournalEntryEntity) => {
    setEditingEntry(entry);
    form.setFieldsValue(entry);
    setIsModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      // Calculate totals
      const totalDebit = values.items.reduce((sum: number, item: any) => 
        sum + (Number(item.debitAmount) || 0), 0
      );
      const totalCredit = values.items.reduce((sum: number, item: any) => 
        sum + (Number(item.creditAmount) || 0), 0
      );

      // Check if balanced
      if (Math.abs(totalDebit - totalCredit) > 0.01) {
        message.error('Tổng Nợ và Tín dụng phải bằng nhau');
        return;
      }

      const entryData = {
        ...values,
        totalDebit,
        totalCredit,
        status: 'DRAFT' as const,
        source: 'MANUAL' as const,
        createdBy: 'accountant'
      };

      createJournalEntry(entryData);
      message.success('Tạo bút toán thành công');
      setIsModalVisible(false);
      loadData();
    } catch (error) {
      message.error('Lỗi khi lưu bút toán');
    }
  };

  const getStatusColor = (status: string) => {
    const statusConfig = JOURNAL_ENTRY_STATUSES.find(s => s.key === status);
    return statusConfig?.color || 'default';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'POSTED':
        return <CheckCircleOutlined />;
      case 'DRAFT':
        return <ClockCircleOutlined />;
      case 'REVERSED':
        return <DeleteOutlined />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const columns: ColumnsType<JournalEntryEntity> = [
    {
      title: 'Số bút toán',
      dataIndex: 'entryNo',
      key: 'entryNo',
      width: 120,
      render: (text: string) => <strong>{text}</strong>
    },
    {
      title: 'Ngày',
      dataIndex: 'entryDate',
      key: 'entryDate',
      width: 100,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN')
    },
    {
      title: 'Diễn giải',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => (
        <Text ellipsis style={{ maxWidth: 200 }}>{text}</Text>
      )
    },
    {
      title: 'Tổng Nợ',
      dataIndex: 'totalDebit',
      key: 'totalDebit',
      width: 120,
      align: 'right',
      render: (amount: number) => formatCurrency(amount)
    },
    {
      title: 'Tổng Có',
      dataIndex: 'totalCredit',
      key: 'totalCredit',
      width: 120,
      align: 'right',
      render: (amount: number) => formatCurrency(amount)
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const statusConfig = JOURNAL_ENTRY_STATUSES.find(s => s.key === status);
        return (
          <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
            {statusConfig?.label || status}
          </Tag>
        );
      }
    },
    {
      title: 'Nguồn',
      dataIndex: 'source',
      key: 'source',
      width: 100,
      render: (source: string) => (
        <Tag>{source === 'AUTO' ? 'Tự động' : source === 'MANUAL' ? 'Thủ công' : 'Import'}</Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 140,
      render: (_, record: JournalEntryEntity) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          {record.status === 'DRAFT' && (
            <>
              <Tooltip title="Chỉnh sửa">
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(record)}
                />
              </Tooltip>
              <Tooltip title="Xóa">
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa bút toán này?"
                  onConfirm={() => {}}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button type="link" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Tooltip>
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Quản lý bút toán kế toán</h1>
        <p className="text-gray-600">Ghi sổ và quản lý các nghiệp vụ kế toán</p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng tài khoản"
              value={stats.totalAccounts}
              prefix={<BankOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng bút toán"
              value={stats.totalEntries}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đã ghi sổ"
              value={stats.postedEntries}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Chênh lệch"
              value={Math.abs(stats.balance)}
              prefix={<CalculatorOutlined />}
              precision={0}
              valueStyle={{ color: Math.abs(stats.balance) < 1000 ? '#52c41a' : '#ff4d4f' }}
              formatter={(value) => formatCurrency(Number(value))}
            />
          </Card>
        </Col>
      </Row>

      {/* Actions */}
      <Card className="mb-4">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} lg={8}>
            <Search placeholder="Tìm kiếm bút toán..." />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày" />
          </Col>
          <Col xs={24} sm={24} lg={8}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} block>
              Tạo bút toán mới
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Journal Entries Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={entries}
          rowKey="id"
          loading={loading}
          pagination={{
            total: entries.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} bút toán`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingEntry ? 'Chỉnh sửa bút toán' : 'Tạo bút toán mới'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        width={1000}
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
                name="entryDate"
                label="Ngày bút toán"
                rules={[{ required: true, message: 'Vui lòng chọn ngày bút toán' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="description"
                label="Diễn giải"
                rules={[{ required: true, message: 'Vui lòng nhập diễn giải' }]}
              >
                <Input placeholder="Mô tả nghiệp vụ" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Chi tiết bút toán</Divider>

          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                <div className="grid grid-cols-12 gap-2 mb-2 font-medium text-sm">
                  <div className="col-span-1">#</div>
                  <div className="col-span-4">Tài khoản</div>
                  <div className="col-span-4">Diễn giải</div>
                  <div className="col-span-1 text-right">Nợ</div>
                  <div className="col-span-1 text-right">Có</div>
                  <div className="col-span-1"></div>
                </div>
                
                {fields.map(({ key, name, ...restField }) => (
                  <Row key={key} gutter={8} className="mb-2">
                    <Col span={1}>
                      <Text>{name + 1}</Text>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        {...restField}
                        name={[name, 'accountId']}
                        rules={[{ required: true, message: 'Vui lòng chọn tài khoản' }]}
                      >
                        <Select placeholder="Chọn tài khoản" showSearch>
                          {accounts.filter(acc => acc.isPostable).map(account => (
                            <Option key={account.id} value={account.id}>
                              {account.code} - {account.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        {...restField}
                        name={[name, 'description']}
                      >
                        <Input placeholder="Diễn giải chi tiết" />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Form.Item
                        {...restField}
                        name={[name, 'debitAmount']}
                      >
                        <Input type="number" placeholder="0" />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Form.Item
                        {...restField}
                        name={[name, 'creditAmount']}
                      >
                        <Input type="number" placeholder="0" />
                      </Form.Item>
                    </Col>
                    <Col span={1}>
                      <Button 
                        type="link" 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => remove(name)}
                        disabled={fields.length <= 2}
                      />
                    </Col>
                  </Row>
                ))}
                
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block>
                  Thêm dòng
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      {/* View Entry Modal */}
      <Modal
        title="Chi tiết bút toán"
        open={!!viewEntry}
        onCancel={() => setViewEntry(null)}
        footer={null}
        width={800}
      >
        {viewEntry && (
          <div>
            <Row gutter={16} className="mb-4">
              <Col span={8}>
                <Text strong>Số bút toán:</Text>
                <div>{viewEntry.entryNo}</div>
              </Col>
              <Col span={8}>
                <Text strong>Ngày:</Text>
                <div>{new Date(viewEntry.entryDate).toLocaleDateString('vi-VN')}</div>
              </Col>
              <Col span={8}>
                <Text strong>Trạng thái:</Text>
                <div>
                  <Tag color={getStatusColor(viewEntry.status)} icon={getStatusIcon(viewEntry.status)}>
                    {JOURNAL_ENTRY_STATUSES.find(s => s.key === viewEntry.status)?.label}
                  </Tag>
                </div>
              </Col>
            </Row>
            
            <Text strong>Diễn giải:</Text>
            <div className="mb-4">{viewEntry.description}</div>
            
            <Divider />
            
            <Table
              dataSource={viewEntry.items}
              pagination={false}
              size="small"
              columns={[
                {
                  title: 'Tài khoản',
                  dataIndex: 'accountCode',
                  key: 'accountCode',
                  render: (code, record) => (
                    <div>
                      <div className="font-medium">{code}</div>
                      <div className="text-xs text-gray-500">{record.accountName}</div>
                    </div>
                  )
                },
                {
                  title: 'Diễn giải',
                  dataIndex: 'description',
                  key: 'description'
                },
                {
                  title: 'Nợ',
                  dataIndex: 'debitAmount',
                  key: 'debitAmount',
                  align: 'right',
                  render: (amount) => amount > 0 ? formatCurrency(amount) : ''
                },
                {
                  title: 'Có',
                  dataIndex: 'creditAmount',
                  key: 'creditAmount',
                  align: 'right',
                  render: (amount) => amount > 0 ? formatCurrency(amount) : ''
                }
              ]}
            />
            
            <Row className="mt-4">
              <Col span={12}></Col>
              <Col span={6} className="text-right">
                <Text strong>Tổng Nợ:</Text>
              </Col>
              <Col span={6} className="text-right">
                <Text strong>{formatCurrency(viewEntry.totalDebit)}</Text>
              </Col>
            </Row>
            <Row>
              <Col span={12}></Col>
              <Col span={6} className="text-right">
                <Text strong>Tổng Có:</Text>
              </Col>
              <Col span={6} className="text-right">
                <Text strong>{formatCurrency(viewEntry.totalCredit)}</Text>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default JournalEntriesList;
