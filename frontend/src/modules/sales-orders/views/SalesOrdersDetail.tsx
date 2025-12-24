import {
  Card,
  Descriptions,
  Space,
  Table,
  Tag,
  Typography,
  Button,
  message,
  Popconfirm,
  Row,
  Col,
  Statistic,
  Alert,
  Spin,
} from "antd";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  ShoppingCartOutlined,
  CalendarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useSalesOrder, useConfirmSalesOrder, useCancelSalesOrder } from "../api/hooks/useSalesOrders";
import { formatCurrency, formatDate, getStatusColor, getStatusLabel, parseDecimal } from "../utils/mappers";

const { Title, Text } = Typography;

export function SalesOrdersDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // API hooks
  const { data: salesOrder, isLoading, error, refetch } = useSalesOrder(id || "");
  const confirmMutation = useConfirmSalesOrder();
  const cancelMutation = useCancelSalesOrder();

  const handleConfirm = async () => {
    if (!id) return;
    
    try {
      await confirmMutation.mutateAsync(id);
      message.success("Xác nhận đơn hàng thành công");
      refetch();
    } catch (error: any) {
      message.error(error?.message || "Có lỗi xảy ra khi xác nhận đơn hàng");
    }
  };

  const handleCancel = async () => {
    if (!id) return;
    
    try {
      await cancelMutation.mutateAsync(id);
      message.success("Hủy đơn hàng thành công");
      refetch();
    } catch (error: any) {
      message.error(error?.message || "Có lỗi xảy ra khi hủy đơn hàng");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  // Error state
  if (error || !salesOrder) {
    return (
      <Card>
        <Space direction="vertical" align="center" style={{ width: "100%", padding: 50 }}>
          <Text type="danger">Không tìm thấy đơn hàng</Text>
          <Button onClick={() => navigate('/sales-orders')}>
            Quay lại danh sách
          </Button>
        </Space>
      </Card>
    );
  }

  const canConfirm = (salesOrder as any).data.status === "DRAFT";
  const canCancel = (salesOrder as any).data.status === "DRAFT" || (salesOrder as any).data.status === "CONFIRMED";
  const isReadOnly = (salesOrder as any).data.status === "DONE" || (salesOrder as any).data.status === "CANCELLED";

  // Calculate totals
  const totalItems = (salesOrder as any).data.items.length;
  const totalQuantity = (salesOrder as any).data.items.reduce((sum: number, item: any) => sum + parseDecimal(item.qtyTotal), 0);
  const totalAmount = (salesOrder as any).data.items.reduce((sum: number, item: any) => {
    return sum + (parseDecimal(item.qtyTotal) * parseDecimal(item.unitPrice));
  }, 0);

  const itemColumns = [
    {
      title: "STT",
      key: "lineNo",
      width: 60,
      render: (_: any, _record: any) => (
        <Text strong>{_record.lineNo}</Text>
      ),
    },
    {
      title: "Mã sản phẩm",
      key: "productStyleId",
      width: 140,
      render: (_: any, _record: any) => (
        <Text code>{_record.productStyle?.code || _record.productStyleId}</Text>
      ),
    },
    {
      title: "Tên sản phẩm",
      key: "itemName",
      render: (_: any, _record: any) => (
        <div>
          <Text strong>{_record.itemName}</Text>
          {_record.productStyle && (
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {_record.productStyle.name}
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Đơn vị",
      key: "uom",
      width: 80,
      render: (_: any, _record: any) => (
        <Text>{_record.uom}</Text>
      ),
    },
    {
      title: "Số lượng",
      key: "qtyTotal",
      align: "right" as const,
      width: 120,
      render: (_: any, _record: any) => (
        <Text strong>{parseDecimal(_record.qtyTotal).toLocaleString("vi-VN")}</Text>
      ),
    },
    {
      title: "Đơn giá",
      key: "unitPrice",
      align: "right" as const,
      width: 160,
      render: (_: any, _record: any) => (
        <Text>{formatCurrency(_record.unitPrice)}</Text>
      ),
    },
    {
      title: "Thành tiền",
      key: "totalAmount",
      align: "right" as const,
      width: 180,
      render: (_: any, _record: any) => {
        const amount = parseDecimal(_record.qtyTotal) * parseDecimal(_record.unitPrice);
        return (
          <Text strong style={{ color: '#1890ff' }}>
            {formatCurrency(amount)}
          </Text>
        );
      },
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Space>
          <Link to="/sales-orders">
            <Button icon={<ArrowLeftOutlined />}>Quay lại</Button>
          </Link>
          <Title level={3} style={{ margin: 0 }}>
            Đơn hàng {(salesOrder as any).data.orderNo}
          </Title>
        </Space>

        <Space>
          {/* Status display */}
          <Tag color={getStatusColor((salesOrder as any).data.status)} style={{ fontSize: 14 }}>
            {getStatusLabel((salesOrder as any).data.status)}
          </Tag>

          {/* Action buttons */}
          {canConfirm && (
            <Popconfirm
              title="Bạn có chắc chắn muốn xác nhận đơn hàng này?"
              onConfirm={handleConfirm}
              okText="Có"
              cancelText="Không"
            >
              <Button 
                type="primary" 
                icon={<CheckOutlined />}
                loading={confirmMutation.isPending}
              >
                Xác nhận
              </Button>
            </Popconfirm>
          )}

          {canCancel && (
            <Popconfirm
              title="Bạn có chắc chắn muốn hủy đơn hàng này?"
              onConfirm={handleCancel}
              okText="Có"
              cancelText="Không"
            >
              <Button 
                danger 
                icon={<CloseOutlined />}
                loading={cancelMutation.isPending}
              >
                Hủy đơn hàng
              </Button>
            </Popconfirm>
          )}

          {!isReadOnly && (
            <Button 
              icon={<EditOutlined />}
              onClick={() => navigate(`/sales-orders/${id}/edit`)}
            >
              Chỉnh sửa
            </Button>
          )}
        </Space>
      </div>

      {/* Summary Cards */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số sản phẩm"
              value={totalItems}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số lượng"
              value={totalQuantity}
              precision={0}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng giá trị"
              value={totalAmount}
              precision={0}
              prefix="₫"
              formatter={(value) => formatCurrency(value as number)}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Trạng thái"
              value={getStatusLabel((salesOrder as any).data.status)}
              prefix={<UserOutlined />}
              valueStyle={{ color: getStatusColor((salesOrder as any).data.status) }}
            />
          </Card>
        </Col>
      </Row>

      {/* Basic Information */}
      <Card title="Thông tin cơ bản" extra={
        <Tag color={getStatusColor((salesOrder as any).data.status)}>
          {getStatusLabel((salesOrder as any).data.status)}
        </Tag>
      }>
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Mã đơn hàng">
            <Text strong>{(salesOrder as any).data.orderNo}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Khách hàng">
            <Space>
              <UserOutlined />
              <Text strong>{(salesOrder as any).data.customer?.name || 'N/A'}</Text>
              {(salesOrder as any).data.customer?.code && (
                <Text type="secondary">({(salesOrder as any).data.customer.code})</Text>
              )}
            </Space>
          </Descriptions.Item>
          
          <Descriptions.Item label="Ngày đặt hàng">
            <Space>
              <CalendarOutlined />
              {formatDate((salesOrder as any).data.orderDate)}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày giao hàng">
            <Space>
              <CalendarOutlined />
              {(salesOrder as any).data.dueDate ? formatDate((salesOrder as any).data.dueDate) : 'Chưa xác định'}
            </Space>
          </Descriptions.Item>

          <Descriptions.Item label="Loại đơn hàng">
            <Tag color={(salesOrder as any).data.isInternal ? 'blue' : 'green'}>
              {(salesOrder as any).data.isInternal ? 'Nội bộ' : 'Khách hàng'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Tổng giá trị">
            <Text strong style={{ color: '#1890ff', fontSize: 16 }}>
              {formatCurrency((salesOrder as any).data.totalAmount)}
            </Text>
          </Descriptions.Item>

          {(salesOrder as any).data.note && (
            <Descriptions.Item label="Ghi chú" span={2}>
              {(salesOrder as any).data.note}
            </Descriptions.Item>
          )}

          <Descriptions.Item label="Ngày tạo">
            {formatDate((salesOrder as any).data.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Cập nhật lần cuối">
            {formatDate((salesOrder as any).data.updatedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Items Table */}
      <Card 
        title={
          <Space>
            <ShoppingCartOutlined />
            Danh sách sản phẩm ({totalItems} items)
          </Space>
        }
        extra={
          <Text type="secondary">
            Tổng: {totalQuantity.toLocaleString("vi-VN")} items | {formatCurrency(totalAmount)}
          </Text>
        }
      >
        <Table
          dataSource={(salesOrder as any).data.items}
          columns={itemColumns}
          rowKey="id"
          pagination={false}
          size="middle"
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ padding: 16, backgroundColor: "#fafafa" }}>
                <Title level={5}>Chi tiết Breakdown</Title>
                {record.breakdowns && record.breakdowns.length > 0 ? (
                  <Table
                    dataSource={record.breakdowns}
                    columns={[
                      { 
                        title: "Product Variant ID", 
                        dataIndex: "productVariantId",
                        render: (v) => <Text code>{v}</Text>
                      },
                      { 
                        title: "Số lượng", 
                        dataIndex: "qty",
                        align: "right" as const,
                        render: (v) => <Text strong>{parseDecimal(v).toLocaleString("vi-VN")}</Text>
                      },
                    ]}
                    rowKey="id"
                    pagination={false}
                    size="small"
                  />
                ) : (
                  <Alert
                    message="Chưa có breakdown nào"
                    type="info"
                    showIcon
                    style={{ margin: 0 }}
                  />
                )}
              </div>
            ),
            rowExpandable: (record) => record.breakdowns && record.breakdowns.length > 0,
          }}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={4}>
                <Text strong>Tổng cộng</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="right">
                <Text strong>{totalQuantity.toLocaleString("vi-VN")}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} align="right">
                <Text>-</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3} align="right">
                <Text strong style={{ color: '#1890ff', fontSize: 16 }}>
                  {formatCurrency(totalAmount)}
                </Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </Card>
    </Space>
  );
}
