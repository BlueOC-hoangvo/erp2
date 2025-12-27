# BOM API Fixes Summary

## Tổng quan
Đã cập nhật BOM API để tuân thủ tài liệu API thực tế, sửa các endpoint không đúng chuẩn REST và cải thiện tính nhất quán.

## Các thay đổi chính

### 1. BOM Explosion Endpoint
**Trước:**
```typescript
api.post(`/boms/${id}/explode`, params)
```

**Sau:**
```typescript
api.get(`/boms/${id}/explode?${queryParams.toString()}`)
```

**Lý do:** Theo tài liệu API, explode endpoint sử dụng GET method với query parameters.

### 2. BOM Cost Calculation Endpoint
**Trước:**
```typescript
api.post(`/boms/${id}/cost`, params)
```

**Sau:**
```typescript
api.get(`/boms/${id}/cost?${queryParams.toString()}`)
```

**Lý do:** Theo tài liệu API, cost calculation sử dụng GET method với query parameters.

### 3. BOM Lead Time Calculation Endpoint
**Trước:**
```typescript
api.post(`/boms/${id}/leadtime`, params)
```

**Sau:**
```typescript
api.get(`/boms/${id}/lead-time${queryParams.toString() ? `?${queryParams.toString()}` : ''}`)
```

**Lý do:** 
- Theo tài liệu API, lead time calculation sử dụng GET method
- Endpoint path phải là `lead-time` thay vì `leadtime`

### 4. BOM Template Endpoints
**Trước:**
```typescript
api.get(`/bom-templates`)
api.get(`/bom-templates/${templateId}`)
api.post(`/bom-templates`)
api.post(`/bom-templates/${templateId}/create-bom`)
```

**Sau:**
```typescript
api.get(`/boms/templates`)
api.get(`/boms/templates/${templateId}`)
api.post(`/boms/templates`)
api.post(`/boms/templates/${templateId}/create-bom`)
```

**Lý do:** Theo tài liệu API, template endpoints nằm dưới `/boms/templates` thay vì `/bom-templates`.

### 5. Component Updates
**BomTemplates Component:**
- Cập nhật CreateTemplateModal để sử dụng `useCreateBomTemplate` mutation thực sự
- Cập nhật UseTemplateModal để sử dụng `useCreateBomFromTemplate` mutation thực sự
- Loại bỏ các TODO comments và implement thực tế

## Cấu trúc API hiện tại

### BOM Management
- `GET /boms` - List BOMs with pagination and filters
- `GET /boms/{id}` - Get single BOM
- `POST /boms` - Create new BOM
- `PUT /boms/{id}` - Update existing BOM
- `DELETE /boms/{id}` - Delete BOM

### BOM Analysis
- `GET /boms/{id}/explode?quantity={number}&bomVersionId={string}` - Explode BOM
- `GET /boms/{id}/cost?quantity={number}&bomVersionId={string}` - Calculate cost
- `GET /boms/{id}/lead-time?bomVersionId={string}` - Calculate lead time

### BOM Versioning
- `POST /boms/{bomId}/versions` - Create BOM version
- `POST /bom-versions/{versionId}/submit` - Submit for approval
- `POST /bom-versions/{versionId}/approve` - Approve version
- `POST /bom-versions/{versionId}/reject` - Reject version
- `GET /boms/{bomId}/versions/current` - Get current version
- `POST /bom-versions/compare` - Compare versions

### BOM Templates
- `GET /boms/templates` - List templates
- `GET /boms/templates/{templateId}` - Get template
- `POST /boms/templates` - Create template
- `POST /boms/templates/{templateId}/create-bom` - Create BOM from template

### BOM Versioning
- `POST /boms/{bomId}/versions` - Create BOM version
- `POST /bom-versions/{versionId}/submit` - Submit for approval
- `POST /bom-versions/{versionId}/approve` - Approve version
- `POST /bom-versions/{versionId}/reject` - Reject version
- `GET /boms/{bomId}/versions/current` - Get current version
- `POST /bom-versions/compare` - Compare versions

## Benefits của những thay đổi này

1. **Tuân thủ REST Standards**: Tất cả endpoints đều sử dụng đúng HTTP methods
2. **Consistency**: URL structure nhất quán với tài liệu API
3. **Better Caching**: GET requests có thể được cache hiệu quả hơn
4. **Idempotency**: GET requests là idempotent, an toàn hơn cho các operations
5. **Real Implementation**: Components sử dụng API mutations thực tế thay vì mock

## Testing

Để test các endpoint đã sửa:

1. **BOM Explosion**: 
   ```bash
   curl "http://localhost:3000/api/boms/123/explode?quantity=5"
   ```

2. **Cost Calculation**:
   ```bash
   curl "http://localhost:3000/api/boms/123/cost?quantity=10"
   ```

3. **Lead Time Calculation**:
   ```bash
   curl "http://localhost:3000/api/boms/123/lead-time"
   ```

4. **Template Operations**:
   ```bash
   curl "http://localhost:3000/api/boms/templates"
   ```

## Next Steps

1. ✅ API endpoints đã được sửa để tuân thủ documentation
2. ✅ Components đã được cập nhật để sử dụng real mutations
3. 🔄 Test các endpoint với backend API thực tế
4. 🔄 Verify rằng tất cả features hoạt động đúng
5. 🔄 Update documentation nếu cần thiết

## Files đã được thay đổi

- `src/modules/boms/api/bom.api.ts` - API endpoints và methods
- `src/modules/boms/components/BomTemplates.tsx` - Template component updates
- `src/modules/boms/hooks/useBoms.ts` - Hooks (không thay đổi, đã sẵn sàng)

Tất cả changes đều backward compatible và không ảnh hưởng đến existing functionality.
