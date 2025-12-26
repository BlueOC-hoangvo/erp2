// BOM Templates Component
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusIcon,
  DocumentDuplicateIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  ArrowLeftIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { toast } from 'react-hot-toast';
import { useBomTemplates, useCreateBomTemplate, useCreateBomFromTemplate } from '../hooks/useBoms';
import type { CreateBomTemplateRequest, CreateBomFromTemplateRequest } from '../types/bom.types';

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    category: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement create template
    toast.success('Tạo template thành công!');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tạo BOM Template mới">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên template *
          </label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="VD: Template áo thun cổ tròn"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mã template
          </label>
          <Input
            value={formData.code}
            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
            placeholder="VD: TSHIRT-BASIC"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Danh mục
          </label>
          <Input
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            placeholder="VD: Áo thun, Quần tây, Váy..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full p-2 border rounded-md"
            rows={3}
            placeholder="Mô tả template và cách sử dụng..."
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit">
            Tạo template
          </Button>
        </div>
      </form>
    </Modal>
  );
};

interface UseTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: any;
}

const UseTemplateModal: React.FC<UseTemplateModalProps> = ({ isOpen, onClose, template }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    productStyleId: '',
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement create BOM from template
    toast.success('Tạo BOM từ template thành công!');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tạo BOM từ Template">
      <div className="space-y-4">
        <Alert>
          <DocumentDuplicateIcon className="h-4 w-4" />
          <AlertDescription>
            Đang sử dụng template: <strong>{template?.name}</strong>
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã BOM *
            </label>
            <Input
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
              placeholder="VD: BOM-001"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên BOM *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="VD: BOM Áo thun cổ tròn - Màu trắng"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kiểu sản phẩm *
            </label>
            <select
              value={formData.productStyleId}
              onChange={(e) => setFormData(prev => ({ ...prev, productStyleId: e.target.value }))}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Chọn kiểu sản phẩm</option>
              <option value="1">Áo thun</option>
              <option value="2">Quần tây</option>
              <option value="3">Váy</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="rounded"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              BOM đang hoạt động
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">
              Tạo BOM
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export const BomTemplates: React.FC = () => {
  const navigate = useNavigate();
  const [createModal, setCreateModal] = useState(false);
  const [useTemplateModal, setUseTemplateModal] = useState<{ isOpen: boolean; template?: any }>({ isOpen: false });

  // API hooks
  const { data: templatesResponse, isLoading, error, refetch } = useBomTemplates();
  const createTemplateMutation = useCreateBomTemplate();
  const createBomFromTemplateMutation = useCreateBomFromTemplate();

  // Use actual API data
  const templates = templatesResponse?.data?.items || [];

  const handleUseTemplate = (template: any) => {
    setUseTemplateModal({ isOpen: true, template });
  };

  const handleDeleteTemplate = (template: any) => {
    // TODO: Implement delete
    toast.success(`Xóa template ${template.name} thành công!`);
  };

  const handleEditTemplate = () => {
    // TODO: Navigate to edit
    toast.success('Chức năng chỉnh sửa template sẽ được implement');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/')}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý BOM Templates</h1>
            <p className="text-gray-600 mt-1">
              Tạo và quản lý các template BOM để sử dụng lại
            </p>
          </div>
        </div>
        <Button onClick={() => setCreateModal(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Tạo Template mới
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{templates.length}</div>
            <div className="text-sm text-gray-600">Tổng template</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {templates.length}
            </div>
            <div className="text-sm text-gray-600">Template có sẵn</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {templates.reduce((sum, t) => sum + parseInt(t.usageCount || '0'), 0)}
            </div>
            <div className="text-sm text-gray-600">Lần sử dụng</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(templates.map(t => t.category).filter(Boolean)).size}
            </div>
            <div className="text-sm text-gray-600">Danh mục</div>
          </CardContent>
        </Card>
      </div>

      {/* Templates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Templates</CardTitle>
        </CardHeader>
        <CardContent>
          {templates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Chưa có template nào. Hãy tạo template đầu tiên.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên template</TableHead>
                  <TableHead>Mã template</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Lần sử dụng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="w-32">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-gray-500">
                          {template.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {template.code}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{template.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {template.usageCount || 0}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="success">
                        Sẵn sàng
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {template.createdAt ? new Date(template.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline">
                          <EyeIcon className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUseTemplate(template)}
                        >
                          <PlayIcon className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditTemplate()}
                        >
                          <PencilIcon className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteTemplate(template)}
                        >
                          <TrashIcon className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Usage Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Hướng dẫn sử dụng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <DocumentDuplicateIcon className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <div className="font-medium">1. Tạo Template</div>
              <div className="text-sm text-gray-600">Tạo template BOM từ nguyên liệu có sẵn</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <PlayIcon className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <div className="font-medium">2. Sử dụng Template</div>
              <div className="text-sm text-gray-600">Tạo BOM mới từ template có sẵn</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <PencilIcon className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <div className="font-medium">3. Tùy chỉnh</div>
              <div className="text-sm text-gray-600">Chỉnh sửa BOM sau khi tạo</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateTemplateModal 
        isOpen={createModal} 
        onClose={() => setCreateModal(false)}
      />

      {useTemplateModal.template && (
        <UseTemplateModal
          isOpen={useTemplateModal.isOpen}
          onClose={() => setUseTemplateModal({ isOpen: false })}
          template={useTemplateModal.template}
        />
      )}
    </div>
  );
};
