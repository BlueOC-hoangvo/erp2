const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addDemoData() {
  try {
    console.log('🗄️  Starting to add demo data...');

    // Create demo customers
    console.log('\n📋 Creating demo customers...');
    const customers = await Promise.all([
      prisma.customer.create({
        data: {
          code: 'CUS001',
          name: 'Công ty TNHH Thương mại An Bình',
          email: 'contact@anbinh.vn',
          phone: '028-12345678',
          address: '123 Đường ABC, Quận 1, TP.HCM',
          status: 'active',
        },
      }),
      prisma.customer.create({
        data: {
          code: 'CUS002',
          name: 'Công ty CP Đầu tư Xây dựng Minh Thành',
          email: 'info@minhthanh.com',
          phone: '024-98765432',
          address: '456 Đường DEF, Quận Ba Đình, Hà Nội',
          status: 'active',
        },
      }),
      prisma.customer.create({
        data: {
          code: 'CUS003',
          name: 'Cửa hàng bán lẻ Đại Gia',
          email: 'daigia@gmail.com',
          phone: '090-1234567',
          address: '789 Đường GHI, Quận 7, TP.HCM',
          status: 'active',
        },
      }),
    ]);
    console.log('✅ Created', customers.length, 'customers');

    // Create demo products
    console.log('\n📦 Creating demo products...');
    const products = await Promise.all([
      prisma.product.create({
        data: {
          sku: 'DELL-INS-15-001',
          name: 'Máy tính xách tay Dell Inspiron 15',
          unit: 'cái',
          standardCost: 12000000,
          salePrice: 15000000,
          status: 'active',
        },
      }),
      prisma.product.create({
        data: {
          sku: 'HP-LJ-P-001',
          name: 'Máy in HP LaserJet Pro',
          unit: 'cái',
          standardCost: 3500000,
          salePrice: 4500000,
          status: 'active',
        },
      }),
      prisma.product.create({
        data: {
          sku: 'SAM-MON-24-001',
          name: 'Màn hình Samsung 24 inch',
          unit: 'cái',
          standardCost: 2500000,
          salePrice: 3200000,
          status: 'active',
        },
      }),
      prisma.product.create({
        data: {
          sku: 'LOG-MOU-WL-001',
          name: 'Chuột không dây Logitech',
          unit: 'cái',
          standardCost: 800000,
          salePrice: 1200000,
          status: 'active',
        },
      }),
      prisma.product.create({
        data: {
          sku: 'KEY-KB-M-001',
          name: 'Bàn phím cơ Keychron',
          unit: 'cái',
          standardCost: 1200000,
          salePrice: 1800000,
          status: 'active',
        },
      }),
    ]);
    console.log('✅ Created', products.length, 'products');

    // Create demo sales orders
    console.log('\n🛒 Creating demo sales orders...');
    
    // Get admin user
    const adminUser = await prisma.user.findFirst({
      where: { email: 'admin@erp.local' }
    });

    const salesOrders = [];
    
    // Order 1
    const order1 = await prisma.salesOrder.create({
      data: {
        code: 'SO-202512-0001',
        customerId: customers[0].id,
        orderType: 'sale',
        paymentMethod: 'cash',
        currency: 'VND',
        subtotal: 15000000,
        shippingFee: 200000,
        discountAmount: 500000,
        taxEnabled: true,
        taxAmount: 1500000,
        total: 16000000,
        status: 'confirmed',
        deliveryAddress: '123 Đường ABC, Quận 1, TP.HCM',
        deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        createdById: adminUser?.id,
      },
    });
    
    // Order 1 items
    await prisma.salesOrderItem.createMany({
      data: [
        {
          salesOrderId: order1.id,
          productId: products[0].id, // Laptop
          qty: 1,
          unitPrice: 15000000,
          lineTotal: 15000000,
          note: 'Cài đặt Windows và Office',
        },
      ],
    });
    salesOrders.push(order1);

    // Order 2
    const order2 = await prisma.salesOrder.create({
      data: {
        code: 'SO-202512-0002',
        customerId: customers[1].id,
        orderType: 'sale',
        paymentMethod: 'bank_transfer',
        currency: 'VND',
        subtotal: 4500000,
        shippingFee: 100000,
        discountAmount: 0,
        taxEnabled: true,
        taxAmount: 450000,
        total: 5050000,
        status: 'processing',
        deliveryAddress: '456 Đường DEF, Quận Ba Đình, Hà Nội',
        deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        createdById: adminUser?.id,
      },
    });
    
    // Order 2 items
    await prisma.salesOrderItem.createMany({
      data: [
        {
          salesOrderId: order2.id,
          productId: products[1].id, // Printer
          qty: 1,
          unitPrice: 4500000,
          lineTotal: 4500000,
          note: 'Cài đặt driver và hướng dẫn sử dụng',
        },
      ],
    });
    salesOrders.push(order2);

    // Order 3
    const order3 = await prisma.salesOrder.create({
      data: {
        code: 'SO-202512-0003',
        customerId: customers[2].id,
        orderType: 'sale',
        paymentMethod: 'credit_card',
        currency: 'VND',
        subtotal: 7400000,
        shippingFee: 150000,
        discountAmount: 200000,
        taxEnabled: true,
        taxAmount: 740000,
        total: 8150000,
        status: 'shipped',
        deliveryAddress: '789 Đường GHI, Quận 7, TP.HCM',
        deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        createdById: adminUser?.id,
      },
    });
    
    // Order 3 items
    await prisma.salesOrderItem.createMany({
      data: [
        {
          salesOrderId: order3.id,
          productId: products[2].id, // Monitor
          qty: 2,
          unitPrice: 3200000,
          lineTotal: 6400000,
          note: 'Kiểm tra 2 màn hình trước khi giao',
        },
        {
          salesOrderId: order3.id,
          productId: products[3].id, // Mouse
          qty: 2,
          unitPrice: 1200000,
          lineTotal: 2400000,
          note: 'Đi kèm 2 chuột',
        },
        {
          salesOrderId: order3.id,
          productId: products[4].id, // Keyboard
          qty: 1,
          unitPrice: 1800000,
          lineTotal: 1800000,
          note: 'Bàn phím cơ cao cấp',
        },
      ],
    });
    salesOrders.push(order3);

    console.log('✅ Created', salesOrders.length, 'sales orders with items');

    // Create some work orders
    console.log('\n🔧 Creating demo work orders...');
    const workOrders = await Promise.all([
      prisma.workOrder.create({
        data: {
          code: 'WO-202512-0001',
          salesOrderId: order1.id,
          productId: products[0].id,
          qty: 1,
          status: 'in_progress',
          plannedStart: new Date(),
          plannedEnd: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        },
      }),
      prisma.workOrder.create({
        data: {
          code: 'WO-202512-0002',
          salesOrderId: order2.id,
          productId: products[1].id,
          qty: 1,
          status: 'planned',
          plannedStart: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          plannedEnd: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);
    console.log('✅ Created', workOrders.length, 'work orders');

    // Summary
    console.log('\n📊 Demo data summary:');
    console.log('- Customers:', customers.length);
    console.log('- Products:', products.length);
    console.log('- Sales Orders:', salesOrders.length);
    console.log('- Work Orders:', workOrders.length);
    
    console.log('\n🎉 Demo data created successfully!');
    console.log('\n💡 You can now test the ERP system with sample data.');
    console.log('   - Login with: admin@erp.local / admin123');
    console.log('   - Check Sales Orders page to see the demo data');
    console.log('   - Test all CRUD operations on the data');

  } catch (error) {
    console.error('❌ Error creating demo data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addDemoData()
  .then(() => {
    console.log('✅ Demo data setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Demo data setup failed:', error);
    process.exit(1);
  });
