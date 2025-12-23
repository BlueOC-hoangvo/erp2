import { Button, Card, Space, Table, Tag, Typography, Progress } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { listProductionPlans } from "../fake/production-plans.store";
import { PRODUCTION_PLAN_STATUSES, PRODUCTION_PLAN_PRIORITIES } from "../types";
import type { ProductionPlanEntity } from "../types";
import { useEffect } from "react";

export function ProductionPlansList() {
  const navigate = useNavigate();
  const data = listProductionPlans();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getProgress = (plan: ProductionPlanEntity) => {
    return Math.round((plan.completedQuantity / plan.totalQuantity) * 100);
  };

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <div className="flex items-center justify-between">
        <Typography.Title level={3} style={{ margin: 0 }}>
          Kế hoạch sản xuất
        </Typography.Title>
        <Button type="primary" onClick={() => navigate("/production/plan/create")}>
          Tạo kế hoạch mới
        </Button>
      </div>

      <Card>
        <Table<ProductionPlanEntity>
          rowKey="id"
          dataSource={data}
          columns={[
            {
              title: "Mã kế hoạch",
              dataIndex: "planNo",
              width: 140,
              render: (v, r) => (
                <Link to={`/production/plan/${r.id}`} className="font-medium text-blue-600">
                  {v}
                </Link>
              ),
            },
            {
              title: "Tên kế hoạch",
              dataIndex: "planName",
              width: 200,
            },
            {
              title: "Khách hàng",
              dataIndex: "customerName",
              width: 150,
              render: (v) => v || "-",
            },
            {
              title: "Ngày bắt đầu",
              dataIndex: "startDate",
              width: 120,
              render: (v) => formatDate(v),
            },
            {
              title: "Ngày kết thúc",
              dataIndex: "endDate",
              width: 120,
              render: (v) => formatDate(v),
            },
            {
              title: "Tiến độ",
              key: "progress",
              width: 150,
              render: (_, r) => (
                <div>
                  <Progress
                    percent={getProgress(r)}
                    size="small"
                    status={r.status === 'COMPLETED' ? 'success' : 'active'}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {r.completedQuantity}/{r.totalQuantity} {r.items[0]?.unit || 'pcs'}
                  </div>
                </div>
              ),
            },
            {
              title: "Trạng thái",
              dataIndex: "status",
              width: 120,
              render: (v) => {
                const status = PRODUCTION_PLAN_STATUSES[v];
                return <Tag color={status.color}>{status.label}</Tag>;
              },
            },
            {
              title: "Độ ưu tiên",
              dataIndex: "priority",
              width: 100,
              render: (v) => {
                const priority = PRODUCTION_PLAN_PRIORITIES[v];
                return <Tag color={priority.color}>{priority.label}</Tag>;
              },
            },
            {
              title: "Thao tác",
              width: 160,
              render: (_, r) => (
                <Space>
                  <Button onClick={() => navigate(`/production/plan/${r.id}`)}>
                    Xem
                  </Button>
                  <Button 
                    onClick={() => navigate(`/production/plan/${r.id}/edit`)}
                    type="link"
                  >
                    Sửa
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Card>
    </Space>
  );
}
