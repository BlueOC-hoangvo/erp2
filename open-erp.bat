@echo off
echo 🚀 ERP System Access Script
echo ============================
echo.
echo ✅ Frontend: Running at http://localhost:5173/
echo ✅ Backend: Running at http://localhost:4000/
echo.
echo 🔐 Login Credentials:
echo    📧 Email: admin@erp.local
echo    🔑 Password: Admin@123
echo.
echo 📋 Available Features:
echo    • Dashboard - Homepage
echo    • Products - Quản lý sản phẩm (5 mẫu)
echo    • Customers - Quản lý khách hàng
echo    • Audit Logs - Nhật ký hệ thống
echo    • Status - Quản lý trạng thái
echo.
echo 🖥️  How to access:
echo    1. Open your browser
echo    2. Go to: http://localhost:5173/
echo    3. Login with the credentials above
echo    4. Explore the ERP features!
echo.
echo 📱 Sample Data Ready:
echo    • Products: Dell Latitude, MacBook Pro, iPhone 14, Samsung S23, iPad Air
echo    • Customers: 5 companies with complete info
echo.
echo Press any key to open the website...
pause > nul
start http://localhost:5173/

