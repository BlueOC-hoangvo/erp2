import {
  Card,
  Descriptions,
  Divider,
  Space,
  Table,
  Tag,
  Typography,
  Select,
  message,
  Button,
  Row,
  Col,
  Progress,
} from "antd";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProductionOrderById,
  releaseProductionOrder,
  startProductionOrder,
  completeProductionOrder,
  cancelProductionOrder,
  generateMaterials,
} from "../api/production-orders.api";
import { PRODUCTION_ORDER_STATUSES } from "../types";

export function ProductionOrderDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: moData, isLoading } = useQuery({
    queryKey: ['production-order', id],
    queryFn: () => getProductionOrderById(Number(id)),
    enabled: !!id,
  });

  const mo = moData?.data;

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => {
      switch (status) {
        case "RELEASED":
          return releaseProductionOrder(id);
        case "RUNNING":
          return startProductionOrder(id);
        case "DONE":
          return completeProductionOrder(id);
        case "CANCELLED":
          return cancelProductionOrder(id);
        default:
          throw new Error(`Unsupported status transition: ${status}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['production-order', id] });
      queryClient.invalidateQueries({ queryKey: ['production-orders'] });
      message.success('Cập nhật trạng thái thành công');
    },
    onError: (error: any) => {
      message.error(error?.message || 'Có lỗi khi cập nhật trạng thái');
    },
  });

  const generateMaterialsMutation = useMutation({
    mutationFn: (mode: "replace" | "merge") => generateMaterials(Number(id), mode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['production-order', id] });
      message.success('Tạo yêu cầu vật tư từ BOM thành công');
    },
    onError: (error: any) => {
      message.error(error?.message || 'Có lỗi khi tạo yêu cầu vật tư');
    },
  });

  const getCompletionRate = () => {
    if (!mo || !mo.qtyPlan) return 0;
    return Math.round((Number(mo.qtyCompleted) / Number(mo.qtyPlan)) * 100);
  };

  if (isLoading) {
    return <Card>Đang tải...</Card>;
  }

  if (!mo) return <Card>Không tìm thấy lệnh sản xuất</Card>;

  const handleStatusChange = (status: string) => {
    updateStatusMutation.mutate({ id: mo.id, status });
  };

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Typography.Title level={3} style={{ margin: 0 }}>
          {mo.moNo}
        </Typography.Title>

        <Space>
          <Select
            value={mo.status}
            style={{ width: 180 }}
            onChange={handleStatusChange}
            loading={updateStatusMutation.isPending}
            options={[
              { value: "DRAFT", label: "DRAFT" },
              { value: "RELEASED", label: "RELEASED" },
              { value: "RUNNING", label: "RUNNING" },
              { value: "DONE", label: "DONE" },
              { value: "CANCELLED", label: "CANCELLED" },
            ]}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Qty done:</span>
            <span className="font-medium">{mo.qtyCompleted}</span>
          </div>
          <Button 
            type="primary" 
            onClick={() => window.history.back()}
          >
            Quay lại
          </Button>
        </Space>
      </div>

      <Card>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Trạng thái">
            <Tag>{mo.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="SO Item ID">
            {mo.salesOrderItemId || '-'}
          </Descriptions.Item>

          <Descriptions.Item label="Sản phẩm" span={2}>
            {mo.productStyle?.name || 'N/A'}
          </Descriptions.Item>

          <Descriptions.Item label="Kế hoạch">{mo.qtyPlan}</Descriptions.Item>
          <Descriptions.Item label="Hoàn thành">{mo.qtyCompleted}</Descriptions.Item>
          
          <Descriptions.Item label="Ngày bắt đầu">
            {mo.startDate ? new Date(mo.startDate).toLocaleDateString('vi-VN') : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày kết thúc">
            {mo.dueDate ? new Date(mo.dueDate).toLocaleDateString('vi-VN') : '-'}
          </Descriptions.Item>
          
          <Descriptions.Item label="Ghi chú" span={2}>
            {mo.note || '-'}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Row gutter={16} className="mb-4">
          <Col span={12}>
            <div>
              <span className="text-sm text-gray-600">Tiến độ hoàn thành:</span>
              <Progress 
                percent={getCompletionRate()} 
                strokeColor={getCompletionRate() === 100 ? '#52c41a' : '#1890ff'}
                className="mt-2"
              />
            </div>
          </Col>
          <Col span={12}>
            <div className="text-right">
              <Button 
                type="dashed" 
                size="small"
                onClick={() => generateMaterialsMutation.mutate("replace")}
                loading={generateMaterialsMutation.isPending}
                disabled={!mo.productStyleId}
              >
                Tạo từ BOM
              </Button>
            </div>
          </Col>
        </Row>

        <Typography.Title level={5} style={{ marginTop: 0 }}>
          Phân tích theo Size/Color
        </Typography.Title>

        <Table
          size="small"
          rowKey="id"
          pagination={false}
          dataSource={mo.breakdowns || []}
          columns={[
            { 
              title: "Size", 
              dataIndex: ["productVariant", "size", "name"], 
              width: 100,
              render: (_: any, record: any) => record.productVariant?.size?.name || '-'
            },
            { 
              title: "Mã size", 
              dataIndex: ["productVariant", "size", "code"], 
              width: 100,
              render: (_: any, record: any) => record.productVariant?.size?.code || '-'
            },
            { 
              title: "Màu", 
              dataIndex: ["productVariant", "color", "name"], 
              width: 120,
              render: (_: any, record: any) => record.productVariant?.color?.name || '-'
            },
            { 
              title: "Mã màu", 
              dataIndex: ["productVariant", "color", "code"], 
              width: 100,
              render: (_: any, record: any) => record.productVariant?.color?.code || '-'
            },
            {
              title: "Kế hoạch",
              dataIndex: "qtyPlan",
              align: "right",
              width: 120,
              render: (qty: number) => Number(qty).toLocaleString(),
            },
            {
              title: "Đã làm",
              dataIndex: "qtyDone",
              align: "right", 
              width: 120,
              render: (qty: number) => Number(qty).toLocaleString(),
            },
            {
              title: "Tiến độ",
              key: "progress",
              width: 120,
              render: (_, record: any) => {
                const percent = record.qtyPlan > 0 
                  ? Math.round((Number(record.qtyDone) / Number(record.qtyPlan)) * 100)
                  : 0;
                return (
                  <Progress 
                    percent={percent} 
                    size="small"
                    strokeColor={percent === 100 ? '#52c41a' : '#1890ff'}
                    format={() => `${percent}%`}
                  />
                );
              }
            },
          ]}
        />

        <Divider />

        <Typography.Title level={5} style={{ marginTop: 0 }}>
          Yêu cầu vật tư (từ BOM)
        </Typography.Title>

        <Table
          size="small"
          rowKey="id"
          pagination={false}
          dataSource={mo.materialRequirements || []}
          columns={[
            { 
              title: "SKU", 
              dataIndex: ["item", "sku"], 
              width: 120,
              render: (_: any, record: any) => record.item?.sku || '-'
            },
            { 
              title: "Vật tư", 
              dataIndex: ["item", "name"], 
              width: 200,
              render: (_: any, record: any) => record.item?.name || '-'
            },
            { title: "UOM", dataIndex: "uom", width: 80 },
            {
              title: "Yêu cầu",
              dataIndex: "qtyRequired",
              align: "right",
              width: 120,
              render: (qty: number) => Number(qty).toLocaleString(),
            },
            {
              title: "Đã cấp",
              dataIndex: "qtyIssued",
              align: "right",
              width: 120,
              render: (qty: number) => Number(qty).toLocaleString(),
            },
            {
              title: "Còn thiếu",
              key: "remaining",
              align: "right",
              width: 120,
              render: (_, record: any) => {
                const remaining = Number(record.qtyRequired) - Number(record.qtyIssued);
                return (
                  <span className={remaining > 0 ? 'text-red-600' : 'text-green-600'}>
                    {remaining.toLocaleString()}
                  </span>
                );
              }
            },
            {
              title: "Hao hụt %",
              dataIndex: "wastagePercent",
              align: "right",
              width: 100,
              render: (percent: number) => `${Number(percent).toFixed(1)}%`,
            },
          ]}
        />
      </Card>
    </Space>
  );
}
