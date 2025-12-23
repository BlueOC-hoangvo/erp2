import {
  DashboardOutlined,
  TeamOutlined,
  FileOutlined,
  SafetyCertificateOutlined,
  SwapOutlined,
  ShopOutlined,
  TruckOutlined,
  BankOutlined,
  BuildOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { URLS } from "@/routes/urls";
import { PERMS } from "./roles";

export type AppMenuItem = Required<MenuProps>["items"][number] & {
  path?: string;
  permission?: string;
  children?: AppMenuItem[];
};

export const MENU_VI: AppMenuItem[] = [
  {
    key: "dashboard",
    icon: <DashboardOutlined />,
    label: "Dashboard",
    path: URLS.DASHBOARD,
  },
  {
    key: "sales",
    icon: <TeamOutlined />,
    label: "Bán hàng",
    children: [
      {
        key: "customers",
        label: "Khách hàng",
        path: URLS.SALES_CUSTOMERS,
      },
      {
        key: "orders",
        label: "Đơn hàng",
        path: URLS.SALES_ORDERS,
      },
      { key: "quotations", label: "Báo giá", path: URLS.SALES_QUOTATIONS },
      {
        key: "campaigns",
        label: "Chiến dịch marketing",
        path: URLS.SALES_CAMPAIGNS,
      },
      {
        key: "products",
        label: "Sản phẩm",
        path: URLS.SALES_PRODUCTS,
      },
    ],
  },
  {
    key: "production",
    icon: <BuildOutlined />,
    label: "Sản xuất",
    children: [
      {
        key: "mo",
        label: "Lệnh sản xuất (MO)",
        path: URLS.PRODUCTION_ORDERS,
      },
      {
        key: "production-plan",
        label: "Kế hoạch sản xuất",
        path: "/production/plan",
      },
      {
        key: "production-params",
        label: "Thông số sản xuất",
        path: "/production/params",
      },
      {
        key: "production-resources",
        label: "Nguồn lực sản xuất",
        path: "/production/resources",
      },
    ],
  },
  {
    key: "warehouse",
    icon: <BankOutlined />,
    label: "Quản lý kho",
    children: [
      {
        key: "warehouse-products",
        label: "Quản lý sản phẩm/NVL",
        path: "/warehouse/products",
      },
      {
        key: "warehouse-in",
        label: "Quản lý nhập kho",
        path: "/warehouse/in",
      },
      {
        key: "warehouse-out",
        label: "Quản lý xuất kho",
        path: "/warehouse/out",
      },
      {
        key: "warehouse-areas",
        label: "Quản lý khu vực kho",
        path: "/warehouse/areas",
      },
      {
        key: "warehouse-params",
        label: "Thông số kho",
        path: "/warehouse/params",
      },
    ],
  },
  {
    key: "shipping",
    icon: <TruckOutlined />,
    label: "Vận chuyển",
    children: [
      {
        key: "shipping-orders",
        label: "Đơn vận chuyển",
        path: "/shipping/orders",
      },
      {
        key: "shipping-plans",
        label: "Kế hoạch vận chuyển",
        path: "/shipping/plans",
      },
      {
        key: "shipping-partners",
        label: "Đối tác vận chuyển",
        path: "/shipping/partners",
      },
      {
        key: "shipping-vehicles",
        label: "Phương tiện",
        path: "/shipping/vehicles",
      },
    ],
  },
  {
    key: "files",
    icon: <FileOutlined />,
    label: "Tệp tin",
    path: URLS.FILES,
  },
  {
    key: "system",
    icon: <SafetyCertificateOutlined />,
    label: "Hệ thống",
    children: [
      {
        key: "audit",
        label: "Nhật ký hoạt động",
        path: URLS.AUDIT_LOGS,
      },
      {
        key: "status",
        icon: <SwapOutlined />,
        label: "Trạng thái & Lịch sử",
        path: URLS.STATUS,
      },
    ],
  },
];
