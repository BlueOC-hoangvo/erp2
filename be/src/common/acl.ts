import { prisma } from "../db/prisma";
//đây là phần phân quyền
export async function getUserPermissions(userId: bigint): Promise<Set<string>> {
  //láy toàn bộ quyền user
  const rows = await prisma.userRole.findMany({
    where: { userId },
    include: {
      role: { include: { permissions: { include: { permission: true } } } },
    },
  });

  const perms = new Set<string>();
  for (const ur of rows) {
    for (const rp of ur.role.permissions) {
      perms.add(rp.permission.code);
    }
  }
  return perms;
}
//hàm này xác định user hiện tại đc làm gì trong hệ thống, trả vể perm
//phục vụ API guard , menu , UI logic
