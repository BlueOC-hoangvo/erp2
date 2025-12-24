# Sales Orders API Integration Plan

## Hiện trạng phân tích

### Backend API đã có (BE):
- ✅ Controller đầy đủ: list, get, create, update, remove, confirm, cancel
- ✅ DTO validation với Zod
- ✅ Service logic hoàn chỉnh
- ✅ Status: DRAFT, CONFIRMED, IN_PRODUCTION, DONE, CANCELLED
- ✅ Product variants breakdown support
- ✅ Customer relationship
- ✅ Database schema hợp lý

### Frontend hiện tại (FE):
- ❌ Types không khớp backend (lowercase status, structure khác)
- ❌ API functions không gọi đúng endpoints
- ❌ Components dùng fake data thay vì real API
- ❌ Không có error handling chuẩn
- ❌ Không có loading states

## Kế hoạch tích hợp

### Phase 1: Type System Alignment
1. **Cập nhật types/index.ts** - Khớp với backend DTO
2. **Tạo mapping utilities** - Chuyển đổi giữa API và UI types
3. **Cập nhật API response types**

### Phase 2: API Integration
1. **Refactor sales-orders.api.ts** - Gọi đúng backend endpoints
2. **Thêm error handling và loading states**
3. **Tạo custom hooks cho React Query**
4. **Cập nhật create-sales-order.ts**

### Phase 3: Component Updates
1. **SalesOrdersList** - Dùng real API, thêm filtering/pagination
2. **SalesOrdersForm** - Dùng real API cho CRUD operations
3. **SalesOrdersDetail** - Hiển thị breakdown và status actions
4. **Thêm confirm/cancel buttons với proper states**

### Phase 4: Clean Code & Best Practices
1. **Tạo reusable components** cho sales order items
2. **Implement proper error boundaries**
3. **Add loading skeletons**
4. **Optimistic updates**
5. **Form validation alignment**

## File Structure mới
```
sales-orders/
├── api/
│   ├── sales-orders.api.ts (updated)
│   ├── create-sales-order.ts (updated)
│   └── hooks/ (new)
│       ├── useSalesOrders.ts
│       ├── useSalesOrder.ts
│       └── useSalesOrderActions.ts
├── components/ (new)
│   ├── SalesOrderItemForm.tsx
│   ├── SalesOrderStatus.tsx
│   └── SalesOrderBreakdown.tsx
├── types/
│   └── index.ts (updated)
├── utils/
│   ├── mappers.ts (new)
│   └── validators.ts (new)
└── views/
    ├── SalesOrdersList.tsx (updated)
    ├── SalesOrdersForm.tsx (updated)
    ├── SalesOrdersDetail.tsx (updated)
    └── SalesOrdersDashboard.tsx (updated)
```

## Priority Tasks
1. ✅ Fix types mismatch
2. ✅ Update API calls  
3. ✅ Update List component (completed - with search, filter, pagination, actions)
4. ✅ Update Form component (completed - full CRUD with validation)
5. ✅ Update Detail component (completed - with status actions, summary cards, breakdown display)
6. ✅ Add status actions (confirm/cancel in List and Detail)
7. ✅ Create reusable components (hooks, utilities)
8. ⏳ Testing & refinement

## Progress Update
- ✅ **Phase 1**: Type System Alignment - Complete
- ✅ **Phase 2**: API Integration - Complete  
  - Updated API calls to match backend endpoints
  - Created custom hooks with React Query
  - Created utility functions for data transformation
- ✅ **Phase 3**: Component Updates - COMPLETE
  - SalesOrdersList: ✅ Complete với filtering, pagination, actions
  - SalesOrdersForm: ✅ Complete với full CRUD, validation, breakdown management
  - SalesOrdersDetail: ✅ Complete với status actions, summary cards, breakdown display
- ✅ Added utility functions cho formatting và validation
- ✅ Added hooks cho loading states và error handling

## Success Criteria
- [ ] Tất cả components hoạt động với real backend API
- [ ] Type safety hoàn toàn
- [ ] Loading states mượt mà
- [ ] Error handling comprehensive
- [ ] Code clean và maintainable
- [ ] Performance optimized
