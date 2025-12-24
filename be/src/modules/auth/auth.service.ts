import { prisma } from "../../db/prisma";
import { E } from "../../common/errors";
import { verifyPassword } from "../../common/password";
import {
  signAccessToken,
  signRefreshToken,
  hashToken,
  verifyRefreshToken,
} from "../../common/tokens";
import { env } from "../../config/env";


function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

export class AuthService {
  static async login(
    input: { email: string; password: string },
    ctx: { ip?: string | undefined; userAgent?: string | undefined }
  ) {
    const user = await prisma.user.findFirst({
      where: { email: input.email, deletedAt: null },
    });
    if (!user || !user.isActive) throw E.unauthorized("Invalid credentials");

    const okPwd = await verifyPassword(input.password, user.passwordHash);
    if (!okPwd) throw E.unauthorized("Invalid credentials");

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const accessToken = signAccessToken({
      sub: user.id.toString(),
      email: user.email,
    });
    const refreshToken = signRefreshToken({
      sub: user.id.toString(),
      email: user.email,
    });

    // ✅ FIX exactOptionalPropertyTypes: convert undefined => null
    const userAgent = ctx.userAgent ?? null;
    const ip = ctx.ip ?? null;

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(refreshToken),
        expiresAt: addDays(new Date(), env.REFRESH_TOKEN_TTL_DAYS),
        userAgent,
        ip,
      },
    });

    
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id.toString(),
        email: user.email,
        fullName: user.fullName,
      },
    };
  }

  static async refresh(
    input: { refreshToken: string },
    ctx: { ip?: string | undefined; userAgent?: string | undefined }
  ) {
    const payload = verifyRefreshToken(input.refreshToken);
    const userId = BigInt(payload.sub);

    const tokenHash = hashToken(input.refreshToken);
    const rt = await prisma.refreshToken.findUnique({ where: { tokenHash } });
    if (!rt || rt.revokedAt || rt.expiresAt < new Date())
      throw E.unauthorized("Refresh token invalid");

    const newAccess = signAccessToken({
      sub: userId.toString(),
      email: payload.email,
    });
    const newRefresh = signRefreshToken({
      sub: userId.toString(),
      email: payload.email,
    });

    await prisma.refreshToken.update({
      where: { id: rt.id },
      data: { revokedAt: new Date() },
    });

    const userAgent = ctx.userAgent ?? null;
    const ip = ctx.ip ?? null;

    await prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: hashToken(newRefresh),
        expiresAt: addDays(new Date(), env.REFRESH_TOKEN_TTL_DAYS),
        userAgent,
        ip,
      },
    });

    return { accessToken: newAccess, refreshToken: newRefresh };
  }

  static async logout(input: { refreshToken: string }) {
    await prisma.refreshToken.updateMany({
      where: { tokenHash: hashToken(input.refreshToken), revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { ok: true };
  }
}
