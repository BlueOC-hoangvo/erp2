import { prisma } from "../../db/prisma";
import { getUserPermissions } from "../../common/acl";
import { MENU, filterMenuByPerms } from "../../common/menu";

export class MeService {
  static async getMe(userId: bigint) {
    //lấy thoong tin cơ bản user
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return {
      id: user!.id.toString(),
      email: user!.email,
      fullName: user!.fullName,
    };
  }

  static async getPermissions(userId: bigint) {
    //láy toàn bộ permission của user
    const perms = await getUserPermissions(userId);
    return Array.from(perms);
  }

  static async getMenu(userId: bigint) {
    //lọc menu theo quyền
    const perms = await getUserPermissions(userId);
    return filterMenuByPerms(MENU, perms);
  }
}
//fe sẽ gọi 3 hàm này sau khi login/refresh token
