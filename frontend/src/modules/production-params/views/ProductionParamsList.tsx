import { Button, Card, Space, Table, Tag, Typography, Tabs } from "antd";
import { useNavigate } from "react-router-dom";
import { listProductionParams, listWorkCenters } from "../fake/production-params.store";
import { PRODUCTION_PARAM_CATEGORIES, PRODUCTION_PARAM_TYPES, WORK_CENTER_STATUS } from "../types";
import type { ProductionParamEntity, WorkCenterEntity } from "../types";
import { useState } from "react";

export function ProductionParamsList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('params');
  
  const params = listProductionParams();
  const workCenters = listWorkCenters();

  const paramColumns = [
    {
      title: "Mã tham số",
      dataIndex: "paramCode",
      width: 140,
    },
    {
      title: "Tên tham số",
      dataIndex: "paramName",
      width: 200,
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      width: 120,
      render: (v: string) => {
        const category = PRODUCTION_PARAM_CATEGORIES[v as keyof typeof PRODUCTION_PARAM_CATEGORIES];
        return <Tag color={category.color}>{category.label}</Tag>;
      },
    },
    {
      title: "Kiểu dữ liệu",
      dataIndex: "type",
      width: 120,
      render: (v: string) => PRODUCTION_PARAM_TYPES[v as keyof typeof PRODUCTION_PARAM_TYPES],
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      width: 80,
      render: (v: string) => v || "-",
    },
    {
      title: "Giá trị mặc định",
      dataIndex: "defaultValue",
      width: 120,
      render: (v: any) => v?.toString() || "-",
    },
    {
      title: "Bắt buộc",
      dataIndex: "isRequired",
      width: 80,
      render: (v: boolean) => v ? <Tag color="red">Có</Tag> : <Tag color="default">Không</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      width: 80,
      render: (v: boolean) => v ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Tắt</Tag>,
    },
    {
      title: "Thao tác",
      width: 140,
      render: (_: any, r: ProductionParamEntity) => (
        <Space>
          <Button 
            size="small"
            onClick={() => navigate(`/production/params/${r.id}/edit`)}
          >
            Sửa
          </Button>
          <Button 
            size="small" 
            danger
            onClick={() => {
              // Handle delete
              console.log('Delete param', r.id);
            }}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const workCenterColumns = [
    {
      title: "Mã trung tâm",
      dataIndex: "centerCode",
      width: 120,
    },
    {
      title: "Tên trung tâm",
      dataIndex: "centerName",
      width: 180,
    },
    {
      title: "Phòng ban",
      dataIndex: "department",
      width: 100,
    },
    {
      title: "Công suất",
      dataIndex: "capacity",
      width: 100,
      align: "right" as const,
      render: (v: number) => v.toLocaleString("vi-VN"),
    },
    {
      title: "Hiệu suất",
      dataIndex: "efficiency",
      width: 80,
      align: "right" as const,
      render: (v: number) => `${v}%`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 100,
      render: (v: string) => {
        const status = WORK_CENTER_STATUS[v as keyof typeof WORK_CENTER_STATUS];
        return <Tag color={status.color}>{status.label}</Tag>;
      },
    },
    {
      title: "Địa điểm",
      dataIndex: "location",
      width: 150,
    },
    {
      title: "Người giám sát",
      dataIndex: "supervisor",
      width: 120,
    },
    {
      title: "Thao tác",
      width: 140,
      render: (_: any, r: WorkCenterEntity) => (
        <Space>
          <Button 
            size="small"
            onClick={() => navigate(`/production/resources/${r.id}`)}
          >
            Xem
          </Button>
          <Button 
            size="small"
            onClick={() => navigate(`/production/resources/${r.id}/edit`)}
          >
            Sửa
          </Button>
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: 'params',
      label: 'Thông số sản xuất',
      children: (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <Typography.Title level={4} style={{ margin: 0 }}>
              Danh sách thông số
            </Typography.Title>
            <Button 
              type="primary" 
              onClick={() => navigate('/production/params/create')}
            >
              Thêm thông số mới
            </Button>
          </div>
          <Table<ProductionParamEntity>
            rowKey="id"
            dataSource={params}
            columns={paramColumns}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      ),
    },
    {
      key: 'workcenters',
      label: 'Trung tâm sản xuất',
      children: (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <Typography.Title level={4} style={{ margin: 0 }}>
              Danh sách trung tâm
            </Typography.Title>
            <Button 
              type="primary" 
              onClick={() => navigate('/production/resources/create')}
            >
              Thêm trung tâm mới
            </Button>
          </div>
          <Table<WorkCenterEntity>
            rowKey="id"
            dataSource={workCenters}
            columns={workCenterColumns}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <Typography.Title level={3} style={{ margin: 0 }}>
        Thông số sản xuất
      </Typography.Title>
      
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />
    </Space>
  );
}
