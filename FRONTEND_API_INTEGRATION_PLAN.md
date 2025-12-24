# Kế hoạch tích hợp API cho Frontend

## Tình trạng hiện tại

### ✅ Đã tích hợp API:
- **Customers**: Đã tích hợp hoàn chỉnh với React Query
- **Authentication**: Hoạt động tốt

### ❌ Vẫn đang dùng Fake Data:
1. **warehouse-products**: fake/warehouse-products.store.ts
2. **warehouse-out**: fake/warehouse-out.store.ts  
3. **warehouse-in**: fake/warehouse-in.store.ts
4. **sales-orders**: fake/sales-orders.store.ts
5. **quotations**: fake/quotations.store.ts
6. **production-resources**: fake/production-resources.store.ts
7. **purchasing**: fake/purchasing.store.ts
8. **production-plans**: fake/production-plans.store.ts
9. **production-params**: fake/production-params.store.ts
10. **production-orders**: fake/production-orders.store.ts
11. **campaigns**: fake/campaign.store.ts
12. **accounting**: fake/accounting.store.ts
13. **customers**: fake/ (customer-handbook, customer-contacts, customer-notes)

## Kế hoạch thực hiện

### Phase 1: Users & Management (Ưu tiên cao)
1. **Users Module** - Quản lý người dùng
2. **Roles & Permissions** - Phân quyền
3. **Me Module** - Thông tin cá nhân

### Phase 2: Core Business (Ưu tiên trung bình)
1. **Suppliers** - Nhà cung cấp
2. **Items/Products** - Sản phẩm/Hàng hóa
3. **Inventory** - Kho hàng
4. **Warehouses** - Khu vực kho

### Phase 3: Sales & Purchasing (Ưu tiên cao)
1. **Sales Orders** - Đơn hàng bán
2. **Purchase Orders** - Đơn hàng mua
3. **Quotations** - Báo giá

### Phase 4: Production (Ưu tiên trung bình)
1. **Production Orders** - Lệnh sản xuất
2. **Production Plans** - Kế hoạch sản xuất
3. **Production Params** - Tham số sản xuất
4. **Production Resources** - Tài nguyên sản xuất

### Phase 5: Advanced Features (Ưu tiên thấp)
1. **Campaigns** - Chiến dịch
2. **Accounting** - Kế toán
3. **Customer Enhancement** - Customer handbook, contacts, notes

## Quy trình tích hợp cho mỗi module

### Bước 1: Kiểm tra API Backend
- Verify API endpoints có tồn tại và hoạt động
- Kiểm tra data structure và types

### Bước 2: Tạo/Cập nhật API Services
- Sử dụng existing API files từ `/api-services.ts`
- Hoặc tạo mới nếu chưa có

### Bước 3: Tạo React Query Hooks
```typescript
// Ví dụ structure
export const useCustomers = (params: CustomerQuery) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => getCustomers(params),
  });
};
```

### Bước 4: Cập nhật Components
- Thay thế fake store calls bằng React Query hooks
- Cập nhật loading/error states
- Setup optimistic updates nếu cần

### Bước 5: Testing
- Test CRUD operations
- Test error handling
- Test pagination/filtering

## Cấu trúc React Query Hooks chuẩn

```typescript
// List with pagination
export const useListCustomers = (params: CustomerQuery) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => api.getCustomers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Single item
export const useCustomer = (id: string | number) => {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: () => api.getCustomer(id),
    enabled: !!id,
  });
};

// Mutations
export const useCreateCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createCustomer,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};
```

## Tài nguyên sẵn có

### API Services đã tạo
- `/lib/api-services.ts` - Export tất cả API functions
- `/lib/api-examples.ts` - Ví dụ sử dụng

### Backend Endpoints
- Customers: `/customers/*`
- Suppliers: `/suppliers/*`
- Items: `/items/*`
- Product Styles: `/product-styles/*`
- Sizes: `/sizes/*`
- Colors: `/colors/*`
- Product Variants: `/product-variants/*`
- Locations: `/locations/*`
- Warehouses: `/warehouses/*`
- Inventory: `/inventory/*`
- Stock Moves: `/stock-moves/*`
- Sales Orders: `/sales-orders/*`
- Purchase Orders: `/purchase-orders/*`
- Production Orders: `/production-orders/*`
- BOMs: `/boms/*`

## Bắt đầu với Phase 1: Users Module

