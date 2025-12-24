# Backend API Documentation

## Base URL
```
http://localhost:4000
```

## Authentication
- **POST** `/auth/login` - Đăng nhập
- **POST** `/auth/refresh` - Làm mới token
- **POST** `/auth/logout` - Đăng xuất

### Auth Payloads
```typescript
// Login
{
  email: string;
  password: string;
}

// Refresh/Logout
{
  refreshToken: string;
}
```

## Users & RBAC
- **GET** `/me` - Lấy thông tin user hiện tại
- **GET** `/users` - Danh sách users
- **GET** `/users/:id` - Chi tiết user
- **POST** `/users` - Tạo user mới
- **PUT** `/users/:id` - Cập nhật user
- **DELETE** `/users/:id` - Xóa user
- **GET** `/roles` - Danh sách roles
- **POST** `/roles` - Tạo role mới
- **PUT** `/roles/:id` - Cập nhật role
- **DELETE** `/roles/:id` - Xóa role
- **GET** `/permissions` - Danh sách permissions

## Customers
- **GET** `/customers` - Danh sách customers (với query params)
- **GET** `/customers/:id` - Chi tiết customer
- **POST** `/customers` - Tạo customer mới (cần auth)
- **PUT** `/customers/:id` - Cập nhật customer (cần auth)
- **DELETE** `/customers/:id` - Xóa customer (cần auth)
- **GET** `/customers/:id/notes` - Danh sách notes của customer
- **POST** `/customers/:id/notes` - Tạo note mới (cần auth)
- **DELETE** `/customers/:id/notes/:noteId` - Xóa note

## Suppliers
- **GET** `/suppliers` - Danh sách suppliers
- **GET** `/suppliers/:id` - Chi tiết supplier
- **POST** `/suppliers` - Tạo supplier mới
- **PUT** `/suppliers/:id` - Cập nhật supplier
- **DELETE** `/suppliers/:id` - Xóa supplier

## Items
- **GET** `/items` - Danh sách items
- **GET** `/items/:id` - Chi tiết item
- **POST** `/items` - Tạo item mới
- **PUT** `/items/:id` - Cập nhật item
- **DELETE** `/items/:id` - Xóa item

## Product Management
### Product Styles
- **GET** `/product-styles` - Danh sách product styles
- **GET** `/product-styles/:id` - Chi tiết product style
- **POST** `/product-styles` - Tạo product style
- **PUT** `/product-styles/:id` - Cập nhật product style
- **DELETE** `/product-styles/:id` - Xóa product style

### Sizes
- **GET** `/sizes` - Danh sách sizes
- **GET** `/sizes/:id` - Chi tiết size
- **POST** `/sizes` - Tạo size mới
- **PUT** `/sizes/:id` - Cập nhật size
- **DELETE** `/sizes/:id` - Xóa size

### Colors
- **GET** `/colors` - Danh sách colors
- **GET** `/colors/:id` - Chi tiết color
- **POST** `/colors` - Tạo color mới
- **PUT** `/colors/:id` - Cập nhật color
- **DELETE** `/colors/:id` - Xóa color

### Product Variants
- **GET** `/product-variants` - Danh sách product variants
- **GET** `/product-variants/:id` - Chi tiết product variant
- **POST** `/product-variants` - Tạo product variant mới
- **PUT** `/product-variants/:id` - Cập nhật product variant
- **DELETE** `/product-variants/:id` - Xóa product variant

## Sales Orders
- **GET** `/sales-orders` - Danh sách sales orders
- **GET** `/sales-orders/:id` - Chi tiết sales order
- **POST** `/sales-orders` - Tạo sales order mới (cần auth)
- **PUT** `/sales-orders/:id` - Cập nhật sales order (cần auth)
- **DELETE** `/sales-orders/:id` - Xóa sales order
- **POST** `/sales-orders/:id/confirm` - Xác nhận sales order
- **POST** `/sales-orders/:id/cancel` - Hủy sales order

## Purchase Orders
- **GET** `/purchase-orders` - Danh sách purchase orders
- **GET** `/purchase-orders/:id` - Chi tiết purchase order
- **POST** `/purchase-orders` - Tạo purchase order mới
- **PUT** `/purchase-orders/:id` - Cập nhật purchase order
- **DELETE** `/purchase-orders/:id` - Xóa purchase order

## Production Orders
- **GET** `/production-orders` - Danh sách production orders
- **GET** `/production-orders/:id` - Chi tiết production order
- **POST** `/production-orders` - Tạo production order mới
- **PUT** `/production-orders/:id` - Cập nhật production order
- **DELETE** `/production-orders/:id` - Xóa production order

## Warehouse Management
### Warehouses
- **GET** `/warehouses` - Danh sách warehouses
- **GET** `/warehouses/:id` - Chi tiết warehouse
- **POST** `/warehouses` - Tạo warehouse mới
- **PUT** `/warehouses/:id` - Cập nhật warehouse
- **DELETE** `/warehouses/:id` - Xóa warehouse

### Locations
- **GET** `/locations` - Danh sách locations
- **GET** `/locations/:id` - Chi tiết location
- **POST** `/locations` - Tạo location mới
- **PUT** `/locations/:id` - Cập nhật location
- **DELETE** `/locations/:id` - Xóa location

### Stock Moves
- **GET** `/stock-moves` - Danh sách stock moves
- **GET** `/stock-moves/:id` - Chi tiết stock move
- **POST** `/stock-moves` - Tạo stock move mới
- **PUT** `/stock-moves/:id` - Cập nhật stock move
- **DELETE** `/stock-moves/:id` - Xóa stock move

### Inventory
- **GET** `/inventory/ledger` - Sổ cái tồn kho
- **GET** `/inventory/onhand` - Tồn hiện tại

## Production Planning
### BOMs
- **GET** `/boms` - Danh sách BOMs
- **GET** `/boms/:id` - Chi tiết BOM
- **POST** `/boms` - Tạo BOM mới
- **PUT** `/boms/:id` - Cập nhật BOM
- **DELETE** `/boms/:id` - Xóa BOM

## Response Format
Tất cả responses đều có format:
```typescript
{
  error?: {
    code: string;
    message: string;
  };
  data: any;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
    totalPages?: number;
  };
}
```

## Query Parameters
Hầu hết endpoints list đều support:
```typescript
{
  page?: number;          // Trang (default: 1)
  pageSize?: number;      // Số lượng per page (default: 20)
  sortBy?: string;        // Field sắp xếp
  sortOrder?: 'asc' | 'desc';  // Thứ tự sắp xếp
  q?: string;             // Tìm kiếm text
}
```

## Headers Required
- **Content-Type**: application/json
- **Authorization**: Bearer {accessToken} (cho các endpoint cần auth)

## Status Codes
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

