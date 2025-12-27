import { Card, Space, Typography, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingOutlined, 
  AppstoreOutlined, 
  BgColorsOutlined,
  ClusterOutlined,
  PlusOutlined
} from "@ant-design/icons";

export default function ProductManagement() {
  const nav = useNavigate();

  const modules = [
    {
      title: "Kiểu dáng sản phẩm",
      description: "Quản lý các kiểu dáng (styles) của sản phẩm như áo thun, áo sơ mi, quần jeans...",
      icon: <ShoppingOutlined style={{ fontSize: 32, color: "#1890ff" }} />,
      path: "/product-styles",
      color: "#e6f7ff",
    },
    {
      title: "Kích thước",
      description: "Quản lý các kích thước (sizes) như S, M, L, XL hoặc các size số như 38, 40, 42...",
      icon: <AppstoreOutlined style={{ fontSize: 32, color: "#52c41a" }} />,
      path: "/sizes",
      color: "#f6ffed",
    },
    {
      title: "Màu sắc",
      description: "Quản lý các màu sắc (colors) với mã màu và tên gọi tương ứng",
      icon: <BgColorsOutlined style={{ fontSize: 32, color: "#fa8c16" }} />,
      path: "/colors",
      color: "#fff7e6",
    },
    {
      title: "Biến thể sản phẩm",
      description: "Quản lý các biến thể (variants) kết hợp kiểu dáng + kích thước + màu sắc",
      icon: <ClusterOutlined style={{ fontSize: 32, color: "#722ed1" }} />,
      path: "/product-variants",
      color: "#f9f0ff",
    },
  ];

  return (
    <Space direction="vertical" size={24} style={{ width: "100%" }}>
      <div className="text-center">
        <Typography.Title level={2} style={{ marginBottom: 8 }}>
          Quản lý sản phẩm
        </Typography.Title>
        <Typography.Text type="secondary">
          Quản lý kiểu dáng, kích thước, màu sắc và các biến thể sản phẩm
        </Typography.Text>
      </div>

      <Row gutter={[24, 24]}>
        {modules.map((module, index) => (
          <Col xs={24} sm={12} lg={12} xl={12} key={index}>
            <Card
              hoverable
              style={{ 
                height: 200,
                border: "1px solid #f0f0f0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                backgroundColor: module.color
              }}
              bodyStyle={{ 
                padding: 24, 
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
              onClick={() => nav(module.path)}
            >
              <div>
                <div style={{ marginBottom: 16 }}>
                  {module.icon}
                </div>
                <Typography.Title level={4} style={{ marginBottom: 8 }}>
                  {module.title}
                </Typography.Title>
                <Typography.Text type="secondary" style={{ fontSize: 14 }}>
                  {module.description}
                </Typography.Text>
              </div>
              
              <div style={{ marginTop: 16 }}>
                <Typography.Link 
                  style={{ 
                    color: "#1890ff", 
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 4
                  }}
                >
                  <PlusOutlined />
                  Quản lý
                </Typography.Link>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Thông tin chi tiết về cấu trúc sản phẩm */}
      <Card title="Cấu trúc sản phẩm trong hệ thống" style={{ marginTop: 24 }}>
        <Row gutter={[24, 16]}>
          <Col span={24}>
            <Typography.Paragraph>
              Hệ thống ERP quản lý sản phẩm theo cấu trúc phân cấp:
            </Typography.Paragraph>
          </Col>
          
          <Col span={24}>
            <Typography.Paragraph>
              <strong>1. ProductStyle (Kiểu dáng):</strong> Loại sản phẩm cơ bản như "Áo thun basic", "Quần jeans skinny"
            </Typography.Paragraph>
          </Col>
          
          <Col span={24}>
            <Typography.Paragraph>
              <strong>2. Size (Kích thước):</strong> Các size như S, M, L, XL hoặc số 38, 40, 42
            </Typography.Paragraph>
          </Col>
          
          <Col span={24}>
            <Typography.Paragraph>
              <strong>3. Color (Màu sắc):</strong> Các màu với mã màu và tên gọi
            </Typography.Paragraph>
          </Col>
          
          <Col span={24}>
            <Typography.Paragraph>
              <strong>4. ProductVariant (Biến thể):</strong> Kết hợp cụ thể của Style + Size + Color (ví dụ: "Áo thun basic" + "Size M" + "Màu đỏ")
            </Typography.Paragraph>
          </Col>
          
          <Col span={24}>
            <Typography.Paragraph>
              <strong>5. Item (Vật tư):</strong> Nguyên liệu sử dụng trong sản xuất như vải, chỉ, nút áo...
            </Typography.Paragraph>
          </Col>
        </Row>
      </Card>
    </Space>
  );
}
