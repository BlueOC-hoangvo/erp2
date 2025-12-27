import { Button, Card, Space, Table, Tag, Typography, Input, Select, DatePicker, Pagination, message, Popconfirm } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useSalesOrders, useCancelSalesOrder } from "../api/hooks/useSalesOrders";
import { convertToTableRow, getStatusColor, getStatusLabel } from "../utils/mappers";
import type { SalesOrderQuery, SalesOrderStatus } from "../types";

const { RangePicker } = DatePicker;

export function SalesOrdersList() {
  const nav = useNavigate();
  const [query, setQuery] = useState<SalesOrderQuery>({
    page: 1,
    pageSize: 20,
    sortBy: "orderDate",
    sortOrder: "desc",
  });
  const [_filters, setFilters] = useState({
    q: "",
    status: undefined as SalesOrderStatus | undefined,
    customerId: undefined,
    dateRange: null as any,
  });

  // API hooks
  const { data, isLoading, error, refetch } = useSalesOrders(query);
  const cancelMutation = useCancelSalesOrder();

  // Handle pagination
  const handlePageChange = (page: number, pageSize: number) => {
    setQuery(prev => ({ ...prev, page, pageSize }));
  };

  // Handle search and filters
  const handleSearch = () => {
    const newQuery: SalesOrderQuery = {
      ...query,
      page: 1,
      q: _filters.q || undefined,
      status: _filters.status,
      customerId: _filters.customerId,
      fromDate: _filters.dateRange?.[0] ? _filters.dateRange[0].format('YYYY-MM-DD') : undefined,
      toDate: _filters.dateRange?.[1] ? _filters.dateRange[1].format('YYYY-MM-DD') : undefined,
    };
    setQuery(newQuery);
  };

  // Handle reset filters
  const handleReset = () => {
    setFilters({
      q: "",
      status: undefined,
      customerId: undefined,
      dateRange: null,
    });
    setQuery({
      page: 1,
      pageSize: 20,
      sortBy: "orderDate",
      sortOrder: "desc",
    });
  };

  // Handle cancel sales order
  const handleCancel = async (id: string) => {
    try {
      await cancelMutation.mutateAsync(id);
      message.success("Hủy đơn hàng thành công");
      refetch();
    } catch (error) {
      message.error("Có lỗi xảy ra khi hủy đơn hàng");
    }
  };

  // Handle table change (sorting)
  const handleTableChange = (pagination: any, _filters: any, sorter: any) => {
    setQuery(prev => ({
      ...prev,
      page: pagination.current,
      pageSize: pagination.pageSize,
      sortBy: sorter.field || "orderDate",
      sortOrder: sorter.order === "ascend" ? "asc" : "desc",
    }));
  };

  const responseData = (data as any)?.data || {};
  const items = responseData.items || [];
  const tableData = items.map((order: any) => convertToTableRow(order));
  const total = responseData.total || 0;
  const currentPage = responseData.page || 1;
  const currentPageSize = responseData.pageSize || 20;

  if (error) {
    return (
      <Card>
        <Typography.Text type="danger">
          Có lỗi xảy ra khi tải danh sách đơn hàng. Vui lòng thử lại.
        </Typography.Text>
        <Button onClick={() => refetch()} style={{ marginTop: 16 }}>
          Thử lại
        </Button>
      </Card>
    );
  }

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <Typography.Title level={3} style={{ margin: 0 }}>
          Đơn hàng
        </Typography.Title>
        <Button type="primary" onClick={() => nav("/sales-orders/create")}>
          Tạo đơn hàng mới
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <Space wrap>
          <Input
            placeholder="Tìm kiếm mã đơn hàng, khách hàng..."
            value={_filters.q}
            onChange={(e) => setFilters(prev => ({ ...prev, q: e.target.value }))}
            style={{ width: 250 }}
            onPressEnter={handleSearch}
          />
          
          <Select
            placeholder="Trạng thái"
            value={_filters.status}
            onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            style={{ width: 150 }}
            allowClear
          >
            <Select.Option value="DRAFT">Nháp</Select.Option>
            <Select.Option value="CONFIRMED">Đã xác nhận</Select.Option>
            <Select.Option value="IN_PRODUCTION">Đang sản xuất</Select.Option>
            <Select.Option value="DONE">Hoàn thành</Select.Option>
            <Select.Option value="CANCELLED">Đã hủy</Select.Option>
          </Select>

          <RangePicker
            value={_filters.dateRange}
            onChange={(dates) => setFilters(prev => ({ ...prev, dateRange: dates }))}
            format="DD/MM/YYYY"
          />

          <Button type="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>
          
          <Button onClick={handleReset}>
            Đặt lại
          </Button>
        </Space>
      </Card>

      {/* Table */}
      <Card>
        <Table
          rowKey="key"
          dataSource={tableData}
          loading={isLoading}
          pagination={false}
          onChange={handleTableChange}
          columns={[
            {
              title: "Mã đơn hàng",
              dataIndex: "orderNo",
              width: 160,
              sorter: true,
              render: (v, _r) => (
                <Link to={`/sales-orders/${(_r as any).key}`} className="font-medium text-blue-600">
                  {v}
                </Link>
              ),
            },
            {
              title: "Khách hàng",
              dataIndex: "customerName",
              width: 200,
              sorter: true,
            },
            {
              title: "Ngày đặt hàng",
              dataIndex: "orderDate",
              width: 120,
              sorter: true,
            },
            {
              title: "Ngày giao",
              dataIndex: "dueDate",
              width: 120,
            },
            {
              title: "Trạng thái",
              dataIndex: "status",
              width: 140,
              render: (v, _r) => (
                <Tag color={getStatusColor(v)}>
                  {getStatusLabel(v)}
                </Tag>
              ),
            },
            {
              title: "Tổng tiền",
              dataIndex: "totalAmount",
              width: 120,
              align: "right",
              sorter: true,
            },
            {
              title: "Thao tác",
              width: 200,
              render: (_, _r) => {
                const rowData = _r as any;
                return (
                  <Space>
                    <Button onClick={() => nav(`/sales-orders/${rowData.key}`)} size="small">
                      Xem
                    </Button>
                    <Button 
                      onClick={() => nav(`/sales-orders/${rowData.key}/edit`)}
                      type="link"
                      size="small"
                    >
                      Sửa
                    </Button>
                    {rowData.status === "DRAFT" && (
                      <Popconfirm
                        title="Bạn có chắc chắn muốn hủy đơn hàng này?"
                        onConfirm={() => handleCancel(rowData.key)}
                        okText="Có"
                        cancelText="Không"
                      >
                        <Button size="small" danger>
                          Hủy
                        </Button>
                      </Popconfirm>
                    )}
                  </Space>
                );
              },
            },
          ]}
        />

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <Typography.Text>
            Hiển thị {((currentPage || 1) - 1) * (currentPageSize || 20) + 1} - {Math.min((currentPage || 1) * (currentPageSize || 20), total)} trên tổng số {total} bản ghi
          </Typography.Text>
          <Pagination
            current={currentPage || 1}
            pageSize={currentPageSize || 20}
            total={total}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) => `${range[0]}-${range[1]} trên tổng số ${total} bản ghi`}
            onChange={handlePageChange}
            onShowSizeChange={handlePageChange}
          />
        </div>
      </Card>
    </Space>
  );
}
