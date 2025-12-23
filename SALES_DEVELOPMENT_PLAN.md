# Kế hoạch phát triển module Bán hàng

## Tổng quan
Phát triển hoàn thiện module bán hàng dựa trên database schema có sẵn với đầy đủ chức năng cho Sales Orders và Quotations.

## Phân tích hiện trạng
### ✅ Đã có:
- Database schema hoàn chỉnh (SalesOrder, Quotation, SalesOrderItem, QuotationItem)
- Backend APIs cho Customers và Products
- Frontend UI cho Customers và Products
- Authentication và RBAC system

### ❌ Cần phát triển:
- Backend APIs cho Sales Orders
- Backend APIs cho Quotations
- Frontend UI cho Sales Orders
- Frontend UI cho Quotations
- Cập nhật menu navigation
- Demo data cho Sales Orders và Quotations

## Kế hoạch phát triển chi tiết

### Phase 1: Backend APIs cho Sales Orders
1. **Sales Orders Controller** (`be/src/modules/sales-orders/`)
   - SalesOrderController: CRUD operations
   - SalesOrderService: Business logic
   - SalesOrderDTOs: Request/Response types
   - SalesOrderRoutes: API endpoints

2. **Quotations Controller** (`be/src/modules/quotations/`)
   - QuotationController: CRUD operations
   - QuotationService: Business logic
   - QuotationDTOs: Request/Response types
   - QuotationRoutes: API endpoints

3. **API Endpoints cần tạo**:
   - GET /sales-orders - Danh sách đơn hàng với filter/pagination
   - GET /sales-orders/:id - Chi tiết đơn hàng
   - POST /sales-orders - Tạo đơn hàng mới
   - PUT /sales-orders/:id - Cập nhật đơn hàng
   - DELETE /sales-orders/:id - Xóa đơn hàng
   - POST /sales-orders/:id/convert-to-workorder - Chuyển đơn hàng thành work order

   - GET /quotations - Danh sách báo giá với filter/pagination
   - GET /quotations/:id - Chi tiết báo giá
   - POST /quotations - Tạo báo giá mới
   - PUT /quotations/:id - Cập nhật báo giá
   - DELETE /quotations/:id - Xóa báo giá
   - POST /quotations/:id/convert-to-order - Chuyển báo giá thành đơn hàng

### Phase 2: Frontend UI cho Sales Orders
1. **Sales Orders Views** (`frontend/src/modules/sales-orders/`)
   - SalesOrdersListView: Danh sách đơn hàng với table, filter, pagination
   - SalesOrderDetailView: Chi tiết đơn hàng với items, status tracking
   - SalesOrderFormView: Form tạo/sửa đơn hàng

2. **Sales Orders Components** (`frontend/src/modules/sales-orders/components/`)
   - OrderStatusBadge: Badge hiển thị trạng thái đơn hàng
   - OrderItemTable: Bảng items trong đơn hàng
   - OrderTotalSummary: Tính tổng tiền đơn hàng
   - OrderFilterBar: Bộ lọc đơn hàng theo status, customer, date

3. **Sales Orders API** (`frontend/src/modules/sales-orders/api/`)
   - getSalesOrders: API lấy danh sách đơn hàng
   - getSalesOrderById: API lấy chi tiết đơn hàng
   - createSalesOrder: API tạo đơn hàng
   - updateSalesOrder: API cập nhật đơn hàng
   - deleteSalesOrder: API xóa đơn hàng

### Phase 3: Frontend UI cho Quotations
1. **Quotations Views** (`frontend/src/modules/quotations/`)
   - QuotationsListView: Danh sách báo giá với table, filter, pagination
   - QuotationDetailView: Chi tiết báo giá với items, validity
   - QuotationFormView: Form tạo/sửa báo giá

2. **Quotations Components** (`frontend/src/modules/quotations/components/`)
   - QuotationStatusBadge: Badge hiển thị trạng thái báo giá
   - QuotationItemTable: Bảng items trong báo giá
   - QuotationTotalSummary: Tính tổng tiền báo giá
   - QuotationFilterBar: Bộ lọc báo giá theo status, customer, validity

3. **Quotations API** (`frontend/src/modules/quotations/api/`)
   - getQuotations: API lấy danh sách báo giá
   - getQuotationById: API lấy chi tiết báo giá
   - createQuotation: API tạo báo giá
   - updateQuotation: API cập nhật báo giá
   - deleteQuotation: API xóa báo giá

### Phase 4: Cập nhật Menu và Routes
1. **Cập nhật Menu** (`frontend/src/constant/menu.vi.tsx`)
   - Thay "Đơn hàng (sắp có)" thành "Đơn hàng"
   - Thay "Báo giá (sắp có)" thành "Báo giá"

2. **Cập nhật Routes** (`frontend/src/routes/urls.ts`)
   - Thêm URL constants cho sales orders và quotations
   - Cập nhật routes configuration

3. **Permissions** (`frontend/src/constant/roles.ts`)
   - Thêm permissions cho sales orders và quotations

### Phase 5: Demo Data và Testing
1. **Demo Data** (`be/add-demo-data.js`)
   - Thêm sample sales orders với various statuses
   - Thêm sample quotations với different customers
   - Thêm sample sales order items và quotation items

2. **Testing**
   - Test tất cả APIs với Postman/cURL
   - Test frontend functionality
   - Test conversion từ quotation thành sales order

## Cấu trúc file cần tạo

### Backend
```
be/src/modules/sales-orders/
├── sales-orders.controller.ts
├── sales-orders.service.ts
├── sales-orders.dto.ts
├── sales-orders.routes.ts
└── sales-orders.types.ts

be/src/modules/quotations/
├── quotations.controller.ts
├── quotations.service.ts
├── quotations.dto.ts
├── quotations.routes.ts
└── quotations.types.ts
```

### Frontend
```
frontend/src/modules/sales-orders/
├── api/
│   ├── get-sales-orders.ts
│   ├── get-sales-order-by-id.ts
│   ├── create-sales-order.ts
│   ├── update-sales-order.ts
│   └── delete-sales-order.ts
├── components/
│   ├── OrderStatusBadge.tsx
│   ├── OrderItemTable.tsx
│   ├── OrderTotalSummary.tsx
│   └── OrderFilterBar.tsx
├── views/
│   ├── SalesOrdersListView.tsx
│   ├── SalesOrderDetailView.tsx
│   └── SalesOrderFormView.tsx
├── types/
│   └── index.ts
└── utils/
    └── order-helpers.ts

frontend/src/modules/quotations/
├── api/
│   ├── get-quotations.ts
│   ├── get-quotation-by-id.ts
│   ├── create-quotation.ts
│   ├── update-quotation.ts
│   └── delete-quotation.ts
├── components/
│   ├── QuotationStatusBadge.tsx
│   ├── QuotationItemTable.tsx
│   ├── QuotationTotalSummary.tsx
│   └── QuotationFilterBar.tsx
├── views/
│   ├── QuotationsListView.tsx
│   ├── QuotationDetailView.tsx
│   └── QuotationFormView.tsx
├── types/
│   └── index.ts
└── utils/
    └── quotation-helpers.ts
```

## Chức năng chính cần implement

### Sales Orders
1. **CRUD Operations**: Tạo, đọc, cập nhật, xóa đơn hàng
2. **Order Management**: Quản lý trạng thái đơn hàng (draft, confirmed, processing, shipped, delivered, cancelled)
3. **Order Items**: Quản lý items trong đơn hàng
4. **Order Totals**: Tính toán subtotal, shipping, tax, discount, total
5. **Status Tracking**: Theo dõi lịch sử thay đổi trạng thái
6. **Conversion**: Chuyển đơn hàng thành work order

### Quotations
1. **CRUD Operations**: Tạo, đọc, cập nhật, xóa báo giá
2. **Quotation Management**: Quản lý trạng thái báo giá (draft, sent, approved, rejected, expired)
3. **Quotation Items**: Quản lý items trong báo giá
4. **Quotation Totals**: Tính toán subtotal, discount, total
5. **Validity**: Quản lý thời hạn hiệu lực
6. **Conversion**: Chuyển báo giá thành đơn hàng

## Timeline
- **Phase 1**: Backend APIs (2-3 ngày)
- **Phase 2**: Frontend Sales Orders (3-4 ngày)
- **Phase 3**: Frontend Quotations (3-4 ngày)
- **Phase 4**: Menu/Routes/Permissions (1 ngày)
- **Phase 5**: Demo Data và Testing (1-2 ngày)

**Tổng cộng: 10-14 ngày**

## Kết quả mong đợi
- Module bán hàng hoàn chỉnh với đầy đủ chức năng
- UI/UX chuyên nghiệp, responsive
- Code clean, maintainable
- Đầy đủ permissions và access control
- Demo data phong phú để testing
- Documentation đầy đủ

