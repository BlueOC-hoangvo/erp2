
# BOM API Test Results Analysis

## Tổng quan
Dựa trên kết quả test API thực tế từ backend, tôi cần cập nhật BOM types để phản ánh chính xác response structure thực tế.

## Kết quả Test API thực tế

### ✅ **BOM List API** 
```
GET /boms?page=1&pageSize=5
Response: {
  "data": {
    "page": 1,
    "pageSize": 5,
    "total": 5,
    "items": [
      {
        "id": "39",
        "code": "BOM-TEST-AUTH",
        "productStyleId": "1",
        "name": "Test BOM with Auth",
        "isActive": true,
        "createdAt": "2025-12-27T00:29:20.348Z",
        "updatedAt": "2025-12-27T00:29:20.348Z"
      }
    ]
  }
}
```

### ✅ **BOM Get by ID**
```
GET /boms/36
Response: {
  "data": {
    "id": "36",
    "code": "BOM-2",
    "productStyleId": "1",
    "name": "Bomtest",
    "isActive": true,
    "createdAt": "2025-12-26T20:07:00.124Z",
    "updatedAt": "2025-12-26T20:07:00.124Z",
    "note": null,
    "productStyle": {
      "id": "1",
      "code": "TS-002",
      "name": "Test Style"
    }
  }
}
```

### ✅ **BOM Explosion**
```
GET /boms/36/explode?quantity=10
Response: {
  "data": {
    "items": [
      {
        "itemId": "1",
        "itemName": "Vải cotton",
        "sku": null,
        "uom": "m",
        "qtyRequired": 20.4,
        "itemType": "FABRIC"
      }
    ],
    "totalItems": 1,
    "quantity": 10
  }
}
```

### ✅ **BOM Cost**
```
GET /boms/36/cost?quantity=10
Response: {
  "data": {
    "totalMaterialCost": 2039999.9999999998,
    "materialCosts": [
      {
        "itemId": "1",
        "itemName": "Vải cotton",
        "sku": null,
        "uom": "m",
        "qtyRequired": 20.4,
        "itemType": "FABRIC",
        "unitCost": 100000,
        "totalCost": 2039999.9999999998
      }
    ]
  }
}
```

### ✅ **BOM Lead Time**
```
GET /boms/36/lead-time
Response: {
  "data": {
    "maxLeadTime": 3,
    "totalLeadTime": 3,
    "estimatedDays": 3
  }
}
```

### ✅ **Current Version**
```
GET /boms/36/current-version
Response: {
  "data": {
    "message": "No version found for this BOM. This is a basic BOM without versioning.",
    "bom": {
      "id": "36",
      "code": "BOM-2",
      "productStyleId": "1",
      "name": "Bomtest",
      "isActive": true,
      "createdAt": "2025-12-26T20:07:00.124Z",
      "updatedAt": "2025-12-26T20:07:00.124Z"
    }
  }
}
```

### ✅ **Templates**
```
GET /boms/templates
Response: {
  "data": {
    "page": 1,
    "pageSize": 20,
    "total": 4,
    "items": [
      {
        "id": "4",
        "name": "Test Template Auth",
        "code": "TPL-AUTH-001",
        "description": "Test template creation with auth",
        "category": "TEST",
        "isActive": true,
        "templateData": {
          "lines": [...]
        }
      }
    ]
  }
}
```

## Phân tích và Cập nhật cần thiết

### 1. **API Response Wrapper**
Tất cả responses đều có cấu trúc:
```typescript
{
  "data": T,
  "meta": null,
  "error": { message: string, details: any } | null
}
```

### 2. **BOM Explosion Response đơn giản hơn**
- Không có `level`, `calculations`, `summary` như trong tài liệu
- Chỉ có `items`, `totalItems`, `quantity`

### 3. **BOM Cost Response đơn giản hơn**
- Không có `bomId`, `bomVersionId`, `currency`, `costType`, `summary`
- Chỉ có `totalMaterialCost` và `materialCosts`

### 4. **BOM Lead Time Response đơn giản hơn**
- Không có `materialLeadTimes`, `productionSteps`
- Chỉ có `maxLeadTime`, `totalLeadTime`, `estimatedDays`

### 5. **Current Version Response**
- Có thể trả về message khi không có version
- Hoặc trả về version object

### 6. **BOM List/Detail**
- Có thêm field `note` trong BOM detail
- ProductStyle có cấu trúc đơn giản hơn

## Kết luận
API thực tế đơn giản hơn tài liệu. Tôi cần cập nhật types để phản ánh đúng structure thực tế này.

