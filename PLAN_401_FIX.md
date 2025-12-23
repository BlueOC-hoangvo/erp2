# Kế hoạch khắc phục lỗi 401 Unauthorized - Phân tích chi tiết

## Nguyên nhân chính có thể gây lỗi 401:

### 1. Backend Server không khởi động thành công
- Port 4000 không được mở
- Database connection failed
- Prisma chưa generate client

### 2. Database issues
- Không có user admin trong database
- Password hashing không match
- User account không active

### 3. Environment configuration
- JWT secrets không match giữa backend và frontend
- API URL không đúng
- CORS issues

### 4. Frontend configuration
- VITE_API_URL không đúng
- Token không được lưu/retrieve đúng cách

## Giải pháp cụ thể:

### Bước 1: Khởi tạo database
```bash
cd be
npx prisma generate
npx prisma db push
node add-demo-data.js
```

### Bước 2: Kiểm tra và cấu hình environment
- Tạo .env file với JWT secrets phù hợp
- Đảm bảo PORT=4000

### Bước 3: Test API trực tiếp
- Test login endpoint với cURL hoặc Postman
- Verify response structure

### Bước 4: Kiểm tra frontend config
- Verify VITE_API_URL trong .env
- Kiểm tra token storage logic

## Files cần kiểm tra và sửa:

1. **be/.env** - Environment variables
2. **be/src/config/env.ts** - Environment config
3. **frontend/.env** - Frontend API URL
4. **frontend/src/lib/api.ts** - API client configuration
5. **Database seed data** - User account creation
