import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Bạn có thể chỉnh danh sách permission ở đây
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

  // Sales/Customers
  { code: "sales.customer.read", name: "Xem khách hàng", module: "sales" },
  { code: "sales.customer.create", name: "Tạo khách hàng", module: "sales" },
  { code: "sales.customer.update", name: "Sửa khách hàng", module: "sales" },
  { code: "sales.customer.delete", name: "Xoá khách hàng", module: "sales" },

  // Sales Orders
  { code: "sales.order.read", name: "Xem đơn hàng", module: "sales" },
  { code: "sales.order.create", name: "Tạo đơn hàng", module: "sales" },
  { code: "sales.order.update", name: "Sửa đơn hàng", module: "sales" },
  { code: "sales.order.delete", name: "Xoá đơn hàng", module: "sales" },

  // Quotations
  { code: "sales.quotation.read", name: "Xem báo giá", module: "sales" },
  { code: "sales.quotation.create", name: "Tạo báo giá", module: "sales" },
  { code: "sales.quotation.update", name: "Sửa báo giá", module: "sales" },
  { code: "sales.quotation.delete", name: "Xoá báo giá", module: "sales" },
  { code: "sales.quotation.convert_to_order", name: "Chuyển báo giá thành đơn hàng", module: "sales" },

  // Files
  { code: "files.upload", name: "Upload file", module: "files" },
  { code: "files.attach", name: "Đính kèm file", module: "files" },
  { code: "files.read", name: "Xem file", module: "files" },

  // Warehouse
  { code: "warehouse.warehouse.read", name: "Xem kho", module: "warehouse" },
  { code: "warehouse.warehouse.create", name: "Tạo kho", module: "warehouse" },
  { code: "warehouse.warehouse.update", name: "Sửa kho", module: "warehouse" },
  { code: "warehouse.warehouse.delete", name: "Xoá kho", module: "warehouse" },

  { code: "warehouse.zone.read", name: "Xem khu vực kho", module: "warehouse" },
  { code: "warehouse.zone.create", name: "Tạo khu vực kho", module: "warehouse" },
  { code: "warehouse.zone.update", name: "Sửa khu vực kho", module: "warehouse" },
  { code: "warehouse.zone.delete", name: "Xoá khu vực kho", module: "warehouse" },

  { code: "warehouse.inbound.read", name: "Xem phiếu nhập", module: "warehouse" },
  { code: "warehouse.inbound.create", name: "Tạo phiếu nhập", module: "warehouse" },
  { code: "warehouse.inbound.update", name: "Sửa phiếu nhập", module: "warehouse" },
  { code: "warehouse.inbound.delete", name: "Xoá phiếu nhập", module: "warehouse" },
  { code: "warehouse.inbound.confirm", name: "Xác nhận nhập kho", module: "warehouse" },

  { code: "warehouse.outbound.read", name: "Xem phiếu xuất", module: "warehouse" },
  { code: "warehouse.outbound.create", name: "Tạo phiếu xuất", module: "warehouse" },
  { code: "warehouse.outbound.update", name: "Sửa phiếu xuất", module: "warehouse" },
  { code: "warehouse.outbound.delete", name: "Xoá phiếu xuất", module: "warehouse" },
  { code: "warehouse.outbound.confirm", name: "Xác nhận xuất kho", module: "warehouse" },

  { code: "warehouse.inventory.read", name: "Xem tồn kho", module: "warehouse" },
  { code: "warehouse.stockmove.read", name: "Xem lịch sử kho", module: "warehouse" },

  // Audit
  { code: "audit.read", name: "Xem audit logs", module: "audit" },
];

// Sales role chỉ cần 1 subset perms (bạn chỉnh theo nhu cầu)
const SALES_PERM_CODES = [
  "sales.customer.read",
  "sales.customer.create",
  "sales.customer.update",
  "sales.customer.delete",
  "sales.order.read",
  "sales.order.create",
  "sales.order.update",
  "sales.order.delete",
  "sales.quotation.read",
  "sales.quotation.create",
  "sales.quotation.update",
  "sales.quotation.delete",
  "sales.quotation.convert_to_order",
  "files.upload",
  "files.attach",
  "files.read",
];

function requireEnv(name: string, fallback?: string) {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

async function seedPermissions() {
  // nhanh + không lỗi trùng
  await prisma.permission.createMany({
    data: PERMS,
    skipDuplicates: true,
  });

  // đảm bảo name/module cập nhật nếu bạn đổi mô tả
  // (createMany không update được nên làm update theo code)
  await prisma.$transaction(
    PERMS.map((p) =>
      prisma.permission.update({
        where: { code: p.code },
        data: { name: p.name, module: p.module },
      })
    )
  );
}

async function upsertRoles() {
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

  return { adminRole, salesRole };
}

async function assignRolePermissions(roleId: bigint, permIds: bigint[]) {
  // idempotent: xoá rồi tạo lại
  await prisma.rolePermission.deleteMany({ where: { roleId } });
  if (permIds.length === 0) return;

  await prisma.rolePermission.createMany({
    data: permIds.map((permissionId) => ({ roleId, permissionId })),
    skipDuplicates: true,
  });
}

async function main() {
  const adminEmail = requireEnv("SEED_ADMIN_EMAIL", "admin@erp.local");
  const adminPassword = requireEnv("SEED_ADMIN_PASSWORD", "Admin@123");

  await prisma.$transaction(async (tx) => {
    // 1) permissions
    await tx.permission.createMany({ data: PERMS, skipDuplicates: true });
    // update lại name/module (nếu đổi)
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
    const perms = await tx.permission.findMany({
      select: { id: true, code: true },
    });
    const permIdByCode = new Map(perms.map((p) => [p.code, p.id]));

    // 4) assign admin all perms
    await tx.rolePermission.deleteMany({ where: { roleId: adminRole.id } });
    await tx.rolePermission.createMany({
      data: perms.map((p) => ({ roleId: adminRole.id, permissionId: p.id })),
      skipDuplicates: true,
    });

    // 5) assign sales subset perms
    const salesPermIds: bigint[] = [];
    for (const code of SALES_PERM_CODES) {
      const id = permIdByCode.get(code);
      if (!id) {
        throw new Error(`Missing permission code in DB: ${code}`);
      }
      salesPermIds.push(id);
    }

    await tx.rolePermission.deleteMany({ where: { roleId: salesRole.id } });
    await tx.rolePermission.createMany({
      data: salesPermIds.map((permissionId) => ({
        roleId: salesRole.id,
        permissionId,
      })),
      skipDuplicates: true,
    });

    // 6) admin user
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const adminUser = await tx.user.upsert({
      where: { email: adminEmail },
      update: { fullName: "Admin", passwordHash, isActive: true },
      create: {
        email: adminEmail,
        fullName: "Admin",
        passwordHash,
        isActive: true,
      },
    });

    // 7) assign admin role
    await tx.userRole.upsert({
      where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
      update: {},
      create: { userId: adminUser.id, roleId: adminRole.id },
    });
  });

  console.log("✅ Seed done.");
  console.log(`Admin: ${process.env.SEED_ADMIN_EMAIL ?? "admin@erp.local"} / ${process.env.SEED_ADMIN_PASSWORD ?? "Admin@123"}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
