const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addSampleData() {
  console.log('🔄 Adding sample data to database...');

  try {
    // Check if data already exists
    const existingProducts = await prisma.product.findMany();
    if (existingProducts.length > 0) {
      console.log('✅ Sample data already exists');
      return;
    }

    // Add sample products
    const products = [
      {
        sku: 'LAP001',
        name: 'Laptop Dell Latitude 3420',
        unit: 'cái',
        length: 32.6,
        width: 22.7,
        height: 1.9,
        weight: 1.52,
        standardCost: 18500000,
        salePrice: 22500000,
        safetyStock: 10,
        status: 'active'
      },
      {
        sku: 'LAP002',
        name: 'MacBook Pro 14 inch M2',
        unit: 'cái',
        length: 31.26,
        width: 22.12,
        height: 1.55,
        weight: 1.6,
        standardCost: 42000000,
        salePrice: 48000000,
        safetyStock: 5,
        status: 'active'
      },
      {
        sku: 'PHN001',
        name: 'iPhone 14 Pro 128GB',
        unit: 'cái',
        length: 14.67,
        width: 7.15,
        height: 0.79,
        weight: 0.21,
        standardCost: 22000000,
        salePrice: 26900000,
        safetyStock: 20,
        status: 'active'
      },
      {
        sku: 'PHN002',
        name: 'Samsung Galaxy S23 Ultra',
        unit: 'cái',
        length: 16.3,
        width: 7.8,
        height: 0.89,
        weight: 0.23,
        standardCost: 18000000,
        salePrice: 22900000,
        safetyStock: 15,
        status: 'active'
      },
      {
        sku: 'TBL001',
        name: 'iPad Air 5th Gen 256GB',
        unit: 'cái',
        length: 24.76,
        width: 17.85,
        height: 0.61,
        weight: 0.46,
        standardCost: 15000000,
        salePrice: 18900000,
        safetyStock: 8,
        status: 'active'
      },
      {
        sku: 'MON001',
        name: 'Monitor Samsung 27 inch 4K',
        unit: 'cái',
        length: 61.3,
        width: 36.5,
        height: 4.3,
        weight: 4.2,
        standardCost: 8000000,
        salePrice: 10900000,
        safetyStock: 12,
        status: 'active'
      },
      {
        sku: 'KBD001',
        name: 'Bàn phím cơ Keychron K2',
        unit: 'cái',
        length: 30.3,
        width: 12.3,
        height: 3.5,
        weight: 0.79,
        standardCost: 2500000,
        salePrice: 3500000,
        safetyStock: 25,
        status: 'active'
      },
      {
        sku: 'MOU001',
        name: 'Chuột Logitech MX Master 3',
        unit: 'cái',
        length: 12.5,
        width: 8.43,
        height: 5.14,
        weight: 0.141,
        standardCost: 1800000,
        salePrice: 2500000,
        safetyStock: 30,
        status: 'active'
      },
      {
        sku: 'HDP001',
        name: 'Tai nghe Sony WH-1000XM5',
        unit: 'cái',
        length: 26.3,
        width: 20.0,
        height: 8.2,
        weight: 0.25,
        standardCost: 7000000,
        salePrice: 8900000,
        safetyStock: 15,
        status: 'active'
      },
      {
        sku: 'SPK001',
        name: 'Loa JBL Charge 5',
        unit: 'cái',
        length: 22.3,
        width: 9.6,
        height: 9.4,
        weight: 0.96,
        standardCost: 3500000,
        salePrice: 4500000,
        safetyStock: 18,
        status: 'active'
      }
    ];

    const createdProducts = await prisma.product.createMany({
      data: products
    });

    console.log(`✅ Created ${createdProducts.count} sample products`);

    // Add sample customers
    const customers = [
      {
        name: 'Công ty TNHH Công nghệ ABC',
        code: 'CUST001',
        email: 'contact@abc-tech.vn',
        phone: '028-38234567',
        address: '123 Đường Nguyễn Văn Cừ, Quận 1',
        city: 'TP.HCM',
        country: 'Việt Nam',
        taxCode: '0123456789',
        status: 'active'
      },
      {
        name: 'Công ty CP XYZ Solutions',
        code: 'CUST002',
        email: 'info@xyz.vn',
        phone: '024-35678901',
        address: '456 Đường Láng, Quận Đống Đa',
        city: 'Hà Nội',
        country: 'Việt Nam',
        taxCode: '9876543210',
        status: 'active'
      },
      {
        name: 'Doanh nghiệp tư nhân Minh Anh',
        code: 'CUST003',
        email: 'minhanh@gmail.com',
        phone: '090-1234567',
        address: '789 Đường 3/2, Quận 10',
        city: 'TP.HCM',
        country: 'Việt Nam',
        taxCode: '',
        status: 'active'
      },
      {
        name: 'Công ty Gia đình Thành Công',
        code: 'CUST004',
        email: 'thanhcong@family.vn',
        phone: '0222-567890',
        address: '321 Đường Hai Bà Trưng, Quận Hai Bà Trưng',
        city: 'Hà Nội',
        country: 'Việt Nam',
        taxCode: '1122334455',
        status: 'active'
      },
      {
        name: 'Trường Đại học Bách Khoa',
        code: 'CUST005',
        email: 'bkh@hcmut.edu.vn',
        phone: '028-38647256',
        address: '268 Đường Lý Thường Kiệt, Quận 10',
        city: 'TP.HCM',
        country: 'Việt Nam',
        taxCode: '',
        status: 'active'
      }
    ];

    const createdCustomers = await prisma.customer.createMany({
      data: customers
    });

    console.log(`✅ Created ${createdCustomers.count} sample customers`);

    console.log('🎉 Sample data added successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log(`   • Products: ${createdProducts.count} items`);
    console.log(`   • Customers: ${createdCustomers.count} companies`);
    console.log('');
    console.log('🌐 System Status:');
    console.log(`   • Frontend: http://localhost:5173/`);
    console.log(`   • Backend: http://localhost:4000/`);
    console.log(`   • Admin: admin@erp.local / Admin@123`);
    console.log('');
    console.log('🔗 Try these endpoints:');
    console.log(`   • Products: http://localhost:5173/products`);
    console.log(`   • Customers: http://localhost:5173/customers`);
    
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSampleData();

