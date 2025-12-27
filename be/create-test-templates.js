const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestTemplates() {
  try {
    console.log('🔧 Creating BOM Template test data...');

    // Get some existing items for template data
    const items = await prisma.item.findMany({ take: 5 });
    if (items.length < 3) {
      console.log('❌ Not enough items found. Please ensure test data exists.');
      return;
    }

    const templates = [
      {
        name: 'Basic T-Shirt BOM Template',
        code: 'TSHIRT-BASIC',
        description: 'Standard T-Shirt BOM with fabric and trims',
        category: 'Apparel',
        templateData: {
          lines: [
            {
              itemId: items[0].id,
              uom: 'meter',
              qtyPerUnit: '1.2',
              wastagePercent: '5',
              note: 'Main fabric',
              isOptional: false,
              leadTimeDays: 7
            },
            {
              itemId: items[1].id,
              uom: 'pcs',
              qtyPerUnit: '3',
              wastagePercent: '2',
              note: 'Buttons',
              isOptional: false,
              leadTimeDays: 3
            },
            {
              itemId: items[2].id,
              uom: 'meter',
              qtyPerUnit: '0.5',
              wastagePercent: '10',
              note: 'Rib fabric',
              isOptional: true,
              leadTimeDays: 5
            }
          ]
        }
      },
      {
        name: 'Complex Garment Template',
        code: 'COMPLEX-GARMENT',
        description: 'Multi-level BOM with sub-assemblies',
        category: 'Advanced',
        templateData: {
          lines: [
            {
              itemId: items[0].id,
              uom: 'meter',
              qtyPerUnit: '2.5',
              wastagePercent: '8',
              note: 'Outer fabric',
              isOptional: false,
              leadTimeDays: 14
            },
            {
              itemId: items[1].id,
              uom: 'pcs',
              qtyPerUnit: '1',
              wastagePercent: '0',
              note: 'Zipper',
              isOptional: false,
              leadTimeDays: 10
            },
            {
              itemId: items[2].id,
              uom: 'pcs',
              qtyPerUnit: '2',
              wastagePercent: '3',
              note: 'Elastic bands',
              isOptional: true,
              leadTimeDays: 7
            }
          ]
        }
      },
      {
        name: 'Simple Accessory Template',
        code: 'ACCESSORY-SIMPLE',
        description: 'Basic accessory BOM',
        category: 'Accessories',
        templateData: {
          lines: [
            {
              itemId: items[0].id,
              uom: 'pcs',
              qtyPerUnit: '1',
              wastagePercent: '2',
              note: 'Main component',
              isOptional: false,
              leadTimeDays: 5
            }
          ]
        }
      }
    ];

    // Create templates
    for (const template of templates) {
      const created = await prisma.bomTemplate.create({
        data: template
      });
      console.log(`✅ Created template: ${created.name} (ID: ${created.id})`);
    }

    // Create some test BOM versions
    const boms = await prisma.bom.findMany({ take: 2 });
    if (boms.length > 0) {
      for (const bom of boms) {
        const version = await prisma.bomVersion.create({
          data: {
            bomId: bom.id,
            versionNo: 'v2.0',
            status: 'DRAFT',
            description: 'Updated version for testing',
            createdById: 1
          }
        });
        console.log(`✅ Created BOM version: ${version.versionNo} for BOM ${bom.code}`);
      }
    }

    console.log('\n🎉 Test data creation completed!');
    
  } catch (error) {
    console.error('❌ Error creating test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestTemplates();
