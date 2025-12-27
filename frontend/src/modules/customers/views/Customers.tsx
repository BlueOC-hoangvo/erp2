import { 
  Button, 
  Input, 
  Space, 
  Table, 
  Typography, 
  message, 
  Card, 
  Row, 
  Col, 
  Tag, 
  Avatar, 
  Dropdown,
  Select,
  Statistic
} from "antd";
import { 
  UserAddOutlined, 
  FilterOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ExportOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

import { getCustomers } from "@/modules/customers/api/get-customers";
import { deleteCustomer } from "@/modules/customers/api/delete-customer";
import type { Customer } from "@/modules/customers/types";
import CustomerFormModal from "@/modules/customers/components/CustomerFormModal";
import { useNavigate } from "react-router-dom";

const { Search } = Input;
const { Option } = Select;

export default function Customers() {
  const qc = useQueryClient();
  const nav = useNavigate();

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);

  const queryKey = useMemo(() => [
    "customers", 
    { q, status, sortBy, sortOrder, page, pageSize }
  ], [q, status, sortBy, sortOrder, page, pageSize]);

  const { data, isLoading, refetch } = useQuery({
    queryKey,
    queryFn: () => getCustomers({ q, page, pageSize }),
    placeholderData: (prev) => prev,
  });

  const delMut = useMutation({
    mutationFn: (id: string) => deleteCustomer(id),
    onSuccess: async () => {
      message.success("Đã xoá khách hàng");
      await qc.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (e: any) => message.error(e?.message || "Xoá thất bại"),
  });

  const actionMenuItems = (record: Customer) => [
    {
      key: "view",
      icon: <EyeOutlined />,
      label: "Xem chi tiết",
      onClick: () => nav(`/sales/customers/${record.id}`)
    },
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Sửa thông tin",
      onClick: () => {
        setEditing(record);
        setOpen(true);
      }
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Xoá khách hàng",
      danger: true,
      onClick: () => delMut.mutate(record.id)
    }
  ];

  const getStatusTag = (_customer: Customer) => {
    // Logic để determine status dựa trên customer data
    // Hiện tại chưa có status field, luôn hiển thị là hoạt động
    return (
      <Tag color="green">
        Hoạt động
      </Tag>
    );
  };

  const formatDate = (dateString?: string) => {
    return dateString ? dayjs(dateString).format("DD/MM/YYYY") : "-";
  };

  const truncateText = (text?: string | null, maxLength: number = 50) => {
    if (!text) return "-";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const cols: ColumnsType<Customer> = [
    {
      title: "Khách hàng",
      key: "customer",
      width: 300,
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Avatar 
            size={40} 
            style={{ backgroundColor: "#1890ff" }}
          >
            {record.name.charAt(0).toUpperCase()}
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 truncate">
              {record.name}
            </div>
            <div className="text-sm text-gray-500">
              {record.code && (
                <span className="mr-2">Mã: {record.code}</span>
              )}
            </div>
            <div className="text-xs text-gray-400">
              Tạo: {formatDate(record.createdAt)}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Liên hệ",
      key: "contact",
      width: 200,
      render: (_, record) => (
        <div className="space-y-1">
          {record.phone && (
            <div className="flex items-center text-sm">
              <PhoneOutlined className="mr-2 text-blue-500" />
              <a href={`tel:${record.phone}`} className="text-blue-600 hover:text-blue-800">
                {record.phone}
              </a>
            </div>
          )}
          {record.email && (
            <div className="flex items-center text-sm">
              <MailOutlined className="mr-2 text-green-500" />
              <a href={`mailto:${record.email}`} className="text-green-600 hover:text-green-800">
                {truncateText(record.email, 25)}
              </a>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      width: 200,
      render: (address) => (
        <div className="flex items-start">
          <EnvironmentOutlined className="mr-2 text-gray-500 mt-1 flex-shrink-0" />
          <span className="text-sm">{truncateText(address || "-", 30)}</span>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 120,
      render: (_, record) => getStatusTag(record),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Dropdown
          menu={{ items: actionMenuItems(record) }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button 
            type="text" 
            icon={<MoreOutlined />}
            loading={delMut.isPending}
          />
        </Dropdown>
      ),
    },
  ];

  const stats = {
    total: data?.total || 0,
    active: Math.floor((data?.total || 0) * 0.8), // Mock data
    newThisMonth: Math.floor((data?.total || 0) * 0.15) // Mock data
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Typography.Title level={2} className="!mb-1">
              Quản lý khách hàng
            </Typography.Title>
            <Typography.Text type="secondary">
              Quản lý thông tin và tương tác với khách hàng
            </Typography.Text>
          </div>
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={() => refetch()}
              loading={isLoading}
            >
              Làm mới
            </Button>
            <Button icon={<ExportOutlined />}>
              Xuất Excel
            </Button>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
              size="large"
            >
              Thêm khách hàng
            </Button>
          </Space>
        </div>

        {/* Statistics Cards */}
        <Row gutter={16} className="mb-6">
          <Col span={8}>
            <Card>
              <Statistic
                title="Tổng khách hàng"
                value={stats.total}
                prefix={<UserAddOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Đang hoạt động"
                value={stats.active}
                prefix={<EditOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Mới tháng này"
                value={stats.newThisMonth}
                prefix={<UserAddOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Search
              placeholder="Tìm kiếm theo tên, SĐT, email..."
              allowClear
              size="large"
              onSearch={(value) => {
                setQ(value.trim());
                setPage(1);
              }}
              style={{ width: "100%" }}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Trạng thái"
              allowClear
              size="large"
              style={{ width: "100%" }}
              onChange={(value) => {
                setStatus(value || "");
                setPage(1);
              }}
            >
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Ngừng hoạt động</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Sắp xếp theo"
              size="large"
              style={{ width: "100%" }}
              value={sortBy}
              onChange={setSortBy}
            >
              <Option value="name">Tên</Option>
              <Option value="createdAt">Ngày tạo</Option>
              <Option value="updatedAt">Ngày cập nhật</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Thứ tự"
              size="large"
              style={{ width: "100%" }}
              value={sortOrder}
              onChange={(value: "asc" | "desc") => setSortOrder(value)}
            >
              <Option value="desc">Giảm dần</Option>
              <Option value="asc">Tăng dần</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Button 
              icon={<FilterOutlined />}
              onClick={() => {
                setQ("");
                setStatus("");
                setSortBy("createdAt");
                setSortOrder("desc");
                setPage(1);
              }}
            >
              Xóa bộ lọc
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card>
        <Table
          rowKey="id"
          loading={isLoading}
          columns={cols}
          dataSource={data?.items || []}
          scroll={{ x: 1000 }}
          pagination={{
            current: data?.page ?? page,
            pageSize: data?.pageSize ?? pageSize,
            total: data?.total ?? 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} khách hàng`,
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
            },
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
        />
      </Card>

      <CustomerFormModal
        open={open}
        onClose={() => setOpen(false)}
        customer={editing}
        onSuccess={async () => {
          setOpen(false);
          await qc.invalidateQueries({ queryKey: ["customers"] });
        }}
      />
    </div>
  );
}
