# BOM API - Real API Implementation Summary

## Thay đổi quan trọng
- **Trước**: Sử dụng mock data và local variables (`mockBoms`, `mockTemplates`)
- **Sau**: Kết nối trực tiếp với API server thông qua axios

## API Endpoints được implement

### BOM Operations
- `GET /boms` - List BOMS với pagination và filters
- `GET /boms/:id` - Get single BOM
- `POST /boms` - Create new BOM
- `PUT /boms/:id` - Update BOM
- `DELETE /boms/:id` - Delete BOM

### BOM Enhanced Features
- `POST /boms/:id/explode` - Explode BOM (multi-level materials)
- `POST /boms/:id/cost` - Calculate BOM cost analysis
- `POST /boms/:id/leadtime` - Calculate BOM lead time

### BOM Versioning
- `POST /boms/:bomId/versions` - Create new version
- `POST /bom-versions/:versionId/submit` - Submit for approval
- `POST /bom-versions/:versionId/approve` - Approve version
- `POST /bom-versions/:versionId/reject` - Reject version
- `GET /boms/:bomId/versions/current` - Get current version
- `POST /bom-versions/compare` - Compare two versions

### BOM Templates
- `GET /bom-templates` - List templates với pagination và search
- `GET /bom-templates/:id` - Get single template
- `POST /bom-templates` - Create new template
- `POST /bom-templates/:id/create-bom` - Create BOM from template

## Key Features

### 1. Error Handling
- Sử dụng `unwrap()` function để handle API responses
- Proper error handling với try-catch và axios interceptors
- Console logging cho debugging

### 2. Request Parameters
- Pagination support (page, pageSize)
- Search filters (q, productStyleId, isActive)
- Version-specific operations (bomVersionId)

### 3. Response Formatting
- Consistent response structure
- Proper data mapping từ API response
- Fallback values cho missing data

### 4. Authentication
- Automatic token handling qua axios interceptors
- Automatic token refresh khi expired

## Implementation Notes

### Before (Mock)
```typescript
const mockTemplates: BomTemplate[] = [
  { id: '1', name: 'Template 1', ... }
];

const listTemplates = async () => {
  await delay(500);
  return { items: mockTemplates, ... };
};
```

### After (Real API)
```typescript
const listTemplates = async (params) => {
  const queryParams = new URLSearchParams();
  if (params?.q) queryParams.append('q', params.q);
  // ...
  
  const response = await unwrap(
    api.get(`/bom-templates?${queryParams.toString()}`)
  );
  
  return {
    items: response.data.items || [],
    page: response.data.page || 1,
    // ...
  };
};
```

## Testing
- Ứng dụng vẫn chạy trên port 5175
- API calls sẽ gửi đến endpoint được cấu hình trong `VITE_API_URL`
- Console logs giúp debug API requests/responses

## Kết quả
BOM API giờ đây sử dụng real HTTP requests thay vì mock data, đảm bảo tính chính xác của dữ liệu API trả về.
