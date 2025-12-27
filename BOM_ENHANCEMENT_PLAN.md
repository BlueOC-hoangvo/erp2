# BOM System Enhancement Plan

## Mục tiêu
Hoàn thiện hệ thống BOM (Bill of Materials) để đạt 100% tính năng với đầy đủ API backend và giao diện frontend hoàn chỉnh.

## Tình trạng hiện tại
- **Backend**: 100% hoàn thành (API đầy đủ, validation, business logic)
- **Frontend Core**: 80% hoàn thành (types, API client, hooks, BomList, BomTemplates cơ bản)
- **Frontend UI Components**: 40% hoàn thành (thiếu các component quan trọng)

## Kế hoạch thực hiện

### Phase 1: Core UI Components (Ưu tiên Cao - 2-3 tuần)
**Mục tiêu**: Tạo đầy đủ giao diện cơ bản để người dùng có thể quản lý BOM

#### 1.1 BomForm Component
**File cần tạo**: `frontend/src/modules/boms/components/BomForm.tsx`
- [ ] Form tạo BOM mới với validation
- [ ] Form chỉnh sửa BOM existing
- [ ] Dynamic BOM lines (thêm/xóa/sửa line items)
- [ ] Item selection với autocomplete/search
- [ ] UOM selection (đơn vị đo)
- [ ] Wastage percentage input
- [ ] Lead time days input
- [ ] Optional line marking
- [ ] Form validation với Zod schema
- [ ] Error handling và user feedback
- [ ] Success/loading states

#### 1.2 BomDetail Component
**File cần tạo**: `frontend/src/modules/boms/components/BomDetail.tsx`
- [ ] Hiển thị chi tiết BOM (header + lines)
- [ ] Thông tin BOM (code, name, product style, status)
- [ ] BOM line items table với inline editing
- [ ] Quick actions (Edit, Version, Explode, Cost Analysis)
- [ ] Navigation breadcrumbs
- [ ] Print/export functionality
- [ ] Related BOMs display

#### 1.3 BomRoutes Configuration
**File cần tạo**: `frontend/src/modules/boms/bom.routes.tsx`
- [ ] React Router configuration cho BOM module
- [ ] Routes: /boms, /boms/create, /boms/:id, /boms/:id/edit
- [ ] Route protection và permissions
- [ ] Layout component cho BOM pages

### Phase 2: Enhanced Features (Ưu tiên Trung bình - 2 tuần)
**Mục tiêu**: Thêm các tính năng nâng cao và visualization

#### 2.1 BomExplosion Component
**File cần tạo**: `frontend/src/modules/boms/components/BomExplosion.tsx`
- [ ] Multi-level BOM tree visualization
- [ ] Expandable/collapsible tree structure
- [ ] Quantity calculator với wastage
- [ ] Material requirements breakdown
- [ ] Export to Excel/PDF functionality
- [ ] Interactive quantity input
- [ ] Color-coded hierarchy levels

#### 2.2 BomCostAnalysis Component
**File cần tạo**: `frontend/src/modules/boms/components/BomCostAnalysis.tsx`
- [ ] Cost breakdown visualization
- [ ] Material costs table
- [ ] Total cost calculation
- [ ] Cost per unit display
- [ ] Wastage cost calculation
- [ ] Charts/graphs for cost distribution
- [ ] Export cost analysis report

#### 2.3 BomVersion Component
**File cần tạo**: `frontend/src/modules/boms/components/BomVersion.tsx`
- [ ] Version history list
- [ ] Current version highlight
- [ ] Create new version form
- [ ] Submit for approval workflow
- [ ] Approve/Reject interface
- [ ] Version comparison navigation
- [ ] Approval status display

### Phase 3: Advanced Features (Ưu tiên Thấp - 1-2 tuần)
**Mục tiêu**: Hoàn thiện các tính năng nâng cao

#### 3.1 BomComparison Component
**File cần tạo**: `frontend/src/modules/boms/components/BomComparison.tsx`
- [ ] Side-by-side version comparison
- [ ] Change highlighting (added/removed/modified)
- [ ] Line-by-line diff view
- [ ] Impact analysis summary
- [ ] Export comparison report

#### 3.2 Template Enhancement
**Cập nhật**: `frontend/src/modules/boms/components/BomTemplates.tsx`
- [ ] Create template from existing BOM
- [ ] Template preview functionality
- [ ] Template categories management
- [ ] Usage analytics dashboard
- [ ] Template import/export

### Phase 4: Business Logic Completion (Ưu tiên Cao - 1 tuần)
**Mục tiêu**: Hoàn thiện các tính toán và logic nghiệp vụ

#### 4.1 Complete Cost Calculation
**Cập nhật**: `be/src/modules/boms/boms.service.ts`
- [ ] Implement `getItemUnitCost` method
- [ ] Material cost lookup logic
- [ ] Labor cost calculation
- [ ] Overhead allocation
- [ ] Cost history tracking

#### 4.2 Enhanced BOM Explosion
**Cập nhật**: `be/src/modules/boms/boms.service.ts`
- [ ] Circular reference detection
- [ ] Performance optimization for large BOMs
- [ ] Parallel processing for complex BOMs
- [ ] Memory usage optimization

#### 4.3 Advanced Filtering & Search
**Cập nhật**: `frontend/src/modules/boms/components/BomList.tsx`
- [ ] Date range filters
- [ ] Product style filters
- [ ] Advanced search (multiple fields)
- [ ] Bulk operations
- [ ] Export filtered results

## Chi tiết kỹ thuật

### File Structure cần tạo/cập nhật

#### Frontend Components mới
```
frontend/src/modules/boms/components/
├── BomForm.tsx              [MỚI] - Create/Edit form
├── BomDetail.tsx            [MỚI] - Detail view
├── BomExplosion.tsx         [MỚI] - Multi-level breakdown
├── BomCostAnalysis.tsx      [MỚI] - Cost visualization
├── BomVersion.tsx           [MỚI] - Version management
├── BomComparison.tsx        [MỚI] - Version comparison
├── bom.routes.tsx           [MỚI] - React Router config
└── index.ts                 [CẬP NHẬT] - Export all components
```

#### Backend enhancements
```
be/src/modules/boms/
├── boms.service.ts          [CẬP NHẬT] - Complete cost logic
├── boms.controller.ts       [CẬP NHẬT] - Add new endpoints if needed
├── boms.routes.ts           [CẬP NHẬT] - Add comparison routes
└── boms.dto.ts              [CẬP NHẬT] - Add comparison DTOs
```

### Dependencies cần cài đặt
```bash
# Frontend
npm install @heroicons/react react-hot-toast react-router-dom

# Charts for cost analysis (optional)
npm install recharts chart.js react-chartjs-2

# Export functionality (optional)
npm install xlsx jspdf jspdf-autotable
```

### Database considerations
- ✅ Tables đã có sẵn và hoàn chỉnh
- ✅ Indexes đã được tạo cho performance
- ✅ Foreign key constraints đã được thiết lập
- ✅ Migration files đã có

### Testing Strategy
- [ ] Unit tests cho service methods
- [ ] Integration tests cho API endpoints
- [ ] Component tests cho UI components
- [ ] E2E tests cho user workflows

## Thời gian ước tính
- **Phase 1**: 15-20 giờ (Core UI)
- **Phase 2**: 12-16 giờ (Enhanced Features)
- **Phase 3**: 8-12 giờ (Advanced Features)
- **Phase 4**: 6-8 giờ (Business Logic)
- **Testing & Polish**: 6-10 giờ

**Tổng cộng**: 47-66 giờ (khoảng 6-8 tuần làm việc part-time)

## Success Criteria
- [ ] Người dùng có thể tạo, chỉnh sửa, xóa BOM
- [ ] Hiển thị BOM explosion với multi-level breakdown
- [ ] Cost analysis hoạt động chính xác
- [ ] Version control và approval workflow hoàn chỉnh
- [ ] Template system hoạt động end-to-end
- [ ] Export functionality cho các báo cáo
- [ ] Performance tốt với BOMs có nhiều line items

## Risk Mitigation
- **Technical Risk**: Start với core UI components trước
- **Performance Risk**: Implement pagination và lazy loading
- **User Experience Risk**: Continuous testing với end users
- **Integration Risk**: Thorough API testing

---
*Kế hoạch này sẽ được cập nhật theo tiến độ thực tế*
