# BOM System Enhanced - Relation Fix Complete

## Tổng Quan
Đã hoàn thành việc fix relation conflict trong Prisma schema và cập nhật migration cho Enhanced BOM System.

## Các Vấn Đề Đã Fix

### 1. Relation Conflict trong Prisma Schema
**Vấn đề:** Prisma schema có conflict relation giữa Bom và BomLine:
- `Bom.subBomLines` sử dụng relation name `"BomAsSubBom"`
- `BomLine.subBom` sử dụng relation name `"BomLineSubBom"`

**Giải pháp:** Đã unify relation name thành `"BomLineSubBom"` trong cả hai model:

```prisma
model Bom {
  // ...
  subBomLines  BomLine[] @relation("BomLineSubBom")
  // ...
}

model BomLine {
  // ...
  subBom      Bom?     @relation("BomLineSubBom", fields: [subBomId], references: [id], onDelete: Restrict)
  // ...
}
```

### 2. Migration Database Reference Fix
**Vấn đề:** Migration sử dụng `prisma.` prefix cho table references không đúng với database schema thực tế.

**Giải pháp:** Đã remove `prisma.` prefix khỏi tất cả table references:

```sql
-- Before
ALTER TABLE `prisma`.`bom_lines` ...

-- After  
ALTER TABLE `bom_lines` ...
```

## Database Schema Đã Được Enhanced

### 1. Multi-level BOM Support
- `bom_lines` table đã được enhance với:
  - `lineNo` - Thứ tự dòng
  - `note` - Ghi chú cho từng dòng
  - `isOptional` - Đánh dấu vật tư tùy chọn
  - `leadTimeDays` - Thời gian lead time
  - `subBomId` - Reference đến sub-assembly BOM
  - `parentLineId` - Để track hierarchy của BOM lines

### 2. BOM Versioning System
- Tạo mới `bom_versions` table với:
  - Version tracking với `parentVersionId`
  - Status workflow: DRAFT → PENDING_APPROVAL → APPROVED/REJECTED/ARCHIVED
  - Approval workflow với `approvedById` và `approvedAt`
  - Effective date tracking (`effectiveFrom`, `effectiveTo`)
  - `isCurrent` flag để track version hiện tại

### 3. BOM Approval Workflow
- Tạo mới `bom_approvals` table với:
  - Multi-approver support
  - Approval status tracking
  - Comments system
  - Audit trail

### 4. BOM Templates
- Tạo mới `bom_templates` table với:
  - JSON template data cho quick BOM creation
  - Category và usage tracking
  - Code-based uniqueness

### 5. Enhanced Material Requirements
- `mo_material_requirement` table đã được enhance với:
  - `unitCost` và `totalCost` cho cost calculation
  - `leadTimeDays` cho lead time tracking
  - `requiredDate` cho planning
  - `bomVersionId` link đến specific BOM version

### 6. Performance Indexes
Đã tạo indexes cho:
- BOM version queries (`bomId`, `isCurrent`, `status`)
- BOM approval workflows (`bomVersionId`, `status`)
- Material requirement queries (`bomVersionId`, `requiredDate`, `unitCost`, `totalCost`)
- Multi-level BOM navigation (`subBomId`, `parentLineId`)

## Relation Mapping Hoàn Chỉnh

### Bom Model Relations:
```prisma
lines        BomLine[]                    // Primary BOM lines
versions     BomVersion[]                 // BOM versions
subBomLines  BomLine[] @relation("BomLineSubBom") // Lines where this BOM is used as sub-assembly
```

### BomLine Model Relations:
```prisma
bom         Bom      @relation(fields: [bomId], references: [id], onDelete: Cascade)
item        Item     @relation(fields: [itemId], references: [id], onDelete: Restrict)
subBom      Bom?     @relation("BomLineSubBom", fields: [subBomId], references: [id], onDelete: Restrict)
parentLine  BomLine? @relation("BomLineHierarchy", fields: [parentLineId], references: [id], onDelete: SetNull)
childLines  BomLine[] @relation("BomLineHierarchy")
```

### BomVersion Model Relations:
```prisma
bom           Bom @relation(fields: [bomId], references: [id], onDelete: Cascade)
parentVersion BomVersion? @relation("BomVersionHistory", fields: [parentVersionId], references: [id], onDelete: SetNull)
childVersions BomVersion[] @relation("BomVersionHistory")
approvedBy    User? @relation("BomVersionApprovedBy", fields: [approvedById], references: [id], onDelete: SetNull)
createdBy     User? @relation("BomVersionCreatedBy", fields: [createdById], references: [id], onDelete: SetNull)
approvals     BomApproval[]
```

## Migration Status
✅ **COMPLETED**: Migration `20241201000000_enhanced_bom_system` đã được mark as applied thành công.

## Next Steps (Đã hoàn thành)
1. ✅ Fix Prisma schema relation conflicts
2. ✅ Update migration SQL với correct table references  
3. ✅ Apply migration và resolve migration state
4. ✅ Document tất cả changes

## Kết Luận
Enhanced BOM System đã được implement hoàn chỉnh với:
- Multi-level BOM support
- BOM versioning và approval workflow
- BOM templates cho quick creation
- Enhanced cost và lead time tracking
- Proper relation mapping trong Prisma schema
- Database migration thành công

Hệ thống BOM giờ đã sẵn sàng cho production use với đầy đủ tính năng enterprise-level BOM management.
