e# TÀI LIỆU API HỆ THỐNG BOM VÀ ERP - CHI TIẾT VÀ ĐẦY ĐỦ

## TỔNG QUAN HỆ THỐNG

Hệ thống ERP với BOM Management là một giải pháp toàn diện cho việc quản lý sản xuất, vật tư, và tồn kho. Bao gồm các module chính: BOM, Production Orders, Inventory, Sales Orders, Purchase Orders, Stock Moves.

**Base URL:** `http://localhost:4000`
**Authentication:** Bearer Token (trừ GET endpoints)
**Data Format:** JSON

---

## 1. BOM API - QUẢN LÝ CẤU TRÚC SẢN PHẨM

### 🎯 **Mục đích sử dụng:**
Quản lý Bill of Materials (BOM) - cấu trúc chi tiết các thành phần tạo nên sản phẩm. Bao gồm tính năng explosion, versioning, templates và cost calculation.

### 📋 **Endpoints:**

#### 1.1. GET `/boms` - Danh sách BOM
**Tác dụng:** Lấy danh sách BOM với phân trang và tìm kiếm

**Request:**
```javascript
GET /boms?page=1&pageSize=10&q=tshirt&productStyleId=123
```

**Query Parameters:**
- `page`: Số trang (mặc định: 1)
- `pageSize`: Số lượng mỗi trang (mặc định: 20)
- `q`: Tìm kiếm theo code hoặc name
- `productStyleId`: Lọc theo product style
- `isActive`: Lọc theo trạng thái active

**Response:**
```json
{
  "page": 1,
  "pageSize": 10,
  "total": 5,
  "items": [
    {
      "id": "123",
      "code": "BOM-TSH001",
      "name": "T-Shirt BOM",
      "productStyleId": "456",
      "productStyle": {
        "id": "456",
        "name": "Cotton T-Shirt",
        "code": "TSH001"
      },
      "isActive": true,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-20T15:30:00Z"
    }
  ]
}
```

#### 1.2. POST `/boms` - Tạo BOM mới
**Tác dụng:** Tạo BOM mới với danh sách materials

**Authentication:** Required

**Request:**
```javascript
POST /boms
{
  "code": "BOM-TSH001",
  "name": "T-Shirt BOM",
  "productStyleId": "456",
  "isActive": true,
  "lines": [
    {
      "itemId": "789",
      "uom": "m",
      "qtyPerUnit": 1.5,
      "wastagePercent": 10.0,
      "note": "Main fabric",
      "isOptional": false,
      "leadTimeDays": 3
    },
    {
      "itemId": "790",
      "uom": "pcs",
      "qtyPerUnit": 5.0,
      "wastagePercent": 5.0,
      "note": "Sewing thread",
      "isOptional": false,
      "leadTimeDays": 2
    }
  ]
}
```

**Response:**
```json
{
  "id": "123"
}
```

#### 1.3. GET `/boms/:id` - Chi tiết BOM
**Tác dụng:** Lấy thông tin chi tiết BOM kèm lines

**Response:**
```json
{
  "id": "123",
  "code": "BOM-TSH001",
  "name": "T-Shirt BOM",
  "productStyleId": "456",
  "productStyle": { "id": "456", "name": "Cotton T-Shirt" },
  "isActive": true,
  "lines": [
    {
      "id": "456",
      "bomId": "123",
      "itemId": "789",
      "item": {
        "id": "789",
        "name": "Cotton Fabric",
        "sku": "FAB001"
      },
      "uom": "m",
      "qtyPerUnit": "1.5",
      "wastagePercent": "10.0",
      "note": "Main fabric",
      "isOptional": false,
      "leadTimeDays": 3
    }
  ]
}
```

#### 1.4. PUT `/boms/:id` - Cập nhật BOM
**Tác dụng:** Cập nhật thông tin BOM và lines

**Authentication:** Required

**Request:**
```javascript
PUT /boms/123
{
  "code": "BOM-TSH001-V2",
  "name": "T-Shirt BOM Updated",
  "isActive": true,
  "lines": [
    // Thay thế toàn bộ lines hiện tại
    {
      "itemId": "789",
      "uom": "m",
      "qtyPerUnit": 1.6,
      "wastagePercent": 12.0
    }
  ]
}
```

#### 1.5. DELETE `/boms/:id` - Xóa BOM
**Tác dụng:** Xóa BOM (chỉ khi không có production order nào sử dụng)

**Authentication:** Required

**Response:**
```json
{
  "ok": true
}
```

### 🚀 **Advanced BOM Features:**

#### 1.6. GET `/boms/:id/explode` - Explode BOM
**Tác dụng:** Tính toán tất cả materials cần thiết (multi-level BOM)

**Request:**
```javascript
GET /boms/123/explode?quantity=100
```

**Query Parameters:**
- `quantity`: Số lượng sản phẩm cần sản xuất (mặc định: 1)
- `bomVersionId`: BOM version cụ thể (optional)

**Response:**
```json
{
  "items": [
    {
      "itemId": "789",
      "itemName": "Cotton Fabric",
      "sku": "FAB001",
      "uom": "m",
      "qtyRequired": 165.0,
      "itemType": "MATERIAL"
    },
    {
      "itemId": "790",
      "itemName": "Sewing Thread",
      "sku": "THR001", 
      "uom": "pcs",
      "qtyRequired": 525.0,
      "itemType": "MATERIAL"
    }
  ],
  "totalItems": 2,
  "quantity": 100
}
```

**Use Case:** Tính toán requirements cho production planning

#### 1.7. GET `/boms/:id/cost` - Tính toán cost BOM
**Tác dụng:** Tính toán chi phí vật liệu cho BOM

**Request:**
```javascript
GET /boms/123/cost?quantity=100
```

**Response:**
```json
{
  "totalMaterialCost": 1234.56,
  "materialCosts": [
    {
      "itemId": "789",
      "itemName": "Cotton Fabric",
      "sku": "FAB001",
      "uom": "m",
      "qtyRequired": 165.0,
      "unitCost": 5.50,
      "totalCost": 907.50
    }
  ],
  "quantity": 100
}
```

#### 1.8. GET `/boms/:id/lead-time` - Tính toán lead time
**Tác dụng:** Tính toán thời gian cần thiết để sản xuất

**Request:**
```javascript
GET /boms/123/lead-time
```

**Response:**
```json
{
  "maxLeadTime": 5,
  "totalLeadTime": 8,
  "estimatedDays": 5
}
```

### 📄 **BOM Templates:**

#### 1.9. GET `/boms/templates` - Danh sách templates
**Response:**
```json
{
  "page": 1,
  "pageSize": 20,
  "total": 3,
  "items": [
    {
      "id": "1001",
      "name": "Basic T-Shirt Template",
      "code": "TPL-TSH-001",
      "description": "Standard t-shirt template",
      "category": "APPAREL",
      "usageCount": "5"
    }
  ]
}
```

#### 1.10. POST `/boms/templates` - Tạo template
**Tác dụng:** Tạo BOM template để sử dụng lại

**Authentication:** Required

**Request:**
```javascript
POST /boms/templates
{
  "name": "Basic T-Shirt Template",
  "code": "TPL-TSH-001",
  "description": "Standard t-shirt with common materials",
  "category": "APPAREL",
  "templateData": {
    "lines": [
      {
        "itemId": "789",
        "uom": "m",
        "qtyPerUnit": 1.5,
        "wastagePercent": 10.0
      }
    ]
  }
}
```

#### 1.11. POST `/boms/templates/:templateId/create-bom` - Tạo BOM từ template
**Tác dụng:** Nhanh chóng tạo BOM mới từ template

**Authentication:** Required

**Request:**
```javascript
POST /boms/templates/1001/create-bom
{
  "code": "BOM-POLO-001",
  "productStyleId": "456",
  "name": "Polo Shirt BOM"
}
```

### 🔄 **BOM Versioning System:**

#### 1.12. POST `/boms/:id/versions` - Tạo BOM version mới
**Tác dụng:** Tạo version mới của BOM để thực hiện changes

**Authentication:** Required

**Workflow:** DRAFT → PENDING_APPROVAL → APPROVED/REJECTED

**Request:**
```javascript
POST /boms/123/versions
{
  "versionNo": "2.0",
  "description": "Updated with new fabric supplier",
  "effectiveFrom": "2024-02-01T00:00:00Z",
  "parentVersionId": "456" // Version trước đó (optional)
}
```

**Response:**
```json
{
  "id": "789",
  "versionNo": "2.0"
}
```

**Use Case:** Khi cần update BOM materials, quantities, hoặc structure

#### 1.13. POST `/boms/versions/:versionId/submit-approval` - Submit for approval
**Tác dụng:** Submit BOM version để được duyệt

**Authentication:** Required

**Request:**
```javascript
POST /boms/versions/789/submit-approval
{
  "approvers": ["1", "2", "3"] // Array of user IDs
}
```

**Response:**
```json
{
  "ok": true,
  "status": "PENDING_APPROVAL"
}
```

#### 1.14. POST `/boms/versions/:versionId/approve` - Approve BOM version
**Tác dụng:** Phê duyệt BOM version

**Authentication:** Required

**Logic:** Nếu tất cả approvers đều approve → Version becomes APPROVED và CURRENT

**Request:**
```javascript
POST /boms/versions/789/approve
{
  "comments": "Approved with minor adjustments"
}
```

**Response:**
```json
{
  "ok": true,
  "status": "APPROVED",
  "isCurrent": true
}
```

#### 1.15. POST `/boms/versions/:versionId/reject` - Reject BOM version
**Tác dụng:** Từ chối BOM version

**Authentication:** Required

**Request:**
```javascript
POST /boms/versions/789/reject
{
  "comments": "Need to review material specifications"
}
```

**Response:**
```json
{
  "ok": true,
  "status": "REJECTED"
}
```

#### 1.16. GET `/boms/:id/current-version` - Lấy version hiện tại
**Tác dụng:** Lấy thông tin version hiện tại đang được sử dụng

**Request:**
```javascript
GET /boms/123/current-version
```

**Response:**
```json
{
  "id": "789",
  "bomId": "123",
  "versionNo": "2.0",
  "status": "APPROVED",
  "isCurrent": true,
  "effectiveFrom": "2024-02-01T00:00:00Z",
  "bom": {
    "id": "123",
    "code": "BOM-TSH001",
    "name": "T-Shirt BOM",
    "lines": [
      {
        "id": "456",
        "itemId": "789",
        "item": {
          "id": "789",
          "name": "Cotton Fabric",
          "sku": "FAB001"
        },
        "uom": "m",
        "qtyPerUnit": "1.5",
        "wastagePercent": "10.0"
      }
    ]
  }
}
```

#### 1.17. GET `/boms/versions/compare` - So sánh 2 versions
**Tác dụng:** So sánh 2 BOM versions để xem sự khác biệt

**Request:**
```javascript
GET /boms/versions/compare?versionId1=789&versionId2=790
```

**Response:**
```json
{
  "version1": {
    "id": "789",
    "versionNo": "2.0",
    "status": "APPROVED"
  },
  "version2": {
    "id": "790", 
    "versionNo": "1.0",
    "status": "APPROVED"
  },
  "comparison": {
    "totalLines": {
      "version1": 3,
      "version2": 2
    },
    "addedLines": [
      {
        "itemId": "791",
        "itemName": "New Thread",
        "qtyPerUnit": 5.0
      }
    ],
    "removedLines": [
      {
        "itemId": "788",
        "itemName": "Old Thread",
        "qtyPerUnit": 3.0
      }
    ],
    "modifiedLines": [
      {
        "itemId": "789",
        "field": "qtyPerUnit",
        "oldValue": "1.0",
        "newValue": "1.5"
      }
    ]
  }
}
```

### 📊 **BOM Versioning Workflow:**

```
DRAFT (tạo version mới)
    ↓
PENDING_APPROVAL (submit for approval)
    ↓
APPROVED ←→ REJECTED (bởi approvers)
    ↓
CURRENT (version active)
```

**Approval Logic:**
- Version cần đủ số lượng approvals theo cấu hình
- Chỉ 1 version có thể là CURRENT tại 1 thời điểm
- Khi approve version mới → Unset version cũ khỏi CURRENT
- Production Orders sử dụng BOM theo version CURRENT tại thời điểm tạo

**Use Cases cho BOM Versioning:**
1. **Supplier Changes**: Thay đổi nhà cung cấp nguyên liệu
2. **Cost Optimization**: Tối ưu chi phí bằng cách thay đổi specifications
3. **Quality Improvements**: Nâng cao chất lượng sản phẩm
4. **Regulatory Compliance**: Tuân thủ các quy định mới
5. **Seasonal Variations**: BOM khác nhau cho từng season

**Best Practices:**
- Mỗi version cần description rõ ràng về changes
- Set effective date để kiểm soát khi nào version có hiệu lực
- Version numbering theo semantic versioning (1.0, 1.1, 2.0, etc.)
- Approval workflow đảm bảo quality control
### 📄 **BOM Templates:**

#### 1.9. GET `/boms/templates` - Danh sách templates
**Response:**
```json
{
  "page": 1,
  "pageSize": 20,
  "total": 3,
  "items": [
    {
      "id": "1001",
      "name": "Basic T-Shirt Template",
      "code": "TPL-TSH-001",
      "description": "Standard t-shirt template",
      "category": "APPAREL",
      "usageCount": "5"
    }
  ]
}
```

#### 1.10. POST `/boms/templates` - Tạo template
**Tác dụng:** Tạo BOM template để sử dụng lại

**Authentication:** Required

**Request:**
```javascript
POST /boms/templates
{
  "name": "Basic T-Shirt Template",
  "code": "TPL-TSH-001",
  "description": "Standard t-shirt with common materials",
  "category": "APPAREL",
  "templateData": {
    "lines": [
      {
        "itemId": "789",
        "uom": "m",
        "qtyPerUnit": 1.5,
        "wastagePercent": 10.0
      }
    ]
  }
}
```

#### 1.11. POST `/boms/templates/:templateId/create-bom` - Tạo BOM từ template
**Tác dụng:** Nhanh chóng tạo BOM mới từ template

**Authentication:** Required

**Request:**
```javascript
POST /boms/templates/1001/create-bom
{
  "code": "BOM-POLO-001",
  "productStyleId": "456",
  "name": "Polo Shirt BOM"
}
```

---

## 2. PRODUCTION ORDERS API - QUẢN LÝ ĐƠN SẢN XUẤT

### 🎯 **Mục đích sử dụng:**
Quản lý đơn hàng sản xuất, tự động tính toán material requirements từ BOM, theo dõi tiến độ sản xuất.

### 📋 **Endpoints:**

#### 2.1. GET `/production-orders` - Danh sách đơn sản xuất
**Tác dụng:** Lấy danh sách đơn sản xuất với filter và search

**Request:**
```javascript
GET /production-orders?page=1&pageSize=10&q=MO2024&status=RUNNING&productStyleId=456
```

**Query Parameters:**
- `q`: Tìm kiếm theo MO number
- `status`: Lọc theo status (DRAFT, RELEASED, RUNNING, DONE, CANCELLED)
- `productStyleId`: Lọc theo product style
- `fromDate/toDate`: Lọc theo khoảng thời gian

**Response:**
```json
{
  "page": 1,
  "pageSize": 10,
  "total": 8,
  "items": [
    {
      "id": "1001",
      "moNo": "MO202401-001",
      "productStyleId": "456",
      "productStyle": {
        "id": "456",
        "name": "Cotton T-Shirt",
        "code": "TSH001"
      },
      "qtyPlan": "100.00",
      "qtyDone": "75.00",
      "status": "RUNNING",
      "startDate": "2024-01-20T08:00:00Z",
      "dueDate": "2024-01-27T17:00:00Z",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

#### 2.2. POST `/production-orders` - Tạo đơn sản xuất mới
**Tác dụng:** Tạo đơn sản xuất mới (có thể tự động generate material requirements từ BOM)

**Authentication:** Required

**Request:**
```javascript
POST /production-orders
{
  "productStyleId": "456",
  "qtyPlan": 100,
  "startDate": "2024-01-20T08:00:00Z",
  "dueDate": "2024-01-27T17:00:00Z",
  "note": "Urgent order for customer ABC"
}
```

**Response:**
```json
{
  "id": "1001"
}
```

#### 2.3. GET `/production-orders/:id` - Chi tiết đơn sản xuất
**Tác dụng:** Lấy thông tin chi tiết MO kèm material requirements và breakdowns

**Response:**
```json
{
  "id": "1001",
  "moNo": "MO202401-001",
  "productStyleId": "456",
  "productStyle": { "id": "456", "name": "Cotton T-Shirt" },
  "qtyPlan": "100.00",
  "qtyDone": "75.00",
  "status": "RUNNING",
  "materialRequirements": [
    {
      "id": "2001",
      "itemId": "789",
      "item": {
        "id": "789",
        "name": "Cotton Fabric",
        "sku": "FAB001"
      },
      "uom": "m",
      "qtyRequired": "150.00",
      "qtyIssued": "112.50",
      "wastagePercent": "10.0"
    }
  ],
  "breakdowns": [
    {
      "id": "3001",
      "productVariantId": "567",
      "productVariant": {
        "id": "567",
        "sku": "TSH001-S-M-BLU",
        "size": { "id": "100", "name": "M" },
        "color": { "id": "200", "name": "Blue" }
      },
      "qtyPlan": "30.00",
      "qtyDone": "25.00"
    }
  ]
}
```

#### 2.4. PUT `/production-orders/:id` - Cập nhật đơn sản xuất
**Tác dụng:** Cập nhật thông tin MO (không thể cập nhật khi đang RUNNING)

**Authentication:** Required

**Request:**
```javascript
PUT /production-orders/1001
{
  "qtyPlan": 120,
  "dueDate": "2024-01-28T17:00:00Z",
  "note": "Quantity increased due to customer request"
}
```

#### 2.5. POST `/production-orders/:id/generate-materials` - Generate material requirements
**Tác dụng:** Tự động tính toán material requirements từ BOM

**Authentication:** Required

**Request:**
```javascript
POST /production-orders/1001/generate-materials
{
  "mode": "replace" // hoặc "merge"
}
```

**Response:**
```json
{
  "ok": true,
  "mode": "replace",
  "bomId": "123",
  "items": [
    {
      "id": "2001",
      "itemId": "789",
      "uom": "m",
      "qtyRequired": "150.00",
      "qtyIssued": "0.00",
      "wastagePercent": "10.0",
      "item": {
        "id": "789",
        "name": "Cotton Fabric"
      }
    }
  ]
}
```

#### 2.6. POST `/production-orders/:id/release` - Release đơn sản xuất
**Tác dụng:** Chuyển đổi status từ DRAFT sang RELEASED

**Authentication:** Required

**Response:**
```json
{
  "ok": true
}
```

#### 2.7. POST `/production-orders/:id/start` - Bắt đầu sản xuất
**Tác dụng:** Chuyển đổi status từ RELEASED sang RUNNING

**Response:**
```json
{
  "ok": true
}
```

#### 2.8. POST `/production-orders/:id/done` - Hoàn thành sản xuất
**Tác dụng:** Chuyển đổi status từ RUNNING sang DONE

**Response:**
```json
{
  "ok": true
}
```

#### 2.9. POST `/production-orders/from-sales-order/:salesOrderId` - Tạo MO từ Sales Order
**Tác dụng:** Tự động tạo đơn sản xuất cho từng item trong Sales Order

**Authentication:** Required

**Response:**
```json
{
  "ok": true,
  "salesOrderId": "4001",
  "createdProductionOrders": ["1001", "1002", "1003"],
  "message": "Đã tạo 3 đơn sản xuất từ đơn hàng SO2024-001"
}
```

---

## 3. INVENTORY API - QUẢN LÝ TỒN KHO

### 🎯 **Mục đích sử dụng:**
Theo dõi tồn kho real-time, tính toán on-hand quantities, xem lịch sử movements.

### 📋 **Endpoints:**

#### 3.1. GET `/inventory/onhand` - Xem tồn kho
**Tác dụng:** Xem tồn kho hiện tại theo items và variants

**Request:**
```javascript
GET /inventory/onhand?page=1&pageSize=20&warehouseId=1&itemType=MATERIAL
```

**Query Parameters:**
- `warehouseId`: Lọc theo warehouse
- `locationId`: Lọc theo location cụ thể
- `itemId`: Lọc theo item
- `productVariantId`: Lọc theo variant
- `itemType`: Lọc theo loại item (MATERIAL, PRODUCT, etc.)
- `q`: Tìm kiếm theo tên hoặc SKU

**Response:**
```json
{
  "page": 1,
  "pageSize": 20,
  "items": [
    {
      "locationId": "5",
      "location": {
        "id": "5",
        "code": "WH1-MAIN",
        "name": "Main Warehouse",
        "warehouseId": "1"
      },
      "itemId": "789",
      "item": {
        "id": "789",
        "sku": "FAB001",
        "name": "Cotton Fabric",
        "itemType": "MATERIAL",
        "baseUom": "m"
      },
      "uom": "m",
      "qty": 150.5
    }
  ],
  "itemsTotal": 25,
  "variants": [
    {
      "locationId": "5",
      "productVariantId": "567",
      "productVariant": {
        "id": "567",
        "sku": "TSH001-S-M-BLU",
        "productStyle": { "id": "456", "name": "Cotton T-Shirt" },
        "size": { "id": "100", "name": "M" },
        "color": { "id": "200", "name": "Blue" }
      },
      "uom": "pcs",
      "qty": 30
    }
  ],
  "variantsTotal": 15
}
```

#### 3.2. GET `/inventory/ledger` - Lịch sử tồn kho
**Tác dụng:** Xem lịch sử movements và transactions

**Request:**
```javascript
GET /inventory/ledger?page=1&pageSize=20&itemId=789&moveType=RECEIPT&fromDate=2024-01-01
```

**Query Parameters:**
- `warehouseId`: Lọc theo warehouse
- `locationId`: Lọc theo location
- `itemId/productVariantId`: Lọc theo item/variant
- `moveType`: Lọc theo loại movement (RECEIPT, ISSUE, OUT, etc.)
- `fromDate/toDate`: Lọc theo khoảng thời gian

**Response:**
```json
{
  "page": 1,
  "pageSize": 20,
  "total": 156,
  "items": [
    {
      "lineId": "5001",
      "stockMoveId": "6001",
      "moveNo": "SM202401-001",
      "moveType": "RECEIPT",
      "moveDate": "2024-01-20T10:30:00Z",
      "status": "POSTED",
      "warehouseId": "1",
      "warehouse": { "id": "1", "name": "Main Warehouse" },
      "itemId": "789",
      "uom": "m",
      "qty": "100.00",
      "signedQty": 100.00,
      "unitCost": "5.50",
      "fromLocationId": null,
      "toLocationId": "5",
      "toLocation": {
        "id": "5",
        "code": "WH1-MAIN",
        "name": "Main Warehouse"
      },
      "item": {
        "id": "789",
        "sku": "FAB001",
        "name": "Cotton Fabric"
      }
    }
  ]
}
```

---

## 4. STOCK MOVES API - DI CHUYỂN VẬT TƯ

### 🎯 **Mục đích sử dụng:**
Quản lý các movement của vật tư (xuất kho, nhập kho, chuyển kho), tự động cập nhật tồn kho và status của related documents.

### 📋 **Endpoints:**

#### 4.1. GET `/stock-moves` - Danh sách stock moves
**Tác dụng:** Lấy danh sách các movement

**Request:**
```javascript
GET /stock-moves?page=1&pageSize=10&moveType=RECEIPT&status=DRAFT
```

**Query Parameters:**
- `moveType`: RECEIPT, ISSUE, OUT, TRANSFER
- `status`: DRAFT, POSTED
- `warehouseId`: Lọc theo warehouse
- `fromDate/toDate`: Lọc theo khoảng thời gian

#### 4.2. POST `/stock-moves` - Tạo stock move
**Tác dụng:** Tạo movement mới (chưa posting)

**Authentication:** Required

**Request:**
```javascript
POST /stock-moves
{
  "moveNo": "SM202401-001",
  "moveType": "RECEIPT",
  "warehouseId": "1",
  "note": "Receipt from PO 2024-001",
  "lines": [
    {
      "itemId": "789",
      "qty": 100,
      "uom": "m",
      "toLocationId": "5",
      "unitCost": 5.50,
      "note": "Cotton fabric"
    }
  ]
}
```

#### 4.3. GET `/stock-moves/:id` - Chi tiết stock move
**Response:**
```json
{
  "id": "6001",
  "moveNo": "SM202401-001",
  "moveType": "RECEIPT",
  "warehouseId": "1",
  "status": "DRAFT",
  "lines": [
    {
      "id": "7001",
      "itemId": "789",
      "qty": "100.00",
      "uom": "m",
      "toLocationId": "5",
      "unitCost": "5.50",
      "item": {
        "id": "789",
        "sku": "FAB001",
        "name": "Cotton Fabric"
      }
    }
  ]
}
```

#### 4.4. POST `/stock-moves/:id/post` - Posting stock move
**Tác dụng:** Posting movement để cập nhật tồn kho và auto-update related documents

**Authentication:** Required

**Logic tự động:**
- **RECEIPT**: Update PO received qty, auto-complete nếu đủ
- **ISSUE**: Validate against MO material requirements, update issued qty
- **OUT**: Validate against SO breakdown quantities, auto-complete nếu đủ
- **RECEIPT** (Production): Update MO completed qty

**Response:**
```json
{
  "ok": true
}
```

---

## 5. SALES ORDERS API - QUẢN LÝ ĐƠN HÀNG BÁN

### 🎯 **Mục đích sử dụng:**
Quản lý đơn hàng bán, breakdown theo variants, tự động tạo production orders.

### 📋 **Endpoints:**

#### 5.1. GET `/sales-orders` - Danh sách đơn hàng
#### 5.2. POST `/sales-orders` - Tạo đơn hàng mới
#### 5.3. PUT `/sales-orders/:id` - Cập nhật đơn hàng
#### 5.4. POST `/sales-orders/:id/confirm` - Xác nhận đơn hàng
#### 5.5. POST `/sales-orders/:id/create-production-orders` - Tạo MO từ SO
#### 5.6. POST `/sales-orders/:id/cancel` - Hủy đơn hàng

---

## 6. PURCHASE ORDERS API - QUẢN LÝ ĐƠN HÀNG MUA

### 🎯 **Mục đích sử dụng:**
Quản lý đơn hàng mua hàng, theo dõi received quantities.

### 📋 **Endpoints:**

#### 6.1. GET `/purchase-orders` - Danh sách đơn mua
#### 6.2. POST `/purchase-orders` - Tạo đơn mua mới
#### 6.3. PUT `/purchase-orders/:id` - Cập nhật đơn mua
#### 6.4. POST `/purchase-orders/:id/confirm` - Xác nhận đơn mua
#### 6.5. POST `/purchase-orders/:id/receiving` - Chuyển trạng thái receiving
#### 6.6. POST `/purchase-orders/:id/received` - Hoàn thành nhận hàng
#### 6.7. POST `/purchase-orders/:id/cancel` - Hủy đơn mua

---

## 7. ITEMS API - QUẢN LÝ VẬT TƯ

### 🎯 **Mục đích sử dụng:**
Quản lý danh mục vật tư (materials, accessories, etc.)

### 📋 **Endpoints:**

#### 7.1. GET `/items` - Danh sách items
**Query Parameters:**
- `q`: Tìm kiếm theo tên, SKU
- `itemType`: FABRIC, ACCESSORY, PACKING, OTHER
- `isActive`: true/false

#### 7.2. POST `/items` - Tạo item mới
#### 7.3. GET `/items/:id` - Chi tiết item
#### 7.4. PUT `/items/:id` - Cập nhật item
#### 7.5. DELETE `/items/:id` - Xóa item

---

## 🔄 **INTEGRATION FLOW GIỮA CÁC MODULES**

### Scenario 1: Tạo BOM và Production Order
1. **Tạo BOM** → POST `/boms` với lines materials
2. **Explode BOM** → GET `/boms/:id/explode` để xem requirements
3. **Tạo Production Order** → POST `/production-orders`
4. **Auto-generate Materials** → Production order tự động generate từ BOM
5. **Purchase Materials** → Tạo Purchase Order cho materials
6. **Receive Materials** → Stock Move RECEIPT → Update PO status
7. **Issue Materials** → Stock Move ISSUE → Update MO material requirements
8. **Complete Production** → Stock Move RECEIPT (finished goods) → Update MO status

### Scenario 2: Sales Order to Production
1. **Tạo Sales Order** → POST `/sales-orders` với items
2. **Breakdown by Variants** → Thêm breakdowns cho từng variant
3. **Create Production Orders** → POST `/sales-orders/:id/create-production-orders`
4. **Auto-sync Status** → Khi MO complete → SO status tự động update
5. **Deliver Goods** → Stock Move OUT → Validate against SO breakdown

### Scenario 3: Inventory Management
1. **On-hand View** → GET `/inventory/onhand` để xem tồn
2. **Ledger View** → GET `/inventory/ledger` để xem lịch sử
3. **Stock Moves** → Tạo và post movements
4. **Auto-update** → Mọi stock move đều cập nhật on-hand real-time

---

## 🔐 **AUTHENTICATION & SECURITY**

### Bearer Token
Hầu hết POST/PUT/DELETE endpoints yêu cầu authentication:

```javascript
headers: {
  'Authorization': 'Bearer YOUR_TOKEN_HERE',
  'Content-Type': 'application/json'
}
```

### User Management
```javascript
// Login
POST /auth/login
{
  "email": "admin@erp.local",
  "password": "Admin@123"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "admin@erp.local",
    "fullName": "Admin"
  }
}
```

---

## 📊 **ERROR HANDLING**

### Standard Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "qtyPlan": ["Must be greater than 0"]
    }
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR`: Dữ liệu đầu vào không hợp lệ
- `UNAUTHORIZED`: Cần authentication
- `FORBIDDEN`: Không có quyền
- `NOT_FOUND`: Resource không tồn tại
- `CONFLICT`: Conflict với data hiện tại

---

## 🚀 **QUICK START EXAMPLES**

### Example 1: Tạo BOM đơn giản
```javascript
// 1. Tạo BOM
const bom = await fetch('/boms', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer TOKEN', 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: 'BOM-TSH-001',
    productStyleId: '456',
    name: 'T-Shirt BOM',
    lines: [
      { itemId: '789', uom: 'm', qtyPerUnit: 1.5, wastagePercent: 10 }
    ]
  })
});

// 2. Explode BOM
const explosion = await fetch('/boms/123/explode?quantity=100');
const materials = await explosion.json();

// 3. Tạo Production Order
const mo = await fetch('/production-orders', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer TOKEN' },
  body: JSON.stringify({
    productStyleId: '456',
    qtyPlan: 100,
    dueDate: '2024-02-01T17:00:00Z'
  })
});
```

### Example 2: Xem tồn kho
```javascript
// Xem tồn kho
const onhand = await fetch('/inventory/onhand?itemType=MATERIAL');
const data = await onhand.json();

console.log(`Materials: ${data.itemsTotal} types, ${data.variantsTotal} variants`);

// Xem lịch sử
const ledger = await fetch('/inventory/ledger?moveType=RECEIPT&fromDate=2024-01-01');
const movements = await ledger.json();
```

---

## 🎯 **KẾT LUẬN**

Hệ thống API đã được thiết kế toàn diện với:

✅ **Business Logic Hoàn Chỉnh**: Xử lý tất cả scenarios thực tế
✅ **Integration Tự Động**: Các modules tự động sync với nhau
✅ **Validation Chặt Chẽ**: Đảm bảo data integrity
✅ **Error Handling**: Xử lý lỗi professional
✅ **Scalability**: Thiết kế để mở rộng
✅ **Real-time Updates**: Cập nhật real-time cho inventory

**🚀 SẴN SÀNG CHO PRODUCTION DEPLOYMENT!**
