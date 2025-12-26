const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function fixBomColumns() {
  try {
    console.log('🔧 Starting BOM columns fix...');
    
    // Add missing columns to bom_lines table
    const columns = [
      { name: 'lineNo', definition: 'INT NOT NULL DEFAULT 0' },
      { name: 'note', definition: 'TEXT' },
      { name: 'isOptional', definition: 'BOOLEAN NOT NULL DEFAULT false' },
      { name: 'leadTimeDays', definition: 'INT DEFAULT 0' },
      { name: 'subBomId', definition: 'BIGINT' },
      { name: 'parentLineId', definition: 'BIGINT' }
    ];
    
    for (const column of columns) {
      try {
        await prisma.$executeRaw`
          ALTER TABLE bom_lines ADD COLUMN ${column.name} ${column.definition}
        `;
        console.log(`✅ Added column: ${column.name}`);
      } catch (error) {
        if (error.message.includes('Duplicate column name') || error.code === 'ER_DUP_FIELDNAME') {
          console.log(`⚠️  Column already exists: ${column.name}`);
        } else {
          console.error(`❌ Error adding column ${column.name}:`, error.message);
        }
      }
    }
    
    console.log('\n✅ BOM columns fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing BOM columns:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixBomColumns().then(() => {
  console.log('\n🎉 Database fix completed successfully!');
  process.exit(0);
}).catch(err => {
  console.error('\n💥 Failed to fix database:', err);
  process.exit(1);
});
