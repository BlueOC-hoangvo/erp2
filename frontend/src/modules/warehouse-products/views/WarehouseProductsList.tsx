
import { Button, Card, Space, Table, Tag, Typography, Progress, Row, Col, Statistic, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { listWarehouseProducts } from "../fake/warehouse-products.store";
import { WAREHOUSE_PRODUCT_CATEGORIES, WAREHOUSE_PRODUCT_QUALITY } from "../types";
import type { WarehouseProductEntity } from "../types";
import { useMemo, useState } from "react";

export function WarehouseProductsList() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const products = listWarehouseProducts();

  // Calculate statistics
  const stats = useMemo(() => {
    const total = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.stock.currentStock * p.unitPrice), 0);
    const lowStock = products.filter(p => p.stock.currentStock <= p.stock.minStock).length;
    const outOfStock = products.filter(p => p.stock.currentStock === 0).length;

    return {
      total,
      totalValue,
      lowStock,
      outOfStock
    };
  }, [products]);

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!searchText) return products;
    return products.filter(p => 
      p.productName.toLowerCase().includes(searchText.toLowerCase()) ||
      p.productCode.toLowerCase().includes(searchText.toLowerCase()) ||
      p.category.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [products, searchText]);

  const columns = [
    {
      title: "Mã sản phẩm",
      dataIndex: "productCode",
      width: 140,
      render: (v: string, r: WarehouseProductEntity) => (
        <Button type="link" onClick={() => navigate(`/warehouse/products/${r.id}`)}>
          {v}
        </Button>
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      width: 200,
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      width: 140,
      render: (v: string) => {
        const category = WAREHOUSE_PRODUCT_CATEGORIES[v as keyof typeof WAREHOUSE_PRODUCT_CATEGORIES];
        return <Tag color={category.color}>{category.label}</Tag>;
      },
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      width: 80,
    },
    {
      title: "Tồn hiện tại",
      key: "currentStock",
      width: 120,
      align: "right" as const,
      render: (_: any, r: WarehouseProductEntity) => {
        const stock = r.stock;
        const isLow = stock.currentStock <= stock.minStock;
        const isOut = stock.currentStock === 0;
        
        return (
          <div>
            <div className={isOut ? 'text-red-600 font-semibold' : isLow ? 'text-orange-600' : 'text-green-600'}>
              {stock.currentStock.toLocaleString("vi-VN")}
            </div>
            {isLow && !isOut && <div className="text-xs text-orange-500">Sắp hết</div>}
            {isOut && <div className="text-xs text-red-500">Hết hàng</div>}
          </div>
        );
      },
    },
    {
      title: "Tồn tối thiểu",
      dataIndex: ["stock", "minStock"],
      width: 100,
      align: "right" as const,
      render: (v: number) => v.toLocaleString("vi-VN"),
    },
    {
      title: "Có thể sử dụng",
      key: "availableStock",
      width: 120,
      align: "right" as const,
      render: (_: any, r: WarehouseProductEntity) => (
        <span className="text-blue-600">
          {r.stock.availableStock.toLocaleString("vi-VN")}
        </span>
      ),
    },
    {
      title: "Đã đặt trước",
      dataIndex: ["stock", "reservedStock"],
      width: 100,
      align: "right" as const,
      render: (v: number) => (
        <span className="text-orange-600">
          {v.toLocaleString("vi-VN")}
        </span>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "unitPrice",
      width: 100,
      align: "right" as const,
      render: (v: number) => `${v.toLocaleString("vi-VN")} VND`,
    },
    {
      title: "Giá trị tồn",
      key: "stockValue",
      width: 120,
      align: "right" as const,
      render: (_: any, r: WarehouseProductEntity) => {
        const value = r.stock.currentStock * r.unitPrice;
        return <b>{value.toLocaleString("vi-VN")} VND</b>;
      },
    },
    {
      title: "Chất lượng",
      dataIndex: ["quality", "grade"],
      width: 100,
      render: (v: string) => {
        const quality = WAREHOUSE_PRODUCT_QUALITY[v as keyof typeof WAREHOUSE_PRODUCT_QUALITY];
        return <Tag color={quality.color}>{quality.label}</Tag>;
      },
    },
    {
      title: "Vị trí",
      key: "location",
      width: 140,
      render: (_: any, r: WarehouseProductEntity) => (
        <div>
          <div>{r.location.warehouse}</div>
          <div className="text-xs text-gray-500">{r.location.zone}</div>
        </div>
      ),
    },
    {
      title: "Thao tác",
      width: 160,
      render: (_: any, r: WarehouseProductEntity) => (
        <Space>
          <Button 
            size="small"
            onClick={() => navigate(`/warehouse/products/${r.id}`)}
          >
            Xem
          </Button>
          <Button 
            size="small"
            onClick={() => navigate(`/warehouse/products/${r.id}/edit`)}
          >
            Sửa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <Typography.Title level={3} style={{ margin: 0 }}>
        Quản lý sản phẩm/NVL
      </Typography.Title>

      {/* Statistics Cards */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số sản phẩm"
              value={stats.total}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Giá trị tồn kho"
              value={stats.totalValue}
              suffix="VND"
              precision={0}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Sắp hết hàng"
              value={stats.lowStock}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Hết hàng"
              value={stats.outOfStock}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Actions */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Space>
            <Input.Search
              placeholder="Tìm kiếm sản phẩm..."
              style={{ width: 300 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Space>
          <Button 
            type="primary" 
            onClick={() => navigate('/warehouse/products/create')}
          >
            Thêm sản phẩm mới
          </Button>
        </div>

        <Table<WarehouseProductEntity>
          rowKey="id"
          dataSource={filteredProducts}
          columns={columns}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1600 }}
        />
      </Card>
    </Space>
  );
}

