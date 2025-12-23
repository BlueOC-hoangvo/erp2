# Kế hoạch khắc phục lỗi 401 Unauthorized khi đăng nhập

## Nguyên nhân có thể:
1. Backend không chạy hoặc cổng không đúng
2. Frontend không kết nối được tới backend (API URL sai)
3. JWT secrets không match
4. Thiếu dữ liệu user trong database
5. Environment variables chưa được cấu hình đúng

## Các bước khắc phục:

### Bước 1: Kiểm tra trạng thái backend
- [x] Kiểm tra backend có đang chạy không ❌ BACKEND KHÔNG CHẠY
- [x] Kiểm tra cổng (port) backend ❌ Không thể kết nối localhost:4000
- [ ] Khởi động backend
- [ ] Test API endpoint `/auth/login` trực tiếp

### Bước 2: Kiểm tra cấu hình frontend
- [ ] Kiểm tra biến môi trường VITE_API_URL
- [ ] Kiểm tra kết nối từ frontend tới backend
- [ ] Xem console logs để debug

### Bước 3: Kiểm tra database
- [ ] Kiểm tra database có user test không
- [ ] Kiểm tra schema database đúng không
- [ ] Chạy seed data nếu cần

### Bước 4: Kiểm tra JWT configuration
- [ ] So sánh JWT secrets giữa frontend và backend
- [ ] Kiểm tra token expiration times
- [ ] Kiểm tra refresh token flow

### Bước 5: Test và verify
- [ ] Test đăng nhập với cURL
- [ ] Test đăng nhập từ UI
- [ ] Kiểm tra tokens được lưu đúng không

## Files quan trọng cần kiểm tra:
- `be/src/config/env.ts` - Backend environment config
- `frontend/src/lib/api.ts` - Frontend API configuration  
- `frontend/src/constant/config.ts` - Frontend constants
- Database schema và seed data
