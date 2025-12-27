# BOM Frontend Update Plan

## Current Analysis
Đã phân tích các file BOM hiện tại:
- `src/modules/boms/api/bom.api.ts` - API service layer
- `src/modules/boms/hooks/useBoms.ts` - React hooks
- `src/modules/boms/components/BomForm.tsx` - Form component
- `src/modules/boms/types/bom.types.ts` - Type definitions

## Required Updates

### 1. API Service Updates (`bom.api.ts`)
**Issues Found:**
- Response format không match với backend: `{ success: true, data: {...} }`
- API endpoints cần cập nhật theo documentation
- Error handling cần improvement
- Missing template endpoints

**Updates Needed:**
- Update response handling để extract từ `data` field
- Add missing endpoints: templates list, comparison
- Update request/response types
- Add proper error handling cho 400, 404, 409 responses

### 2. Types Updates (`bom.types.ts`)
**Issues Found:**
- Response types cần wrap trong `success: true, data: {...}`
- Missing some types từ API docs
- Update parameter types

**Updates Needed:**
- Wrap response types
- Add missing types: BomVersionComparison, CompareVersionsRequest
- Update existing types theo API spec

### 3. Hooks Updates (`useBoms.ts`)
**Issues Found:**
- Error handling cần cập nhật
- Response data extraction cần fix
- Missing template hooks

**Updates Needed:**
- Update response handling
- Add missing template hooks
- Improve error handling

### 4. Components Updates
**Issues Found:**
- BomForm sử dụng mock data thay vì real API calls
- Missing validation theo API requirements
- Error display cần improvement
- BomComparison component sử dụng `mockComparison` thay vì `comparison` variable

**Updates Needed:**
- Replace mock data với real API calls
- Update validation schema
- Improve error handling và user feedback
- Fix BomComparison component variable references

**Component Fixes Completed:**
- ✅ BomComparison: Sửa tất cả tham chiếu `mockComparison` thành `comparison`
- ✅ BomComparison: Sửa TypeScript errors (loại bỏ tham chiếu `createdAt`, `itemName`, `itemSku`)
- ✅ BomComparison: Sử dụng đúng types từ `bom.types.ts` (BomVersionComparison, BomDifference)

## Implementation Steps
1. ✅ Update API service với correct response handling
2. ✅ Update types definitions
3. ✅ Update hooks với proper error handling
4. ✅ Update components với real API integration
5. ✅ Test integration và fix issues

## Key Changes Summary
- Response format: Extract từ `data` field
- Error handling: Handle 400, 404, 409 specifically
- Template system: Add complete CRUD operations
- Versioning: Add approval workflow
- Cost analysis: Add proper calculation display
- Lead time: Add display formatting

## Success Criteria
- [ ] All API endpoints work correctly
- [ ] Error handling covers all scenarios
- [ ] Components load real data
- [ ] Validation matches API requirements
- [ ] User experience is smooth
