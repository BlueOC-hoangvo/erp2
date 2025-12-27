import React from "react";
import { Card, Row, Col, Statistic, Select } from "antd";
import { ShopOutlined, PackageOutlined, DollarOutlined, FileTextOutlined } from "@ant-design/icons";
import { useItems } from "@/modules/items";
import ItemsList from "@/modules/items/components/ItemsList";

const ProductsPage: React.FC = () => {
  // Get items list for statistics
  const { data: itemsData } = useItems({ pageSize: 100 });

  // Calculate statistics
  const totalItems = itemsData?.data?.length || 0;
  const fabricItems = itemsData?.data?.filter(item => item.itemType === "FABRIC").length || 0;
  const accessoryItems = itemsData?.data?.filter(item => item.itemType === "ACCESSORY").length || 0;
  const activeItems = itemsData?.data?.filter(item => item.isActive).length || 0;
  
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Quản lý sản phẩm/hàng hóa
        </h1>
        <p className="text-gray-600">
          Quản lý danh sách sản phẩm và hàng hóa trong hệ thống
        </p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng sản phẩm"
              value={totalItems}
              prefix={<PackageOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Vải"
              value={fabricItems}
              prefix={<ShopOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Phụ kiện"
              value={accessoryItems}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đang hoạt động"
              value={activeItems}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Products List */}
      <ItemsList />
    </div>
  );
};

export default ProductsPage;

