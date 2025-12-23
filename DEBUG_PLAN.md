# KẾ HOẠCH DEBUG VÀ SỬA LỖI

## VẤN ĐỀ ĐÃ XÁC ĐỊNH:

### 1. Tại sao API sản phẩm thành công nhưng không hiển thị?
**Nguyên nhân có thể:**
- Permissions không được load đúng sau khi login
- React Query cache issue 
- API response format không đúng expectations
- Frontend không handle error cases

### 2. Tại sao tab Sales không hiện?
**Nguyên nhân chính:**
- Menu được filter theo permissions từ backend
- Permissions có thể không được load đúng hoặc missing
- Auth store hydrateMe() gọi /me/permissions nhưng có thể fail

## KẾ HOẠCH SỬA LỖI:

### BƯỚC 1: Kiểm tra và sửa permissions system
1. Kiểm tra MeService.getPermissions() có hoạt động đúng không
2. Kiểm tra ACL system trong backend
3. Fix permissions loading trong frontend

### BƯỚC 2: Debug API products
1. Thêm logging để xem API response thực tế
2. Kiểm tra data format trả về
3. Fix frontend error handling

### BƯỚC 3: Test và verify
1. Test với user có đầy đủ permissions
2. Verify menu hiển thị đúng
3. Verify data hiển thị đúng

## CÁC FILE CẦN SỬA:
- `be/src/modules/me/me.service.ts` - Fix permissions logic
- `be/src/common/acl.ts` - Kiểm tra ACL implementation  
- `frontend/src/modules/auth/store/auth.store.ts` - Fix permissions loading
- `frontend/src/modules/products/views/Products.tsx` - Thêm error handling
- Thêm debug logging để track issues
