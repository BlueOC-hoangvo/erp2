import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import { BankOutlined, ShoppingOutlined, DollarOutlined } from "@ant-design/icons";
import { useSuppliers } from "@/modules/suppliers";
import SuppliersList from "@/modules/suppliers/components/SuppliersList";

const SuppliersPage: React.FC = () => {
  // Get suppliers list for statistics
  const { data: suppliersData } = useSuppliers({ page: 1, pageSize: 100 });

  // Calculate statistics
  const totalSuppliers = suppliersData?.data?.length || 0;
  
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Quản lý nhà cung cấp
        </h1>
        <p className="text-gray-600">
          Thông tin và quản lý các nhà cung cấp trong hệ thống
        </p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Tổng nhà cung cấp"
              value={totalSuppliers}
              prefix={<BankOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Nhà cung cấp hoạt động"
              value={totalSuppliers}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} lg={8}>
          <Card>
            <Statistic
              title="Tổng giá trị đơn hàng"
              value={0}
              prefix={<DollarOutlined />}
              precision={0}
              valueStyle={{ color: '#faad14' }}
              formatter={(value) => new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(Number(value))}
            />
          </Card>
        </Col>
      </Row>

      {/* Suppliers List */}
      <SuppliersList />
    </div>
  );
};

export default SuppliersPage;

