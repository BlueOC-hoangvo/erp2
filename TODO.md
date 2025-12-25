# TODO: Hoàn thiện Module Sản xuất ERP

## 🎯 Mục tiêu
Tạo hệ thống sản xuất hoàn chỉnh, chuẩn nghiệp vụ ERP với đầy đủ tính năng và logic kinh doanh.

## 📋 Kế hoạch thực hiện

### 1. 🔧 Sửa API tạo MO từ Sales Order
- [ ] Thêm validation: thông báo khi chưa có breakdowns
- [ ] Option chọn: tạo MO với qtyTotal hoặc yêu cầu nhập breakdowns
- [ ] UI feedback cho người dùng

### 2. 📅 Quản lý Timeline sản xuất
- [ ] **Start Date**: Ngày bắt đầu sản xuất
- [ ] **End Date**: Ngày hoàn thành sản xuất (auto-set khi DONE)
- [ ] **Due Date**: Ngày hạn chót giao hàng
- [ ] **Lead Time**: Thời gian sản xuất dự kiến

### 3. 📊 Tracking & Monitoring
- [ ] **Progress Tracking**: Theo dõi tiến độ sản xuất real-time
- [ ] **WIP (Work In Progress)**: Quản lý sản phẩm đang sản xuất
- [ ] **Yield/Scrap**: Tỷ lệ thành phẩm và phế phẩm
- [ ] **Efficiency Metrics**: Chỉ số hiệu suất sản xuất

### 4. 🏭 Quản lý Tài nguyên
- [ ] **Work Centers**: Trung tâm sản xuất/máy móc
- [ ] **Labor Resources**: Nhân công theo ca/kỹ năng
- [ ] **Machine Capacity**: Năng suất máy móc
- [ ] **Resource Scheduling**: Lập lịch tài nguyên

### 5. 📦 Material Management
- [ ] **MRP (Material Requirements Planning)**: Lập kế hoạch nguyên liệu
- [ ] **Material Allocation**: Cấp phát nguyên liệu cho MO
- [ ] **Material Issues**: Xuất kho nguyên liệu
- [ ] **Material Returns**: Trả nguyên liệu dư
- [ ] **Substitute Materials**: Nguyên liệu thay thế

### 6. 🔄 Production Workflow
- [ ] **Routing/Operations**: Quy trình sản xuất từng bước
- [ ] **Operation Sequences**: Thứ tự thực hiện các công đoạn
- [ ] **Operation Times**: Thời gian thực hiện từng công đoạn
- [ ] **Quality Checks**: Kiểm tra chất lượng giữa chừng

### 7. 📋 Production Reports
- [ ] **Daily Production Report**: Báo cáo sản xuất hàng ngày
- [ ] **OEE Report**: Overall Equipment Effectiveness
- [ ] **Cost Analysis**: Phân tích chi phí sản xuất
- [ ] **Capacity Utilization**: Tỷ lệ sử dụng năng suất

### 8. 🎯 Advanced Features
- [ ] **Capacity Planning**: Lập kế hoạch năng suất
- [ ] **Preventive Maintenance**: Bảo trì phòng ngừa
- [ ] **Quality Management**: Quản lý chất lượng
- [ ] **Shop Floor Control**: Điều hành sàn nhà máy

### 9. 🔗 Integration
- [ ] **Sales Order Integration**: Tích hợp đơn hàng bán
- [ ] **Purchase Order Integration**: Tích hợp đơn mua hàng
- [ ] **Warehouse Integration**: Tích hợp kho hàng
- [ ] **Financial Integration**: Tích hợp kế toán

### 10. 📱 UI/UX Improvements
- [ ] **Production Dashboard**: Bảng điều khiển sản xuất
- [ ] **Kanban View**: Giao diện Kanban cho MO
- [ ] **Calendar View**: Lịch sản xuất
- [ ] **Mobile Support**: Hỗ trợ mobile

## 🚀 Priority Order

### Phase 1: Core Fixes (Tuần này)
1. ✅ Fix API tạo MO với validation breakdowns
2. ✅ Thêm End Date khi hoàn thành MO (auto-set ngày DONE)
3. ✅ Basic timeline management (auto-set startDate, validate timeline logic)

### Phase 2: Production Control (Tuần tới)  
1. Progress tracking
2. Material management
3. Basic reporting

### Phase 3: Advanced Features (Tháng này)
1. Resource management
2. Workflow optimization
3. Integration với modules khác

## 💡 Technical Notes
- Sử dụng Prisma Decimal cho số lượng
- Implement audit trail cho tất cả changes
- Real-time notifications cho critical events
- Role-based access control cho từng tính năng
- API versioning cho backward compatibility

## 🎯 Success Criteria
- ✅ Tạo MO từ SO với proper validation
- ✅ Tracking đầy đủ lifecycle MO
- ✅ Material requirements được quản lý chặt chẽ
- ✅ Reports chính xác và kịp thời
- ✅ Integration seamless với các modules khác
- ✅ UI/UX intuitive và efficient
