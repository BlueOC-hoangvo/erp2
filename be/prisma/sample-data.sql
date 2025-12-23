-- Sample Products Data for ERP System
INSERT INTO Product (sku, name, unit, length, width, height, weight, standardCost, salePrice, safetyStock, status, createdAt, updatedAt) VALUES
('LAP001', 'Laptop Dell Latitude 3420', 'cái', 32.6, 22.7, 1.9, 1.52, 18500000, 22500000, 10, 'active', NOW(), NOW()),
('LAP002', 'MacBook Pro 14 inch M2', 'cái', 31.26, 22.12, 1.55, 1.6, 42000000, 48000000, 5, 'active', NOW(), NOW()),
('PHN001', 'iPhone 14 Pro 128GB', 'cái', 14.67, 7.15, 0.79, 0.21, 22000000, 26900000, 20, 'active', NOW(), NOW()),
('PHN002', 'Samsung Galaxy S23 Ultra', 'cái', 16.3, 7.8, 0.89, 0.23, 18000000, 22900000, 15, 'active', NOW(), NOW()),
('TBL001', 'iPad Air 5th Gen 256GB', 'cái', 24.76, 17.85, 0.61, 0.46, 15000000, 18900000, 8, 'active', NOW(), NOW()),
('MON001', 'Monitor Samsung 27 inch 4K', 'cái', 61.3, 36.5, 4.3, 4.2, 8000000, 10900000, 12, 'active', NOW(), NOW()),
('KBD001', 'Bàn phím cơ Keychron K2', 'cái', 30.3, 12.3, 3.5, 0.79, 2500000, 3500000, 25, 'active', NOW(), NOW()),
('MOU001', 'Chuột Logitech MX Master 3', 'cái', 12.5, 8.43, 5.14, 0.141, 1800000, 2500000, 30, 'active', NOW(), NOW()),
('HDP001', 'Tai nghe Sony WH-1000XM5', 'cái', 26.3, 20.0, 8.2, 0.25, 7000000, 8900000, 15, 'active', NOW(), NOW()),
('SPK001', 'Loa JBL Charge 5', 'cái', 22.3, 9.6, 9.4, 0.96, 3500000, 4500000, 18, 'active', NOW(), NOW()),
('CAM001', 'Camera Canon EOS R6 Mark II', 'cái', 13.8, 9.7, 8.4, 0.67, 45000000, 52000000, 3, 'active', NOW(), NOW()),
('WSH001', 'Smart Watch Apple Watch Series 9', 'cái', 4.5, 3.8, 1.2, 0.051, 9500000, 12900000, 12, 'active', NOW(), NOW()),
('CHR001', 'Sạc dự phòng Anker PowerCore 20000mAh', 'cái', 15.8, 7.4, 2.5, 0.343, 800000, 1200000, 50, 'active', NOW(), NOW()),
('CAB001', 'Cáp USB-C to Lightning 1m', 'cái', 10.0, 1.5, 1.0, 0.025, 350000, 550000, 100, 'active', NOW(), NOW()),
('STD001', 'Giá đỡ laptop Adjustable Stand', 'cái', 22.0, 20.0, 15.0, 0.8, 400000, 650000, 40, 'active', NOW(), NOW());

-- Sample Customers Data
INSERT INTO Customer (name, code, email, phone, address, city, country, taxCode, status, createdAt, updatedAt) VALUES
('Công ty TNHH Công nghệ ABC', 'CUST001', 'contact@abc-tech.vn', '028-38234567', '123 Đường Nguyễn Văn Cừ, Quận 1', 'TP.HCM', 'Việt Nam', '0123456789', 'active', NOW(), NOW()),
('Công ty CP XYZ Solutions', 'CUST002', 'info@xyz.vn', '024-35678901', '456 Đường Láng, Quận Đống Đa', 'Hà Nội', 'Việt Nam', '9876543210', 'active', NOW(), NOW()),
('Doanh nghiệp tư nhân Minh Anh', 'CUST003', 'minhanh@gmail.com', '090-1234567', '789 Đường 3/2, Quận 10', 'TP.HCM', 'Việt Nam', '', 'active', NOW(), NOW()),
('Công ty Gia đình Thành Công', 'CUST004', 'thanhcong@family.vn', '0222-567890', '321 Đường Hai Bà Trưng, Quận Hai Bà Trưng', 'Hà Nội', 'Việt Nam', '1122334455', 'active', NOW(), NOW()),
('Trường Đại học Bách Khoa', 'CUST005', 'bkh@hcmut.edu.vn', '028-38647256', '268 Đường Lý Thường Kiệt, Quận 10', 'TP.HCM', 'Việt Nam', '', 'active', NOW(), NOW());

-- Sample Users Data (Additional users beyond admin)
INSERT INTO User (email, name, password, status, createdAt, updatedAt) VALUES
('user1@erp.local', 'Nguyễn Văn A', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', NOW(), NOW()),
('user2@erp.local', 'Trần Thị B', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', NOW(), NOW()),
('manager@erp.local', 'Lê Văn C - Manager', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', NOW(), NOW());

