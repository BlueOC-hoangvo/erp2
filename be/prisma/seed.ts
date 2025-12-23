import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const PERMS = [
  // Admin/RBAC
  { code: "admin.user.read", name: "Read users", module: "admin" },
  { code: "admin.user.create", name: "Create users", module: "admin" },
  { code: "admin.user.update", name: "Update users", module: "admin" },
  { code: "admin.user.delete", name: "Delete users", module: "admin" },
  { code: "admin.role.read", name: "Read roles", module: "admin" },
  { code: "admin.role.create", name: "Create roles", module: "admin" },
  { code: "admin.role.update", name: "Update roles", module: "admin" },
  { code: "admin.role.delete", name: "Delete roles", module: "admin" },
  { code: "admin.permission.read", name: "Read permissions", module: "admin" },
  {
    code: "admin.rbac.assign",
    name: "Assign roles/permissions",
    module: "admin",
  },

  // Sales/Customers
  { code: "sales.customer.read", name: "Read customers", module: "sales" },
  { code: "sales.customer.create", name: "Create customers", module: "sales" },
  { code: "sales.customer.update", name: "Update customers", module: "sales" },
  { code: "sales.customer.delete", name: "Delete customers", module: "sales" },

  // Products
  { code: "product.read", name: "Read products", module: "product" },
  { code: "product.write", name: "Write products", module: "product" },

  // Files
  { code: "files.upload", name: "Upload files", module: "files" },
  { code: "files.attach", name: "Attach files", module: "files" },
  { code: "files.read", name: "Read files", module: "files" },

  // Audit
  { code: "audit.read", name: "Read audit logs", module: "audit" },
];

async function main() {
  // permissions
  for (const p of PERMS) {
    await prisma.permission.upsert({
      where: { code: p.code },
      update: { name: p.name, module: p.module },
      create: p,
    });
  }

  // roles
  const adminRole = await prisma.role.upsert({
    where: { code: "admin" },
    update: { name: "Administrator" },
    create: { code: "admin", name: "Administrator" },
  });

  const salesRole = await prisma.role.upsert({
    where: { code: "sales" },
    update: { name: "Sales" },
    create: { code: "sales", name: "Sales" },
  });

  const perms = await prisma.permission.findMany();
  const permsByCode = new Map(perms.map((x) => [x.code, x.id]));

  // admin gets all perms
  await prisma.rolePermission.deleteMany({ where: { roleId: adminRole.id } });
  await prisma.rolePermission.createMany({
    data: perms.map((p) => ({ roleId: adminRole.id, permissionId: p.id })),
  });

  // sales gets customer perms + files upload/read/attach
  const salesPermCodes = [
    "sales.customer.read",
    "sales.customer.create",
    "sales.customer.update",
    "sales.customer.delete",
    "files.upload",
    "files.attach",
    "files.read",
  ];
  await prisma.rolePermission.deleteMany({ where: { roleId: salesRole.id } });
  await prisma.rolePermission.createMany({
    data: salesPermCodes.map((code) => ({
      roleId: salesRole.id,
      permissionId: permsByCode.get(code)!,
    })),
  });

  // admin user
  const passwordHash = await bcrypt.hash("Admin@123", 10);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@erp.local" },
    update: { fullName: "Admin", passwordHash, isActive: true },
    create: {
      email: "admin@erp.local",
      fullName: "Admin",
      passwordHash,
      isActive: true,
    },
  });

  // assign admin role
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
    update: {},
    create: { userId: adminUser.id, roleId: adminRole.id },
  });

  console.log("Seed done. Admin: admin@erp.local / Admin@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
