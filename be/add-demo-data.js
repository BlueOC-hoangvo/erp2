const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  
  try {
    // Clear existing sample data first
    await prisma.product.deleteMany({
      where: {
        sku: {
          startsWith: 'SAMPLE_'
        }
      }
    });
    
    // Add sample products with sample_ prefix to avoid conflicts
    const products = [
      {
        sku: 'SAMPLE_LAP001',
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
        sku: 'SAMPLE_MAC001',
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
        sku: 'SAMPLE_IPH001',
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
        sku: 'SAMPLE_SAM001',
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
        sku: 'SAMPLE_IPD001',
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
      }
    ];

    await prisma.product.createMany({
      data: products
    });

    console.log('✅ Added 5 sample products successfully!');
    console.log('');
    console.log('🔗 Access your ERP system:');
    console.log('   Frontend: http://localhost:5173/');
    console.log('   Backend:  http://localhost:4000/');
    console.log('   Login: admin@erp.local / Admin@123');
    console.log('');
    console.log('📱 Sample Products:');
    products.forEach(p => {
      console.log(`   • ${p.sku}: ${p.name} - ${p.salePrice.toLocaleString('vi-VN')} ₫`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

