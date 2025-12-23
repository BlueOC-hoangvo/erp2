import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Progress,
  Tag,
  Button,
  DatePicker,
  Select,
  Space,
  Typography,
  List,
  Avatar,
  Timeline,
  Alert,
  Badge,
  Tooltip
} from 'antd';
import {
  CalculatorOutlined,
  DollarOutlined,
  BankOutlined,
  FileTextOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  EyeOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

// Helper functions for formatting
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('vi-VN');
};
import {
  listJournalEntries,
  listAccounts,
  getAccountingStats
} from '../fake/accounting.store';
import type { JournalEntryEntity, AccountEntity } from '../types';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const AccountingDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [journalEntries, setJournalEntries] = useState<JournalEntryEntity[]>([]);
  const [accounts, setAccounts] = useState<AccountEntity[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    try {
      const entriesData = listJournalEntries();
      const accountsData = listAccounts();
      const statsData = getAccountingStats();
      setJournalEntries(entriesData);
      setAccounts(accountsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading accounting dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Chart data for revenue vs expenses
  const revenueExpenseData = [
    { month: 'Tháng 1', revenue: 1200000000, expense: 980000000 },
    { month: 'Tháng 2', revenue: 1450000000, expense: 1150000000 },
    { month: 'Tháng 3', revenue: 980000000, expense: 920000000 },
    { month: 'Tháng 4', revenue: 1670000000, expense: 1340000000 },
    { month: 'Tháng 5', revenue: 1890000000, expense: 1520000000 },
    { month: 'Tháng 6', revenue: 2100000000, expense: 1680000000 },
  ];

  // Chart data for account balance distribution
  const accountBalanceData = [
    { category: 'Tiền mặt', balance: 450000000, color: '#52c41a' },
    { category: 'Ngân hàng', balance: 1250000000, color: '#1890ff' },
    { category: 'Khoản phải thu', balance: 890000000, color: '#722ed1' },
    { category: 'Khoản phải trả', balance: -560000000, color: '#ff4d4f' },
    { category: 'Tồn kho', balance: 2100000000, color: '#faad14' },
  ];

  // Chart data for journal entries by month
  const journalEntriesByMonth = [
    { month: 'Tháng 1', entries: 245, amount: 2180000000 },
    { month: 'Tháng 2', entries: 312, amount: 2600000000 },
    { month: 'Tháng 3', entries: 189, amount: 1820000000 },
    { month: 'Tháng 4', entries: 378, amount: 3010000000 },
    { month: 'Tháng 5', entries: 425, amount: 3410000000 },
    { month: 'Tháng 6', entries: 467, amount: 3780000000 },
  ];

  // Top accounts by balance
  const topAccounts = accounts
    .filter(account => account.isPostable)
    .slice(0, 8)
    .map(account => ({
      ...account,
      balance: Math.floor(Math.random() * 1000000000) - 500000000,
      transactions: Math.floor(Math.random() * 500) + 50,
    }))
    .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance));

  // Recent journal entries
  const recentEntries = journalEntries
    .slice(0, 5)
    .map(entry => ({
      ...entry,
      user: ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D'][Math.floor(Math.random() * 4)],
      transactionCount: Math.floor(Math.random() * 10) + 2,
    }));

  // Pending approvals
  const pendingApprovals = [
    {
      id: 1,
      type: 'journal_entry',
      title: 'Bút toán kê khai thuế TNDN Q4',
      amount: 45000000,
      submittedBy: 'Nguyễn Văn A',
      submittedAt: '2024-01-14T10:30:00Z',
      priority: 'high'
    },
    {
      id: 2,
      type: 'payment',
      title: 'Thanh toán nhà cung cấp ABC Corp',
      amount: 125000000,
      submittedBy: 'Trần Thị B',
      submittedAt: '2024-01-14T14:15:00Z',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'expense',
      title: 'Chi phí văn phòng tháng 1/2024',
      amount: 8500000,
      submittedBy: 'Lê Văn C',
      submittedAt: '2024-01-14T16:45:00Z',
      priority: 'low'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff4d4f';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Cao';
      case 'medium': return 'Trung bình';
      case 'low': return 'Thấp';
      default: return 'Không xác định';
    }
  };

  const topAccountsColumns: ColumnsType<any> = [
    {
      title: 'Tài khoản',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      render: (code: string, record: any) => (
        <div>
          <div className="font-medium">{code}</div>
          <div className="text-sm text-gray-500">{record.name}</div>
        </div>
      )
    },
    {
      title: 'Số dư',
      dataIndex: 'balance',
      key: 'balance',
      align: 'right',
      render: (balance: number) => (
        <span className={`font-medium ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {formatCurrency(balance)}
        </span>
      )
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={
          type === 'ASSET' ? 'blue' :
          type === 'LIABILITY' ? 'red' :
          type === 'EQUITY' ? 'purple' :
          type === 'REVENUE' ? 'green' : 'orange'
        }>
          {type === 'ASSET' ? 'Tài sản' :
           type === 'LIABILITY' ? 'Nợ phải trả' :
           type === 'EQUITY' ? 'Vốn chủ sở hữu' :
           type === 'REVENUE' ? 'Doanh thu' : 'Chi phí'}
        </Tag>
      )
    },
    {
      title: 'Số giao dịch',
      dataIndex: 'transactions',
      key: 'transactions',
      align: 'center',
      render: (count: number) => (
        <Badge count={count} style={{ backgroundColor: '#52c41a' }} />
      )
    }
  ];

  const recentEntriesColumns: ColumnsType<any> = [
    {
      title: 'Số bút toán',
      dataIndex: 'entryNo',
      key: 'entryNo',
      render: (text: string) => <strong>{text}</strong>
    },
    {
      title: 'Ngày',
      dataIndex: 'entryDate',
      key: 'entryDate',
      render: (date: string) => formatDate(date)
    },
    {
      title: 'Diễn giải',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: 'Số tiền',
      dataIndex: 'totalDebit',
      key: 'totalDebit',
      align: 'right',
      render: (amount: number) => formatCurrency(amount)
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'POSTED' ? 'green' : status === 'DRAFT' ? 'orange' : 'red'}>
          {status === 'POSTED' ? 'Đã ghi sổ' : status === 'DRAFT' ? 'Nháp' : 'Đã hủy'}
        </Tag>
      )
    }
  ];

  const renderKPI = (title: string, value: number, prefix: React.ReactNode, suffix?: string, trend?: number, color?: string, precision: number = 0) => (
    <Card className="h-full">
      <Statistic
        title={title}
        value={value}
        precision={precision}
        prefix={prefix}
        suffix={suffix}
        valueStyle={{ color: color || '#000' }}
      />
      {trend !== undefined && (
        <div className="mt-2 flex items-center text-sm">
          {trend > 0 ? (
            <ArrowUpOutlined className="text-green-500 mr-1" />
          ) : (
            <ArrowDownOutlined className="text-red-500 mr-1" />
          )}
          <span className={trend > 0 ? 'text-green-500' : 'text-red-500'}>
            {Math.abs(trend)}% so với tháng trước
          </span>
        </div>
      )}
    </Card>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <Title level={2} className="mb-2">Dashboard Kế toán</Title>
            <Text type="secondary">
              Tổng quan tình hình tài chính và quản lý kế toán
            </Text>
          </div>
          <Space>
            <Select
              placeholder="Trạng thái"
              style={{ width: 120 }}
              value={selectedStatus}
              onChange={setSelectedStatus}
            >
              <Option value="">Tất cả</Option>
              <Option value="POSTED">Đã ghi sổ</Option>
              <Option value="DRAFT">Nháp</Option>
              <Option value="REVERSED">Đã hủy</Option>
            </Select>
            <RangePicker />
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => navigate('/accounting/journal-entries')}
            >
              Tạo bút toán
            </Button>
          </Space>
        </div>
      </div>

      {/* KPI Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          {renderKPI('Tổng tài sản', 5670000000, <BankOutlined />, 'VND', 8.5, '#1890ff')}
        </Col>
        <Col xs={24} sm={12} lg={6}>
          {renderKPI('Doanh thu tháng', 2100000000, <ArrowUpOutlined />, 'VND', 12.3, '#52c41a')}
        </Col>
        <Col xs={24} sm={12} lg={6}>
          {renderKPI('Chi phí tháng', 1680000000, <ArrowDownOutlined />, 'VND', 5.7, '#ff4d4f')}
        </Col>
        <Col xs={24} sm={12} lg={6}>
          {renderKPI('Lợi nhuận ròng', 420000000, <DollarOutlined />, 'VND', 18.2, '#722ed1')}
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={16}>
          <Card title="Doanh thu vs Chi phí 6 tháng gần đây" className="h-80">
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <div className="text-center">
                <div className="text-4xl text-gray-400 mb-2">📊</div>
                <div className="text-gray-600">Biểu đồ doanh thu vs chi phí</div>
                <div className="text-sm text-gray-500 mt-1">
                  {revenueExpenseData.map(item => (
                    <div key={item.month} className="text-left">
                      {item.month}: Doanh thu {formatCurrency(item.revenue)}, Chi phí {formatCurrency(item.expense)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Phân bố tài khoản" className="h-80">
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <div className="text-center">
                <div className="text-4xl text-gray-400 mb-2">🥧</div>
                <div className="text-gray-600">Biểu đồ phân bố tài khoản</div>
                <div className="text-sm text-gray-500 mt-1">
                  {accountBalanceData.map(item => (
                    <div key={item.category} className="text-left flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      {item.category}: {formatCurrency(item.balance)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Data Tables Row */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={14}>
          <Card 
            title="Top tài khoản theo số dư" 
            extra={
              <Button type="link" onClick={() => navigate('/accounting/chart-of-accounts')}>
                Xem tất cả
              </Button>
            }
          >
            <Table
              columns={topAccountsColumns}
              dataSource={topAccounts}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card 
            title="Bút toán gần đây"
            extra={
              <Button type="link" onClick={() => navigate('/accounting/journal-entries')}>
                Xem tất cả
              </Button>
            }
          >
            <Table
              columns={recentEntriesColumns}
              dataSource={recentEntries}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>

      {/* Journal Entries Trend and Pending Approvals */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={16}>
          <Card title="Xu hướng bút toán 6 tháng gần đây" className="h-80">
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <div className="text-center">
                <div className="text-4xl text-gray-400 mb-2">📈</div>
                <div className="text-gray-600">Biểu đồ xu hướng bút toán</div>
                <div className="text-sm text-gray-500 mt-1">
                  {journalEntriesByMonth.map(item => (
                    <div key={item.month} className="text-left">
                      {item.month}: {item.entries} bút toán • {formatCurrency(item.amount)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Phê duyệt chờ xử lý">
            <List
              dataSource={pendingApprovals}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{item.title}</span>
                        <Tag color={getPriorityColor(item.priority)}>
                          {getPriorityText(item.priority)}
                        </Tag>
                      </div>
                    }
                    description={
                      <div>
                        <div className="text-xs text-blue-600">{formatCurrency(item.amount)}</div>
                        <div className="text-xs text-gray-500">
                          Bởi {item.submittedBy} • {formatDate(item.submittedAt)}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Financial Alerts */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="Cảnh báo tài chính">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Alert
                message="Số dư tài khoản ngân hàng thấp"
                description="Tài khoản Vietcombank chỉ còn 45 triệu VNĐ. Cần nạp thêm tiền."
                type="warning"
                showIcon
                action={
                  <Button size="small" type="link">
                    Nạp tiền
                  </Button>
                }
              />
              <Alert
                message="3 bút toán chờ phê duyệt"
                description="Có 3 bút toán cần được phê duyệt để đảm bảo tính chính xác của sổ sách."
                type="info"
                showIcon
                action={
                  <Button size="small" type="link">
                    Phê duyệt ngay
                  </Button>
                }
              />
              <Alert
                message="Khoản phải thu quá hạn"
                description="Có 2 khoản phải thu đã quá hạn 30 ngày. Tổng giá trị: 180 triệu VNĐ."
                type="error"
                showIcon
                action={
                  <Button size="small" type="link">
                    Liên hệ khách hàng
                  </Button>
                }
              />
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AccountingDashboard;
