import bcrypt from "bcrypt";
import { prisma } from "../../db/prisma";
import { E } from "../../common/errors";


const SALT_ROUNDS = 10;

const toBigInt = (id: string) => {
  try {
    return BigInt(id);
  } catch {
    throw E.badRequest("Invalid id");
  }
};

export class UsersService {
  static async list(query: any) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100);
    const q = query.q?.trim();

    const where: any = { deletedAt: null };
    if (q) {
      where.OR = [
        { email: { contains: q } },
        { fullName: { contains: q } },
      ];
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          roles: { include: { role: true } },
        },
      }),
    ]);

    return {
      data: users.map((u) => ({
        id: u.id.toString(),
        email: u.email,
        fullName: u.fullName,
        isActive: u.isActive,
        createdAt: u.createdAt,
        roles: u.roles.map((r) => ({
          id: r.role.id.toString(),
          code: r.role.code,
          name: r.role.name,
        })),
      })),
      meta: { page, limit, total },
    };
  }

  static async create(input: any, actorUserId: bigint) {
    const exists = await prisma.user.findUnique({ where: { email: input.email } });
    if (exists) throw E.conflict("Email already exists");

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    const roleIds = input.roleIds.map(toBigInt);

    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email: input.email,
          fullName: input.fullName,
          passwordHash,
          isActive: input.isActive ?? true,
        },
      });

      await tx.userRole.createMany({
        data: roleIds.map((rid: bigint) => ({
          userId: created.id,
          roleId: rid,
        })),
      });

      return created;
    });

    

    return { id: user.id.toString() };
  }

  static async update(id: bigint, input: any, actorUserId: bigint) {
    const before = await prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: { roles: true },
    });
    if (!before) throw E.notFound("User not found");

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id },
        data: {
          ...(input.fullName && { fullName: input.fullName }),
          ...(input.isActive !== undefined && { isActive: input.isActive }),
        },
      });

      if (input.roleIds) {
        await tx.userRole.deleteMany({ where: { userId: id } });
        await tx.userRole.createMany({
          data: input.roleIds.map((rid: string) => ({
            userId: id,
            roleId: toBigInt(rid),
          })),
        });
      }
    });

   
    return { ok: true };
  }

  static async resetPassword(id: bigint, password: string, actorUserId: bigint) {
    const user = await prisma.user.findFirst({ where: { id, deletedAt: null } });
    if (!user) throw E.notFound("User not found");

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    await prisma.user.update({
      where: { id },
      data: { passwordHash },
    });

   

    return { ok: true };
  }

  static async remove(id: bigint, actorUserId: bigint) {
    const user = await prisma.user.findFirst({ where: { id, deletedAt: null } });
    if (!user) throw E.notFound("User not found");

    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });

    

    return { ok: true };
  }
}
