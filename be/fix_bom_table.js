const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixBomTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'erp_base'
  });

  try {
    console.log('Adding missing columns to bom_lines table...');
    
    // Add missing columns one by one to handle existing columns gracefully
    const columns = [
      'lineNo INT NOT NULL DEFAULT 0',
      'note TEXT',
      'isOptional BOOLEAN NOT NULL DEFAULT false', 
      'leadTimeDays INT DEFAULT 0',
      'subBomId BIGINT',
      'parentLineId BIGINT'
    ];
    
    for (const column of columns) {
      try {
        await connection.execute(`ALTER TABLE \`bom_lines\` ADD COLUMN \`${column}\``);
        console.log(`✅ Added column: ${column.split(' ')[0]}`);
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log(`⚠️  Column already exists: ${column.split(' ')[0]}`);
        } else {
          console.error(`❌ Error adding column ${column.split(' ')[0]}:`, error.message);
        }
      }
    }
    
    console.log('\n✅ BOM table fix completed successfully!');
    
    // Verify the columns were added
    console.log('\n📋 Current bom_lines table structure:');
    const [rows] = await connection.execute('DESCRIBE bom_lines');
    console.log(rows.map(row => `  - ${row.Field} (${row.Type})`).join('\n'));
    
  } catch (error) {
    console.error('❌ Error fixing BOM table:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

fixBomTable().then(() => {
  console.log('\n🎉 Database fix completed!');
  process.exit(0);
}).catch(err => {
  console.error('\n💥 Failed to fix database:', err);
  process.exit(1);
});
