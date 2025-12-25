import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/modules/auth/components/ProtectedRoute";
import MainLayout from "@/components/layout/MainLayout";
import { LoginPage } from "@/modules/auth/pages/LoginPage";
import ForbiddenPage from "@/components/error/403";
import NotFoundPage from "@/components/error/404";
import { URLS } from "./urls";

import Home from "@/modules/home/views/Home";
import Customers from "@/modules/customers/views/Customers";
import CustomerDetail from "@/modules/customers/views/CustomerDetail";
import Products from "@/modules/products/views/Products";
import Files from "@/modules/files/views/Files";
import AuditLogs from "@/modules/audit-logs/views/AuditLogs";
import StatusHistory from "@/modules/status/views/StatusHistory";
import QuotationsList from "@/modules/quotations/views/QuotationsList";
import QuotationDetail from "@/modules/quotations/views/QuotationDetail";
import QuotationForm from "@/modules/quotations/views/QuotationForm";
import CampaignsList from "@/modules/campaigns/views/CampaignsList";
import CampaignForm from "@/modules/campaigns/views/CampaignForm";
import CampaignDetail from "@/modules/campaigns/views/CampaignDetail";
import ProductionOrdersList from "@/modules/production-orders/views/ProductionOrdersList";
import { ProductionOrdersDetail } from "@/modules/production-orders/views/ProductionOrdersDetail";
import ProductionOrderForm from "@/modules/production-orders/views/ProductionOrderForm";

// Production modules
import { ProductionPlansList } from "@/modules/production-plans/views/ProductionPlansList";
import { ProductionPlansDetail } from "@/modules/production-plans/views/ProductionPlansDetail";
import { ProductionParamsList } from "@/modules/production-params/views/ProductionParamsList";
import { ProductionResourcesList } from "@/modules/production-resources/views/ProductionResourcesList";

// Warehouse modules
import { WarehouseProductsList } from "@/modules/warehouse-products/views/WarehouseProductsList";
import { WarehouseInList } from "@/modules/warehouse-in/views/WarehouseInList";
import WarehouseOutList from "@/modules/warehouse-out/views/WarehouseOutList";

// Sales Orders
import { SalesOrdersDashboard } from "@/modules/sales-orders/views/SalesOrdersDashboard";
import { SalesOrdersList } from "@/modules/sales-orders/views/SalesOrdersList";
import { SalesOrdersDetail } from "@/modules/sales-orders/views/SalesOrdersDetail";
import { SalesOrdersForm } from "@/modules/sales-orders/views/SalesOrdersForm";

// Purchasing modules
import SuppliersList from "@/modules/purchasing/views/SuppliersList";
import PurchaseOrdersList from "@/modules/purchasing/views/PurchaseOrdersList";
import PurchasingDashboard from "@/modules/purchasing/views/PurchasingDashboard";

// Accounting modules
import JournalEntriesList from "@/modules/accounting/views/JournalEntriesList";
import AccountingDashboard from "@/modules/accounting/views/AccountingDashboard";

// Product Management modules
import ProductStyles from "@/modules/product-styles/views/ProductStyles";
import Colors from "@/modules/product-styles/views/Colors";
import Sizes from "@/modules/product-styles/views/Sizes";
import ProductVariants from "@/modules/product-styles/views/ProductVariants";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={URLS.LOGIN} element={<LoginPage />} />
      <Route path={URLS.FORBIDDEN} element={<ForbiddenPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path={URLS.DASHBOARD} element={<Home />} />

          <Route path={URLS.SALES_CUSTOMERS} element={<Customers />} />
          <Route path="/sales/customers/:id" element={<CustomerDetail />} />
          <Route path={URLS.SALES_PRODUCTS} element={<Products />} />

          <Route
            path={URLS.PRODUCTION_ORDERS}
            element={<ProductionOrdersList />}
          />
          <Route
            path="/production/orders/:id"
            element={<ProductionOrdersDetail />}
          />
          <Route
            path="/production/orders/create"
            element={<ProductionOrderForm />}
          />

          {/* Production modules */}
          <Route path={URLS.PRODUCTION_PLANS} element={<ProductionPlansList />} />
          <Route path="/production/plans/:id" element={<ProductionPlansDetail />} />
          <Route path={URLS.PRODUCTION_PARAMS} element={<ProductionParamsList />} />
          <Route path={URLS.PRODUCTION_RESOURCES} element={<ProductionResourcesList />} />

          {/* Warehouse modules */}
          <Route path={URLS.WAREHOUSE_PRODUCTS} element={<WarehouseProductsList />} />
          <Route path={URLS.WAREHOUSE_IN} element={<WarehouseInList />} />
          <Route path={URLS.WAREHOUSE_OUT} element={<WarehouseOutList />} />

          {/* Purchasing modules */}
          <Route path="/purchasing/dashboard" element={<PurchasingDashboard />} />
          <Route path="/purchasing/suppliers" element={<SuppliersList />} />
          <Route path="/purchasing/orders" element={<PurchaseOrdersList />} />

          {/* Accounting modules */}
          <Route path="/accounting/dashboard" element={<AccountingDashboard />} />
          <Route path="/accounting/journal-entries" element={<JournalEntriesList />} />

          <Route path={URLS.SALES_ORDERS} element={<SalesOrdersList />} />
          <Route
            path="/sales-orders/dashboard"
            element={<SalesOrdersDashboard />}
          />
          <Route path="/sales-orders/create" element={<SalesOrdersForm />} />
          <Route path="/sales-orders/:id" element={<SalesOrdersDetail />} />
          <Route path="/sales-orders/:id/edit" element={<SalesOrdersForm />} />
          <Route path={URLS.SALES_CAMPAIGNS} element={<CampaignsList />} />
          <Route
            path={URLS.SALES_CAMPAIGNS_CREATE}
            element={<CampaignForm />}
          />
          <Route path="/sales/campaigns/:id" element={<CampaignDetail />} />
          <Route path="/sales/campaigns/:id/edit" element={<CampaignForm />} />

          <Route path={URLS.SALES_QUOTATIONS} element={<QuotationsList />} />
          <Route
            path={URLS.SALES_QUOTATION_CREATE}
            element={<QuotationForm />}
          />
          <Route path="/sales/quotations/:id" element={<QuotationDetail />} />
          <Route
            path="/sales/quotations/:id/edit"
            element={<QuotationForm />}
          />

          {/* Product Management routes */}
          <Route path={URLS.PRODUCT_STYLES} element={<ProductStyles />} />
          <Route path={URLS.COLORS} element={<Colors />} />
          <Route path={URLS.SIZES} element={<Sizes />} />
          <Route path={URLS.PRODUCT_VARIANTS} element={<ProductVariants />} />

          <Route path={URLS.FILES} element={<Files />} />
          <Route path={URLS.AUDIT_LOGS} element={<AuditLogs />} />
          <Route path={URLS.STATUS} element={<StatusHistory />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
