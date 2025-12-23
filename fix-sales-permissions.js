const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixSalesPermissions() {
  try {
    console.log('🔧 Starting sales permissions fix...\n');

    // Step 1: Check current state
    console.log('📋 Step 1: Checking current state...');
    
    // Check permissions
    const permissions = await prisma.permission.findMany();
    console.log(`Found ${permissions.length} permissions in database`);
    
    const salesPermissions = permissions.filter(p => p.code.includes('sales'));
    console.log('Sales-related permissions:', salesPermissions.map(p => p.code));
    
    // Check roles
    const roles = await prisma.role.findMany();
    console.log(`Found ${roles.length} roles: ${roles.map(r => r.name).join(', ')}`);
    
    // Check users
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users`);
    
    // Step 2: Create missing sales permissions
    console.log('\n🛠️ Step 2: Creating sales permissions...');
    
    const requiredSalesPermissions = [
      { code: 'sales_order_read', name: 'View Sales Orders', module: 'sales' },
      { code: 'sales_order_create', name: 'Create Sales Orders', module: 'sales' },
      { code: 'sales_order_update', name: 'Update Sales Orders', module: 'sales' },
      { code: 'sales_order_delete', name: 'Delete Sales Orders', module: 'sales' },
      { code: 'sales_order_convert', name: 'Convert Sales Orders', module: 'sales' },
      { code: 'customer_read', name: 'View Customers', module: 'sales' },
      { code: 'customer_create', name: 'Create Customers', module: 'sales' },
      { code: 'customer_update', name: 'Update Customers', module: 'sales' },
      { code: 'customer_delete', name: 'Delete Customers', module: 'sales' },
      { code: 'product_read', name: 'View Products', module: 'sales' },
      { code: 'product_create', name: 'Create Products', module: 'sales' },
      { code: 'product_update', name: 'Update Products', module: 'sales' },
      { code: 'product_delete', name: 'Delete Products', module: 'sales' }
    ];
    
    for (const perm of requiredSalesPermissions) {
      const existing = permissions.find(p => p.code === perm.code);
      if (!existing) {
        await prisma.permission.create({
          data: perm
        });
        console.log(`✅ Created permission: ${perm.code}`);
      } else {
        console.log(`ℹ️ Permission already exists: ${perm.code}`);
      }
    }
    
    // Step 3: Create or get Admin role
    console.log('\n👤 Step 3: Creating admin role...');
    
    let adminRole = roles.find(r => r.code === 'admin');
    if (!adminRole) {
      adminRole = await prisma.role.create({
        data: {
          code: 'admin',
          name: 'Administrator',
          description: 'Full system access'
        }
      });
      console.log('✅ Created admin role');
    } else {
      console.log('ℹ️ Admin role already exists');
    }
    
    // Step 4: Assign all permissions to admin role
    console.log('\n🔑 Step 4: Assigning permissions to admin role...');
    
    const allPermissions = await prisma.permission.findMany();
    const existingRolePerms = await prisma.rolePermission.findMany({
      where: { roleId: adminRole.id }
    });
    
    const existingPermIds = new Set(existingRolePerms.map(rp => rp.permissionId));
    
    for (const perm of allPermissions) {
      if (!existingPermIds.has(perm.id)) {
        await prisma.rolePermission.create({
          data: {
            roleId: adminRole.id,
            permissionId: perm.id
          }
        });
        console.log(`✅ Assigned permission: ${perm.code} to admin role`);
      }
    }
    
    // Step 5: Assign admin role to all users
    console.log('\n👥 Step 5: Assigning admin role to users...');
    
    const updatedRoles = await prisma.role.findMany();
    adminRole = updatedRoles.find(r => r.code === 'admin');
    
    for (const user of users) {
      const existingUserRole = await prisma.userRole.findUnique({
        where: {
          userId_roleId: {
            userId: user.id,
            roleId: adminRole.id
          }
        }
      });
      
      if (!existingUserRole) {
        await prisma.userRole.create({
          data: {
            userId: user.id,
            roleId: adminRole.id
          }
        });
        console.log(`✅ Assigned admin role to user: ${user.email}`);
      } else {
        console.log(`ℹ️ User already has admin role: ${user.email}`);
      }
    }
    
    // Step 6: Verification
    console.log('\n🔍 Step 6: Verification...');
    
    const firstUser = users[0];
    if (firstUser) {
      const userRoles = await prisma.userRole.findMany({
        where: { userId: firstUser.id },
        include: {
          role: { include: { permissions: { include: { permission: true } } } }
        }
      });
      
      console.log(`\n📊 User ${firstUser.email} has ${userRoles.length} role(s):`);
      const allUserPerms = new Set();
      
      for (const ur of userRoles) {
        console.log(`  - Role: ${ur.role.name}`);
        for (const rp of ur.role.permissions) {
          allUserPerms.add(rp.permission.code);
        }
      }
      
      console.log(`\n✅ User has ${allUserPerms.size} permissions total`);
      console.log('Sales permissions:', Array.from(allUserPerms).filter(p => p.includes('sales')));
      
      if (allUserPerms.has('sales_order_read')) {
        console.log('🎉 SUCCESS: User has sales_order_read permission!');
      } else {
        console.log('❌ ERROR: User still missing sales_order_read permission');
      }
    }
    
    console.log('\n🎉 Sales permissions fix completed!');
    
  } catch (error) {
    console.error('❌ Error during fix:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixSalesPermissions();
