# Sales Orders 403 Forbidden Error Fix Plan

## Problem Analysis
The error occurs because the user doesn't have the required `sales_order_read` permission to access the sales orders endpoint.

**Error Flow:**
1. Frontend makes GET request to `/sales-orders` 
2. Backend checks authentication via `auth` middleware
3. Backend checks permissions via `permit("sales_order_read")` middleware
4. Permission check fails → Returns 403 Forbidden

## Root Causes
1. **Missing Permission Definition**: The `sales_order_read` permission might not exist in the database
2. **Missing Role Assignment**: User might not have any roles with this permission
3. **Missing User-Role Mapping**: User might not be assigned to any roles

## Solution Plan

### Step 1: Database Investigation
- Check if `sales_order_read` permission exists
- Check what roles have this permission
- Check if current user has any roles assigned

### Step 2: Create/Fix Permissions
- Ensure all sales-related permissions are defined
- Create a default admin role with all sales permissions
- Assign sales permissions to appropriate roles

### Step 3: User Role Assignment
- Create or assign a role with sales permissions to the current user
- Verify the user can access sales orders

### Step 4: Test and Verify
- Test the sales orders endpoint
- Verify no 403 errors occur

## Files to Create/Modify
1. `fix-sales-permissions.js` - Script to fix permissions
2. Test API endpoint access

## Expected Outcome
- User can access sales orders without 403 errors
- Proper RBAC (Role-Based Access Control) is maintained
- System remains secure
