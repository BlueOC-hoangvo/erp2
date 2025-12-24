import { prisma } from "../../db/prisma";
import { E } from "../../common/errors";


const toBigInt = (v: any) => BigInt(v);

export class RbacService {
  // Permissions (read-only)
  static async listPermissions() {
    const items = await prisma.permission.findMany({
      orderBy: [{ module: "asc" }, { code: "asc" }],
    });
    return items.map((p) => ({ ...p, id: p.id.toString() }));
  }

  // Roles CRUD
  static async listRoles() {
    const items = await prisma.role.findMany({ orderBy: { code: "asc" } });
    return items.map((r) => ({ ...r, id: r.id.toString() }));
  }

  static async createRole(
    input: { code: string; name: string; description?: string },
    actorUserId: bigint
  ) {
    const exists = await prisma.role.findUnique({
      where: { code: input.code },
    });
    if (exists) throw E.conflict("Role code already exists");

    const created = await prisma.role.create({
      data: {
        code: input.code,
        name: input.name,
        description: input.description ?? null,
      },
    });

   

    return { ...created, id: created.id.toString() };
  }

  static async updateRole(
    roleId: bigint,
    input: { code?: string; name?: string; description?: string },
    actorUserId: bigint
  ) {
    const before = await prisma.role.findUnique({ where: { id: roleId } });
    if (!before) throw E.notFound("Role not found");

    const updated = await prisma.role.update({
      where: { id: roleId },
      data: {
        ...(input.code ? { code: input.code } : {}),
        ...(input.name ? { name: input.name } : {}),
        ...(input.description !== undefined
          ? { description: input.description ?? null }
          : {}),
      },
    });

    
    return { ...updated, id: updated.id.toString() };
  }

  static async deleteRole(roleId: bigint, actorUserId: bigint) {
    const before = await prisma.role.findUnique({ where: { id: roleId } });
    if (!before) throw E.notFound("Role not found");

    // remove relations first
    await prisma.rolePermission.deleteMany({ where: { roleId } });
    await prisma.userRole.deleteMany({ where: { roleId } });
    await prisma.role.delete({ where: { id: roleId } });

    

    return { ok: true };
  }

  // Assign permissions to role
  static async assignRolePermissions(
    roleId: bigint,
    permissionIds: any[],
    actorUserId: bigint
  ) {
    const role = await prisma.role.findUnique({ where: { id: roleId } });
    if (!role) throw E.notFound("Role not found");

    const ids = permissionIds.map(toBigInt);

    // validate perms exist
    const perms = await prisma.permission.findMany({
      where: { id: { in: ids } },
    });
    if (perms.length !== ids.length)
      throw E.badRequest("Some permissionIds not found");

    // replace strategy (simple)
    await prisma.rolePermission.deleteMany({ where: { roleId } });
    await prisma.rolePermission.createMany({
      data: ids.map((pid) => ({ roleId, permissionId: pid })),
    });

   
    return { ok: true };
  }

  // Users list + assign roles
  static async listUsers() {
    const items = await prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return items.map((u) => ({
      id: u.id.toString(),
      email: u.email,
      fullName: u.fullName,
      isActive: u.isActive,
    }));
  }

  static async assignUserRoles(
    userId: bigint,
    roleIds: any[],
    actorUserId: bigint
  ) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.deletedAt) throw E.notFound("User not found");

    const ids = roleIds.map(toBigInt);
    const roles = await prisma.role.findMany({ where: { id: { in: ids } } });
    if (roles.length !== ids.length)
      throw E.badRequest("Some roleIds not found");

    await prisma.userRole.deleteMany({ where: { userId } });
    await prisma.userRole.createMany({
      data: ids.map((rid) => ({ userId, roleId: rid })),
    });

   

    return { ok: true };
  }
}
