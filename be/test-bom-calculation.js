const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testBomCalculation() {
  try {
    const bom = await prisma.bom.findUnique({
      where: { id: 3n },
      include: {
        productStyle: true,
        lines: { 
          include: { item: true }, 
          orderBy: { id: 'asc' } 
        },
      },
    });
    
    console.log('📋 BOM Analysis:');
    console.log('Code:', bom.code);
    console.log('Product:', bom.productStyle.name);
    console.log('Lines:', bom.lines.length);
    
    console.log('\n🔍 BOM Lines Calculation (100 units):');
    let totalMaterialCost = 0;
    
    bom.lines.forEach((line, index) => {
      const qtyPerUnit = parseFloat(line.qtyPerUnit);
      const wastagePercent = parseFloat(line.wastagePercent);
      const totalQty = qtyPerUnit * 100 * (1 + wastagePercent/100);
      
      console.log(`\n${index + 1}. ${line.item.name}`);
      console.log(`   Item: ${line.item.sku}`);
      console.log(`   Qty per unit: ${qtyPerUnit} ${line.uom}`);
      console.log(`   Wastage: ${wastagePercent}%`);
      console.log(`   Total qty for 100 units: ${totalQty.toFixed(2)} ${line.uom}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testBomCalculation();
