import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/modules/auth/components/ProtectedRoute";
import MainLayout from "@/components/layout/MainLayout";
import LoginView from "@/modules/auth/views/LoginView";
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

// Sales Orders
import { SalesOrdersDashboard } from "@/modules/sales-orders/views/SalesOrdersDashboard";
import { SalesOrdersList } from "@/modules/sales-orders/views/SalesOrdersList";
import { SalesOrdersDetail } from "@/modules/sales-orders/views/SalesOrdersDetail";
import { SalesOrdersForm } from "@/modules/sales-orders/views/SalesOrdersForm";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={URLS.LOGIN} element={<LoginView />} />
      <Route path={URLS.FORBIDDEN} element={<ForbiddenPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path={URLS.DASHBOARD} element={<Home />} />

          <Route path={URLS.SALES_CUSTOMERS} element={<Customers />} />
          <Route path="/sales/customers/:id" element={<CustomerDetail />} />
          <Route path={URLS.SALES_PRODUCTS} element={<Products />} />

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
            path={URLS.SALES_QUOTATIONS_CREATE}
            element={<QuotationForm />}
          />
          <Route path="/sales/quotations/:id" element={<QuotationDetail />} />
          <Route
            path="/sales/quotations/:id/edit"
            element={<QuotationForm />}
          />

          <Route path={URLS.FILES} element={<Files />} />
          <Route path={URLS.AUDIT_LOGS} element={<AuditLogs />} />
          <Route path={URLS.STATUS} element={<StatusHistory />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
