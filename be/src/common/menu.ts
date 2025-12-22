export type MenuItem = {
  key: string;
  label: string;
  path?: string;
  icon?: string;
  requiredAny?: string[];
  children?: MenuItem[];
};

export const MENU: MenuItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/",
    icon: "LayoutDashboard",
    requiredAny: [],
  },
  {
    key: "sales",
    label: "Sales",
    icon: "ShoppingCart",
    children: [
      {
        key: "customers",
        label: "Customers",
        path: "/sales/customers",
        requiredAny: ["sales.customer.read"],
      },
    ],
  },
  {
    key: "admin",
    label: "Admin",
    icon: "Shield",
    children: [
      {
        key: "users",
        label: "Users",
        path: "/admin/users",
        requiredAny: ["admin.user.read"],
      },
      {
        key: "roles",
        label: "Roles",
        path: "/admin/roles",
        requiredAny: ["admin.role.read"],
      },
    ],
  },
];

export function filterMenuByPerms(
  menu: MenuItem[],
  perms: Set<string>
): MenuItem[] {
  const allow = (requiredAny?: string[]) =>
    !requiredAny ||
    requiredAny.length === 0 ||
    requiredAny.some((p) => perms.has(p));

  const walk = (items: MenuItem[]): MenuItem[] => {
    const out: MenuItem[] = [];
    for (const item of items) {
      const children = item.children ? walk(item.children) : undefined;
      const ok = allow(item.requiredAny) || (children && children.length > 0);
      if (!ok) continue;
      out.push({ ...item, ...(children ? { children } : {}) });
    }
    return out;
  };
  return walk(menu);
}
