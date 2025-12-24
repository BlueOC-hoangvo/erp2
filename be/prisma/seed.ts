import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Chỉ giữ các permission hiện có / sẽ dùng ngay
const PERMS: Array<{ code: string; name: string; module: string }> = [
  // System/User Management
  { code: "system.user.read", name: "Xem người dùng", module: "system" },
  { code: "system.user.create", name: "Tạo người dùng", module: "system" },
  { code: "system.user.update", name: "Sửa người dùng", module: "system" },
  { code: "system.user.delete", name: "Xoá người dùng", module: "system" },
  { code: "system.user.reset_password", name: "Reset mật khẩu", module: "system" },

  // Roles/Permissions
  { code: "system.role.read", name: "Xem vai trò", module: "system" },
  { code: "system.role.create", name: "Tạo vai trò", module: "system" },
  { code: "system.role.update", name: "Sửa vai trò", module: "system" },
  { code: "system.role.delete", name: "Xoá vai trò", module: "system" },
  { code: "system.permission.read", name: "Xem quyền", module: "system" },
  { code: "system.rbac.assign", name: "Gán role/permission", module: "system" },

  // Sales/Customers (module bạn làm ngay)
  { code: "sales.customer.read", name: "Xem khách hàng", module: "sales" },
  { code: "sales.customer.create", name: "Tạo khách hàng", module: "sales" },
  { code: "sales.customer.update", name: "Sửa khách hàng", module: "sales" },
  { code: "sales.customer.delete", name: "Xoá khách hàng", module: "sales" },

  // Sales Orders (schema có sẵn, bạn sẽ làm sau)
  { code: "sales.order.read", name: "Xem đơn hàng", module: "sales" },
  { code: "sales.order.create", name: "Tạo đơn hàng", module: "sales" },
  { code: "sales.order.update", name: "Sửa đơn hàng", module: "sales" },
  { code: "sales.order.delete", name: "Xoá đơn hàng", module: "sales" },
];

const SALES_PERM_CODES = [
  "sales.customer.read",
  "sales.customer.create",
  "sales.customer.update",
  "sales.customer.delete",

  // để sẵn cho bước Sales Order
  "sales.order.read",
  "sales.order.create",
  "sales.order.update",
  "sales.order.delete",
];

function requireEnv(name: string, fallback?: string) {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

async function main() {
  const adminEmail = requireEnv("SEED_ADMIN_EMAIL", "admin@erp.local");
  const adminPassword = requireEnv("SEED_ADMIN_PASSWORD", "Admin@123");

  await prisma.$transaction(async (tx) => {
    // 1) permissions: create missing + update name/module
    await tx.permission.createMany({ data: PERMS, skipDuplicates: true });
    for (const p of PERMS) {
      await tx.permission.update({
        where: { code: p.code },
        data: { name: p.name, module: p.module },
      });
    }

    // 2) roles
    const adminRole = await tx.role.upsert({
      where: { code: "admin" },
      update: { name: "Administrator" },
      create: { code: "admin", name: "Administrator" },
    });

    const salesRole = await tx.role.upsert({
      where: { code: "sales" },
      update: { name: "Sales" },
      create: { code: "sales", name: "Sales" },
    });

    // 3) permissions map
    const perms = await tx.permission.findMany({ select: { id: true, code: true } });
    const permIdByCode = new Map(perms.map((p) => [p.code, p.id]));

    // 4) admin gets ALL current perms
    await tx.rolePermission.deleteMany({ where: { roleId: adminRole.id } });
    await tx.rolePermission.createMany({
      data: perms.map((p) => ({ roleId: adminRole.id, permissionId: p.id })),
      skipDuplicates: true,
    });

    // 5) sales gets subset perms (customer + order)
    const salesPermIds: bigint[] = [];
    for (const code of SALES_PERM_CODES) {
      const id = permIdByCode.get(code);
      if (!id) throw new Error(`Missing permission code in DB: ${code}`);
      salesPermIds.push(id);
    }

    await tx.rolePermission.deleteMany({ where: { roleId: salesRole.id } });
    await tx.rolePermission.createMany({
      data: salesPermIds.map((permissionId) => ({ roleId: salesRole.id, permissionId })),
      skipDuplicates: true,
    });

    // 6) admin user
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const adminUser = await tx.user.upsert({
      where: { email: adminEmail },
      update: { fullName: "Admin", passwordHash, isActive: true },
      create: { email: adminEmail, fullName: "Admin", passwordHash, isActive: true },
    });

    // 7) assign admin role
    await tx.userRole.upsert({
      where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
      update: {},
      create: { userId: adminUser.id, roleId: adminRole.id },
    });
  });

  console.log("✅ Seed done.");
  console.log(
    `Admin: ${process.env.SEED_ADMIN_EMAIL ?? "admin@erp.local"} / ${
      process.env.SEED_ADMIN_PASSWORD ?? "Admin@123"
    }`
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
