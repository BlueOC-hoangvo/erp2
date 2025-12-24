import { prisma } from "../../db/prisma";
import { E } from "../../common/errors";


function toBigInt(x: any): bigint {
  try {
    return BigInt(x);
  } catch {
    throw E.badRequest("Invalid id");
  }
}

export class RolesService {
  static async list(query: any) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100);
    const q = (query.q?.toString() || "").trim();

    const where: any = {};
    if (q) where.OR = [{ code: { contains: q } }, { name: { contains: q } }];

    const [total, roles] = await Promise.all([
      prisma.role.count({ where }),
      prisma.role.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          permissions: { include: { permission: true } },
          users: true,
        },
      }),
    ]);

    return {
      data: roles.map((r) => ({
        id: r.id.toString(),
        code: r.code,
        name: r.name,
        description: r.description,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        usersCount: r.users.length,
        permissions: r.permissions
          .map((rp) => rp.permission)
          .sort((a, b) => (a.code > b.code ? 1 : -1))
          .map((p) => ({ id: p.id.toString(), code: p.code, name: p.name, module: p.module })),
      })),
      meta: { page, limit, total },
    };
  }

  static async detail(id: bigint) {
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        permissions: { include: { permission: true } },
        users: { include: { user: true } },
      },
    });
    if (!role) throw E.notFound("Role not found");

    return {
      id: role.id.toString(),
      code: role.code,
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      permissions: role.permissions
        .map((rp) => rp.permission)
        .sort((a, b) => (a.code > b.code ? 1 : -1))
        .map((p) => ({ id: p.id.toString(), code: p.code, name: p.name, module: p.module })),
      users: role.users.map((ur) => ({
        id: ur.user.id.toString(),
        email: ur.user.email,
        fullName: ur.user.fullName,
        isActive: ur.user.isActive,
      })),
    };
  }

  static async create(input: any, actorUserId: bigint) {
    const exists = await prisma.role.findUnique({ where: { code: input.code } });
    if (exists) throw E.conflict("Role code already exists");

    const created = await prisma.role.create({
      data: {
        code: input.code,
        name: input.name,
        description: input.description ?? null,
      },
    });

    

    return { id: created.id.toString() };
  }

  static async update(id: bigint, input: any, actorUserId: bigint) {
    const before = await prisma.role.findUnique({ where: { id } });
    if (!before) throw E.notFound("Role not found");

    // if code updated -> ensure unique
    if (input.code && input.code !== before.code) {
      const exists = await prisma.role.findUnique({ where: { code: input.code } });
      if (exists) throw E.conflict("Role code already exists");
    }

    const updated = await prisma.role.update({
      where: { id },
      data: {
        ...(input.code ? { code: input.code } : {}),
        ...(input.name ? { name: input.name } : {}),
        ...(input.description !== undefined ? { description: input.description ?? null } : {}),
      },
    });

    
    return { ok: true };
  }

  static async remove(id: bigint, actorUserId: bigint) {
    const role = await prisma.role.findUnique({ where: { id } });
    if (!role) throw E.notFound("Role not found");

    // chặn xoá role đang được gán cho user
    const countUsers = await prisma.userRole.count({ where: { roleId: id } });
    if (countUsers > 0) throw E.badRequest("Role is assigned to users, cannot delete");

    await prisma.rolePermission.deleteMany({ where: { roleId: id } });
    await prisma.role.delete({ where: { id } });

   
    return { ok: true };
  }

  // replace all permissions of role
  static async assignPermissions(roleId: bigint, permissionIds: string[], actorUserId: bigint) {
    const role = await prisma.role.findUnique({ where: { id: roleId } });
    if (!role) throw E.notFound("Role not found");

    const ids = permissionIds.map(toBigInt);

    // validate permissions exist
    if (ids.length > 0) {
      const count = await prisma.permission.count({ where: { id: { in: ids } } });
      if (count !== ids.length) throw E.badRequest("Some permissionIds are invalid");
    }

    const before = await prisma.rolePermission.findMany({ where: { roleId } });

    await prisma.$transaction(async (tx) => {
      await tx.rolePermission.deleteMany({ where: { roleId } });
      if (ids.length > 0) {
        await tx.rolePermission.createMany({
          data: ids.map((pid) => ({ roleId, permissionId: pid })),
        });
      }
    });

    const after = await prisma.rolePermission.findMany({ where: { roleId } });

   
    return { ok: true };
  }
}
