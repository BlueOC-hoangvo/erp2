const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testMultiLevelBom() {
  try {
    console.log('\n🔍 Testing BOM Structure Analysis...');
    
    // Kiểm tra tất cả BOM lines
    const allBomLines = await prisma.bomLine.findMany({
      include: { 
        item: true,
        bom: { include: { productStyle: true } }
      },
      orderBy: [{ bomId: 'asc' }, { id: 'asc' }]
    });
    
    console.log('📊 BOM Lines Summary:');
    console.log(`Total Lines: ${allBomLines.length}`);
    
    // Group by BOM
    const bomGroups = {};
    allBomLines.forEach(line => {
      const bomCode = line.bom.code || `BOM-${line.bomId}`;
      if (!bomGroups[bomCode]) {
        bomGroups[bomCode] = [];
      }
      bomGroups[bomCode].push(line);
    });
    
    console.log('\n🔍 BOM Structure by Code:');
    Object.entries(bomGroups).forEach(([bomCode, lines]) => {
      console.log(`\n${bomCode}: ${lines.length} lines`);
      lines.forEach((line, index) => {
        console.log(`  ${index + 1}. ${line.item.name} (${line.item.sku}) - ${line.qtyPerUnit} ${line.uom}`);
      });
    });
    
    // Kiểm tra xem có subBomId field không
    console.log('\n🔍 Checking subBomId field...');
    const firstLine = allBomLines[0];
    if (firstLine && 'subBomId' in firstLine) {
      console.log('✅ subBomId field exists');
      
      const bomWithSubBom = await prisma.bomLine.findFirst({
        where: { subBomId: { not: null } },
        include: { 
          item: true,
          subBom: {
            include: { lines: { include: { item: true } } }
          }
        }
      });
      
      if (bomWithSubBom) {
        console.log('✅ Found sub-BOM structure:');
        console.log('Main Item:', bomWithSubBom.item.name);
        console.log('Sub-BOM Code:', bomWithSubBom.subBom.code);
        console.log('Sub-BOM Lines:', bomWithSubBom.subBom.lines.length);
      } else {
        console.log('ℹ️ No sub-BOM structure found (single-level BOM)');
      }
    } else {
      console.log('❌ subBomId field not found in Prisma client');
      console.log('Available fields:', Object.keys(firstLine || {}));
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testMultiLevelBom();
