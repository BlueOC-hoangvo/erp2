const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  try {
    // Kiểm tra products
    const products = await prisma.product.findMany({
      where: { deletedAt: null }
    });
    console.log('=== PRODUCTS ===');
    console.log('Total products:', products.length);
    if (products.length > 0) {
      console.log('First product:', JSON.stringify(products[0], null, 2));
    }
    
    // Kiểm tra roles và permissions
    console.log('\n=== ROLES & PERMISSIONS ===');
    const roles = await prisma.role.findMany({
      include: { permissions: { include: { permission: true } } }
    });
    console.log('Total roles:', roles.length);
    for (const role of roles) {
      console.log('Role:', role.name, 'Permissions:', role.permissions.map(rp => rp.permission.code));
    }
    
    // Kiểm tra users
    console.log('\n=== USERS ===');
    const users = await prisma.user.findMany();
    console.log('Total users:', users.length);
    if (users.length > 0) {
      console.log('First user:', JSON.stringify(users[0], null, 2));
      
      // Kiểm tra permissions của user đầu tiên
      const firstUser = users[0];
      const userRoles = await prisma.userRole.findMany({
        where: { userId: firstUser.id },
        include: {
          role: { include: { permissions: { include: { permission: true } } } }
        }
      });
      console.log('User roles:', userRoles.length);
      for (const ur of userRoles) {
        console.log('Role:', ur.role.name);
        console.log('Permissions:', ur.role.permissions.map(rp => rp.permission.code));
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
