# Kế hoạch tích hợp API đầy đủ cho Frontend

## Mục tiêu: Thay thế tất cả fake data bằng real API calls

## Backend API Endpoints đã có:
- Authentication: `/auth/login`, `/auth/logout`, `/auth/refresh`, `/me`
- Users: `/users/*`
- Roles: `/roles/*`
- Permissions: `/permissions/*`
- Customers: `/customers/*`
- Suppliers: `/suppliers/*`
- Items: `/items/*`
- Product Styles: `/product-styles/*`
- Sizes: `/sizes/*`
- Colors: `/colors/*`
- Product Variants: `/product-variants/*`
- Locations: `/locations/*`
- Stock Moves: `/stock-moves/*`
- Warehouses: `/warehouses/*`
- Inventory: `/inventory/*`
- Sales Orders: `/sales-orders/*`
- Purchase Orders: `/purchase-orders/*`
- Production Orders: `/production-orders/*`
- BOMs: `/boms/*`

## Công việc cần làm:

### 1. Tạo API Service Files ✅ HOÀN THÀNH
- [x] Tạo API files cho tất cả modules còn thiếu
- [x] Đảm bảo tất cả có type safety với TypeScript

**Đã hoàn thành:**
- Authentication API (có sẵn)
- Suppliers API ✅
- Users API ✅
- Roles API ✅
- Permissions API ✅
- Items API ✅
- Product Styles API ✅
- Sizes API ✅
- Colors API ✅
- Product Variants API ✅
- Locations API ✅
- Warehouses API ✅
- Inventory API ✅
- Stock Moves API ✅
- Sales Orders API ✅
- Purchase Orders API ✅
- Production Orders API ✅
- BOMs API ✅

### 2. Thay thế Fake Data Stores
- [ ] Customers: Thay thế localStorage bằng API calls
- [ ] Các modules khác đang dùng fake data

### 3. Cập nhật Frontend Components
- [ ] Cập nhật stores để sử dụng APIs
- [ ] Cập nhật components để load data từ APIs
- [ ] Setup React Query cho caching

### 4. Tạo API Index & Documentation ✅ HOÀN THÀNH
- [x] Tạo file `/lib/api-services.ts` để export tất cả APIs
- [x] Tạo file `/lib/api-examples.ts` với hướng dẫn sử dụng và ví dụ
- [x] Cung cấp custom hooks examples với React Query

### 5. Testing
- [ ] Test tất cả API connections
- [ ] Đảm bảo error handling tốt

## Module ưu tiên:
1. Customers (đã có API file)
2. Users & Authentication  
3. Products & Inventory
4. Orders (Sales, Purchase, Production)
5. Các modules còn lại
