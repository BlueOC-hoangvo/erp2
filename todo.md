# Fix Campaign Errors - TODO

## Issues Found:

### 1. ROI Calculation Issues

- **Problem**: ROI calculation is inconsistent across campaign views and has potential division by zero errors
- **Impact**: Inaccurate ROI display and potential Infinity/NaN values
- **Files**:
  - `frontend/src/modules/campaigns/views/CampaignsList.tsx` (line 67)
  - `frontend/src/modules/campaigns/views/CampaignForm.tsx` (lines 75-80)
  - `frontend/src/modules/campaigns/views/CampaignDetail.tsx` (lines 43-44)

### 2. Potential Division by Zero

- **Problem**: No proper handling when cost = 0 in ROI calculations
- **Impact**: Can cause Infinity or NaN results

### 3. Inconsistent Error Handling

- **Problem**: No validation for negative values in cost/revenue fields
- **Impact**: Can display negative ROI which doesn't make business sense

### 4. QuotationDetail.tsx Duplicate Button Issue

- **Problem**: Two "Tạo đơn hàng" buttons with different functionality, causing UI confusion
- **Impact**: Poor user experience and potential for errors
- **File**: `frontend/src/modules/quotations/views/QuotationDetail.tsx`

## Plan:

### Step 1: Create ROI Calculation Utility ✅

- ✅ Create a utility function for consistent ROI calculation
- ✅ Handle edge cases (cost = 0, negative values)
- ✅ Ensure consistent formatting

### Step 2: Update CampaignsList.tsx ✅

- ✅ Replace inline ROI calculation with utility function
- ✅ Add proper error handling
- ✅ Create missing campaign.store.ts file

### Step 3: Update CampaignForm.tsx ✅

- ✅ Fix ROI calculation logic
- ✅ Update profit calculation
- ✅ Replace inline calculation with utility functions

### Step 4: Update CampaignDetail.tsx ✅

- ✅ Replace inline calculation with utility function
- ✅ Ensure consistency with other views

### Step 5: Add Input Validation ✅

- ✅ Prevent negative cost/revenue values (added min="0" and Math.max validation)
- ✅ Add proper client-side validation for input fields

### Step 6: Fix QuotationDetail.tsx ✅

- ✅ Removed duplicate "Tạo đơn hàng" button
- ✅ Retained functional button with proper sales order creation logic

### Step 7: Test the fixes ✅

- ✅ All ROI calculations now use consistent utility functions
- ✅ Edge cases (cost = 0) handled properly in utility functions
- ✅ Input validation prevents negative values
- ✅ All TypeScript errors resolved
- ✅ All files updated and working correctly
- ✅ QuotationDetail UI improved with single functional button

## Expected Outcome:

- Consistent and accurate ROI calculations across all campaign views
- Proper handling of edge cases
- Better user experience with input validation
- Maintainable code with reusable utility functions
- Clean UI in QuotationDetail with single functional button for creating sales orders

## Summary of Changes Made:

1. **Created ROI utility functions** in `frontend/src/modules/campaigns/utils/roi.ts`
2. **Updated CampaignsList.tsx** to use ROI utilities
3. **Updated CampaignForm.tsx** with ROI utilities and input validation
4. **Updated CampaignDetail.tsx** with ROI utilities
5. **Fixed QuotationDetail.tsx** by removing duplicate button
6. **Added input validation** for cost/revenue fields
7. **Ensured consistent error handling** across all components
