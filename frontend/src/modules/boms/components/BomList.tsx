


// BOM List Component
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
  ClockIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu';
import { Modal } from '@/components/ui/Modal';
import { useBoms, useDeleteBom } from '../hooks/useBoms';
import type { BomListParams } from '../types/bom.types';
import { urls } from '@/routes/urls';

interface BomListProps {
  onCreate?: () => void;
  onEdit?: (bom: any) => void;
  onView?: (bom: any) => void;
}

export const BomList: React.FC<BomListProps> = ({ onCreate, onEdit, onView }) => {
  const navigate = useNavigate();
  const [params, setParams] = useState<BomListParams>({
    page: 1,
    pageSize: 20,
    q: '',
    isActive: undefined
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; bom?: any }>({ isOpen: false });

  const { data: bomResponse, isLoading, error } = useBoms(params);
  const deleteMutation = useDeleteBom();

  const handleSearch = () => {
    setParams(prev => ({ ...prev, q: searchTerm, page: 1 }));
  };

  const handleFilterChange = (key: keyof BomListParams, value: any) => {
    setParams(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setParams(prev => ({ ...prev, page }));
  };

  const handleDelete = async () => {
    if (deleteModal.bom) {
      try {
        await deleteMutation.mutateAsync(deleteModal.bom.id);
        setDeleteModal({ isOpen: false });
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleViewBom = (bom: any) => {
    if (onView) {
      onView(bom);
    } else {
      navigate(`${urls.BOMS_DETAIL(bom.id)}`);
    }
  };

  const handleEditBom = (bom: any) => {
    if (onEdit) {
      onEdit(bom);
    } else {
      navigate(urls.BOMS_EDIT(bom.id));
    }
  };

  const handleCreateBom = () => {
    if (onCreate) {
      onCreate();
    } else {
      navigate(urls.BOMS_CREATE);
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          Có lỗi xảy ra khi tải danh sách BOM: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý BOM</h1>
          <p className="text-gray-600 mt-1">
            Quản lý danh sách công thức sản xuất (BOM - Bill of Materials)
          </p>
        </div>
        <Button onClick={handleCreateBom} className="flex items-center gap-2">
          <PlusIcon className="w-4 h-4" />
          Tạo BOM mới
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Input
              placeholder="Tìm kiếm BOM..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSearch()}
              className="pr-10"
            />
            <MagnifyingGlassIcon 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer"
              onClick={handleSearch}
            />
          </div>

          {/* Status Filter */}
          <Select
            value={params.isActive?.toString() || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange('isActive', 
              e.target.value === '' ? undefined : e.target.value === 'true'
            )}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="true">Đang hoạt động</option>
            <option value="false">Không hoạt động</option>
          </Select>

          {/* Page Size */}
          <Select
            value={params.pageSize?.toString() || '20'}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange('pageSize', Number(e.target.value))}
          >
            <option value="10">10 dòng</option>
            <option value="20">20 dòng</option>
            <option value="50">50 dòng</option>
            <option value="100">100 dòng</option>
          </Select>

          {/* Clear Filters */}
          <Button 
            variant="outline" 
            onClick={() => {
              setParams({ page: 1, pageSize: 20, q: '', isActive: undefined });
              setSearchTerm('');
            }}
          >
            Xóa bộ lọc
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã BOM</TableHead>
              <TableHead>Tên BOM</TableHead>
              <TableHead>Kiểu sản phẩm</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Số dòng</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="w-20">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Đang tải...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : bomResponse?.data?.items?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Chưa có BOM nào
                </TableCell>
              </TableRow>
            ) : (
              bomResponse?.data?.items?.map((bom: any) => (
                <TableRow key={bom.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{bom.code || 'N/A'}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{bom.name}</div>
                      <div className="text-sm text-gray-500">{bom.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {bom.productStyle ? (
                      <div>
                        <div className="font-medium">{bom.productStyle.name}</div>
                        <div className="text-sm text-gray-500">{bom.productStyle.code}</div>
                      </div>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={bom.isActive ? 'success' : 'secondary'}>
                      {bom.isActive ? 'Hoạt động' : 'Không hoạt động'}
                    </Badge>
                  </TableCell>
                  <TableCell>{bom.lines?.length || 0} dòng</TableCell>
                  <TableCell>
                    {bom.createdAt ? new Date(bom.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <span className="sr-only">Mở menu</span>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewBom(bom)}>
                          <ChartBarIcon className="w-4 h-4 mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditBom(bom)}>
                          <PencilIcon className="w-4 h-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`${urls.BOMS_DETAIL(bom.id)}/explosion`)}>
                          <CogIcon className="w-4 h-4 mr-2" />
                          Explosion
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`${urls.BOMS_DETAIL(bom.id)}/cost`)}>
                          <ChartBarIcon className="w-4 h-4 mr-2" />
                          Phân tích chi phí
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`${urls.BOMS_VERSIONS(bom.id)}`)}>
                          <ClockIcon className="w-4 h-4 mr-2" />
                          Quản lý phiên bản
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeleteModal({ isOpen: true, bom })}>
                          <TrashIcon className="w-4 h-4 mr-2 text-red-600" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {bomResponse?.data && bomResponse.data.total > 0 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Hiển thị {((bomResponse.data.page - 1) * bomResponse.data.pageSize) + 1} - {Math.min(bomResponse.data.page * bomResponse.data.pageSize, bomResponse.data.total)} của {bomResponse.data.total} kết quả
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(bomResponse.data.page - 1)}
                disabled={bomResponse.data.page === 1}
              >
                Trước
              </Button>
              <span className="text-sm text-gray-700">
                Trang {bomResponse.data.page} / {Math.ceil(bomResponse.data.total / bomResponse.data.pageSize)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(bomResponse.data.page + 1)}
                disabled={bomResponse.data.page >= Math.ceil(bomResponse.data.total / bomResponse.data.pageSize)}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        title="Xác nhận xóa BOM"
      >
        <div className="space-y-4">
          <p>
            Bạn có chắc chắn muốn xóa BOM <strong>{deleteModal.bom?.name}</strong> không?
          </p>
          <p className="text-sm text-red-600">
            Hành động này không thể hoàn tác và sẽ xóa tất cả các phiên bản BOM liên quan.
          </p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false })}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
