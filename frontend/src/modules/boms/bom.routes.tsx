// BOM Routes Configuration - React Router setup cho BOM module
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from '@/hooks/useAuth'; // TODO: Uncomment when auth hook is available
import { BomList } from './components/BomList';
import { BomForm } from './components/BomForm';
import { BomDetail } from './components/BomDetail';
import { BomExplosion } from './components/BomExplosion';
import { BomCostAnalysis } from './components/BomCostAnalysis';
import { BomVersion } from './components/BomVersion';
import { BomComparison } from './components/BomComparison';
import { BomTemplates } from './components/BomTemplates';

// Layout component for BOM pages
const BomLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
};

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // TODO: Add auth checking when auth hook is available
  // const { user, isLoading } = useAuth();
  
  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  //       <span className="ml-2">Đang xác thực...</span>
  //     </div>
  //   );
  // }

  // if (!user) {
  //   return <Navigate to="/login" replace />;
  // }

  // TODO: Add permission checking when RBAC is implemented
  // if (requiredPermission && !hasPermission(user, requiredPermission)) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return <>{children}</>;
};

// Loading component
// const BomLoading: React.FC = () => (
//   <div className="p-6">
//     <div className="flex justify-center">
//       <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
//       <span className="ml-2">Đang tải...</span>
//     </div>
//   </div>
// );

// Error boundary component
const BomErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError] = React.useState(false);

  if (hasError) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-4">Không thể tải trang BOM. Vui lòng thử lại.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export const BomRoutes: React.FC = () => {
  return (
    <BomErrorBoundary>
      <Routes>
        {/* Main BOM list */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <BomLayout>
                <BomList />
              </BomLayout>
            </ProtectedRoute>
          }
        />

        {/* BOM Templates */}
        <Route
          path="/templates"
          element={
            <ProtectedRoute>
              <BomLayout>
                <BomTemplates />
              </BomLayout>
            </ProtectedRoute>
          }
        />

        {/* Create new BOM */}
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <BomLayout>
                <BomForm mode="create" />
              </BomLayout>
            </ProtectedRoute>
          }
        />

        {/* BOM detail with tabs */}
        <Route
          path="/:id"
          element={
            <ProtectedRoute>
              <BomLayout>
                <BomDetail />
              </BomLayout>
            </ProtectedRoute>
          }
        >
          {/* Nested routes for BOM detail tabs */}
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<div className="p-6">Overview tab</div>} />
          <Route path="lines" element={<div className="p-6">Lines tab</div>} />
          <Route path="versions" element={<div className="p-6">Versions tab</div>} />
          <Route path="cost" element={<div className="p-6">Cost tab</div>} />
        </Route>

        {/* Edit BOM */}
        <Route
          path="/:id/edit"
          element={
            <ProtectedRoute>
              <BomLayout>
                <BomForm mode="edit" />
              </BomLayout>
            </ProtectedRoute>
          }
        />

        {/* BOM Explosion */}
        <Route
          path="/:id/explosion"
          element={
            <ProtectedRoute>
              <BomLayout>
                <BomExplosion />
              </BomLayout>
            </ProtectedRoute>
          }
        />

        {/* BOM Cost Analysis */}
        <Route
          path="/:id/cost"
          element={
            <ProtectedRoute>
              <BomLayout>
                <BomCostAnalysis />
              </BomLayout>
            </ProtectedRoute>
          }
        />

        {/* BOM Version Management */}
        <Route
          path="/:id/versions"
          element={
            <ProtectedRoute>
              <BomLayout>
                <BomVersion />
              </BomLayout>
            </ProtectedRoute>
          }
        />

        {/* BOM Version Comparison */}
        <Route
          path="/versions/compare/:versionId1/:versionId2"
          element={
            <ProtectedRoute>
              <BomLayout>
                <BomComparison />
              </BomLayout>
            </ProtectedRoute>
          }
        />

        {/* Copy BOM from existing */}
        <Route
          path="/copy/:id"
          element={
            <ProtectedRoute>
              <BomLayout>
                <BomForm mode="create" />
              </BomLayout>
            </ProtectedRoute>
          }
        />

        {/* Redirect old routes to new structure */}
        <Route path="/list" element={<Navigate to="/" replace />} />
        <Route path="/add" element={<Navigate to="/create" replace />} />
        <Route path="/detail/:id" element={<Navigate to="/:id" replace />} />
        <Route path="/edit/:id" element={<Navigate to="/:id/edit" replace />} />

        {/* 404 handling */}
        <Route
          path="*"
          element={
            <div className="p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Trang không tồn tại</h2>
                <p className="text-gray-600 mb-4">
                  Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển.
                </p>
                <button
                  onClick={() => window.history.back()}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
                >
                  Quay lại
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Về trang chủ
                </button>
              </div>
            </div>
          }
        />
      </Routes>
    </BomErrorBoundary>
  );
};

// Convenience route creators
export const bomRoutes = {
  home: '/boms',
  list: '/boms',
  create: '/boms/create',
  detail: (id: string) => `/boms/${id}`,
  edit: (id: string) => `/boms/${id}/edit`,
  explosion: (id: string) => `/boms/${id}/explosion`,
  cost: (id: string) => `/boms/${id}/cost`,
  versions: (id: string) => `/boms/${id}/versions`,
  comparison: (versionId1: string, versionId2: string) => 
    `/boms/versions/compare/${versionId1}/${versionId2}`,
  copy: (id: string) => `/boms/copy/${id}`,
  templates: '/boms/templates',
};

// Breadcrumb helper
export const getBomBreadcrumbs = (pathname: string) => {
  const breadcrumbs = [
    { name: 'BOM', href: '/boms' }
  ];

  const segments = pathname.split('/').filter(Boolean);
  
  if (segments.length >= 2) {
    switch (segments[1]) {
      case 'create':
        breadcrumbs.push({ name: 'Tạo BOM mới', href: '/boms/create' });
        break;
      case 'templates':
        breadcrumbs.push({ name: 'Templates', href: '/boms/templates' });
        break;
      case 'versions':
        if (segments.length >= 4 && segments[2] === 'compare') {
          breadcrumbs.push({ name: 'So sánh phiên bản', href: pathname });
        }
        break;
      default:
        if (segments[1].match(/^\d+$/)) {
          const bomId = segments[1];
          breadcrumbs.push({ name: `BOM ${bomId}`, href: `/boms/${bomId}` });
          
          if (segments.length >= 3) {
            switch (segments[2]) {
              case 'edit':
                breadcrumbs.push({ name: 'Chỉnh sửa', href: pathname });
                break;
              case 'explosion':
                breadcrumbs.push({ name: 'BOM Explosion', href: pathname });
                break;
              case 'cost':
                breadcrumbs.push({ name: 'Phân tích chi phí', href: pathname });
                break;
              case 'versions':
                breadcrumbs.push({ name: 'Quản lý phiên bản', href: pathname });
                break;
              default:
                breadcrumbs.push({ name: 'Chi tiết', href: pathname });
                break;
            }
          }
        }
        break;
    }
  }

  return breadcrumbs;
};

export default BomRoutes;
