# Kế hoạch Phát triển BOM Module - Logic Nghiệp vụ Sâu

## 📋 Thông tin đã thu thập

### 1. Cấu trúc hiện tại:
- **BOM Model**: Bom (id, code, productStyleId, name, isActive) + BomLine (bomId, itemId, qtyPerUnit, wastagePercent)
- **Tích hợp**: ProductionOrder → MoMaterialRequirement thông qua BOM
- **Chức năng**: CRUD cơ bản, generateMaterialsFromBom
- **Workflow**: SalesOrder → ProductionOrder (auto-generate BOM materials)

### 2. Các module liên quan:
- Items (nguyên liệu/vật tư)
- ProductStyles (sản phẩm)
- ProductionOrders (đơn sản xuất) 
- PurchaseOrders (mua nguyên liệu)
- StockMoves (xuất/nhập kho)
- Warehouses (kho hàng)

## 🎯 Kế hoạch phát triển toàn diện

### Phase 1: Multi-level BOM & Versioning
1. **Multi-level BOM Support**
   - BOM có thể chứa BOM khác (sub-assembly)
   - Recursive BOM explosion
   - BOM depth tracking và validation
   
2. **BOM Versioning System**
   - BomVersion model để track thay đổi
   - Approve/reject workflow
   - Version comparison

3. **Enhanced BOM Service**
   - Explode BOM tree
   - Calculate total requirements
   - BOM validation rules

### Phase 2: Cost Calculation & Planning
4. **Cost Calculation Engine**
   - Material cost from BOM
   - Labor cost integration
   - Overhead allocation
   - Total product cost calculation
   
5. **Lead Time Calculation**
   - Item lead times
   - Production lead times
   - Total production lead time

6. **Alternative Items**
   - Alternative material support
   - Cost comparison
   - Availability checking

### Phase 3: MRP Integration & Planning
7. **MRP (Material Requirements Planning)**
   - BOM explosion cho multiple MOs
   - Net requirements calculation
   - Purchase requisition generation
   
8. **BOM Templates**
   - Common BOM patterns
   - Quick BOM creation
   - Template library

### Phase 4: Advanced Features
9. **BOM Routing & Operations**
   - Production routing
   - Operation times
   - Resource requirements
   
10. **Quality Control Integration**
    - Quality specifications per BOM line
    - Inspection points
    - Quality standards

11. **BOM Reports & Analytics**
    - Cost analysis reports
    - BOM usage statistics
    - Efficiency metrics

### Phase 5: Integration & Workflow
12. **Purchase Order Integration**
    - Auto-create POs from BOM requirements
    - Supplier integration
    - PO status tracking
    
13. **Warehouse Integration**
    - Stock allocation
    - Inventory reservation
    - Stock availability checking

## ✅ Hoàn thành Phase 1 - Database Schema

### ✅ Database Schema Enhanced:
- `be/prisma/schema.prisma` - ✅ Hoàn thành
  - ✅ Enums: BomVersionStatus, BomApprovalStatus
  - ✅ Enhanced BomLine: Multi-level BOM support, hierarchy tracking
  - ✅ BomVersion: Versioning system với approval workflow
  - ✅ BomApproval: Multi-approver support
  - ✅ BomTemplate: Quick BOM creation templates
  - ✅ Enhanced MoMaterialRequirement: Cost calculation, lead time, BOM version tracking

### 🔧 Tiếp theo cần chỉnh sửa

### Core BOM Module:
- `be/src/modules/boms/boms.service.ts` - Enhanced logic (BOM explode, cost calculation, versioning)
- `be/src/modules/boms/boms.controller.ts` - New endpoints (versioning, approval, templates)
- `be/src/modules/boms/boms.dto.ts` - New DTOs (BOM version, approval, templates)

### Integration Modules:
- `be/src/modules/production-orders/productionOrders.service.ts` - Enhanced BOM integration
- `be/src/modules/purchase-orders/` - MRP integration  
- `be/src/modules/inventory/` - Stock integration

### Migration Files:
- Migration file cho new tables

## 📝 Dependent Files sẽ chỉnh sửa

1. **be/prisma/schema.prisma** - Add new models
2. **be/src/modules/boms/boms.service.ts** - Enhanced BOM logic
3. **be/src/modules/production-orders/productionOrders.service.ts** - Better BOM integration
4. **be/src/modules/inventory/inventory.service.ts** - Stock allocation logic
5. **be/src/modules/purchase-orders/purchaseOrders.service.ts** - MRP integration

## 🚀 Next Steps

1. Confirm plan with user
2. Start with Phase 1: Multi-level BOM
3. Implement BOM Versioning
4. Add cost calculation engine
5. Integrate với MRP system
6. Testing và validation

## ⚠️ Considerations

- Backward compatibility với BOM hiện tại
- Performance optimization cho large BOMs
- Data migration strategy
- UI/UX considerations cho complex BOMs
- Security và access control
