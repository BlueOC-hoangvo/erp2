// BOM Version Component - Quản lý phiên bản BOM với approval workflow
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  ClockIcon,
  PlusIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  PencilIcon,
  DocumentArrowDownIcon,
  UserGroupIcon,
  InformationCircleIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { toast } from 'react-hot-toast';
import { 
  useCurrentBomVersion,
  useCreateBomVersion,
  useSubmitForApproval,
  useApproveVersion,
  useRejectVersion
} from '../hooks/useBoms';
import { urls } from '@/routes/urls';
import { bomUtils } from '../api/bom.api';

interface CreateVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  bomId: string;
}

const CreateVersionModal: React.FC<CreateVersionModalProps> = ({ isOpen, onClose, bomId }) => {
  const [formData, setFormData] = useState({
    versionNo: '',
    description: '',
    effectiveFrom: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createVersionMutation = useCreateBomVersion();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await createVersionMutation.mutateAsync({
        bomId,
        data: {
          versionNo: formData.versionNo,
          description: formData.description,
          effectiveFrom: formData.effectiveFrom || undefined,
          createdById: '1' // TODO: Get from auth
        }
      });
      
      toast.success('Tạo phiên bản thành công!');
      setFormData({ versionNo: '', description: '', effectiveFrom: '' });
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tạo phiên bản BOM mới">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số phiên bản *
          </label>
          <Input
            value={formData.versionNo}
            onChange={(e) => setFormData(prev => ({ ...prev, versionNo: e.target.value }))}
            placeholder="VD: v1.1, v2.0, 2024.1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả thay đổi
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Mô tả các thay đổi trong phiên bản này..."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ngày hiệu lực
          </label>
          <Input
            type="date"
            value={formData.effectiveFrom}
            onChange={(e) => setFormData(prev => ({ ...prev, effectiveFrom: e.target.value }))}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Đang tạo...' : 'Tạo phiên bản'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  versionId: string;
  action: 'submit' | 'approve' | 'reject';
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({ isOpen, onClose, versionId, action }) => {
  const [comments, setComments] = useState('');
  const [approvers, setApprovers] = useState<string[]>([]);

  const submitMutation = useSubmitForApproval();
  const approveMutation = useApproveVersion();
  const rejectMutation = useRejectVersion();

  const mockApprovers = [
    { id: '1', name: 'Nguyễn Văn A', role: 'Production Manager' },
    { id: '2', name: 'Trần Thị B', role: 'Quality Manager' },
    { id: '3', name: 'Lê Văn C', role: 'Engineering Manager' },
  ];

  const handleSubmit = async () => {
    try {
      switch (action) {
        case 'submit':
          if (approvers.length === 0) {
            toast.error('Vui lòng chọn ít nhất 1 người phê duyệt');
            return;
          }
          await submitMutation.mutateAsync({
            versionId,
            data: { approvers }
          });
          toast.success('Gửi phê duyệt thành công!');
          break;
        case 'approve':
          await approveMutation.mutateAsync({
            versionId,
            data: { comments }
          });
          toast.success('Phê duyệt thành công!');
          break;
        case 'reject':
          await rejectMutation.mutateAsync({
            versionId,
            data: { comments }
          });
          toast.success('Từ chối thành công!');
          break;
      }
      onClose();
      setComments('');
      setApprovers([]);
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra');
    }
  };

  const getTitle = () => {
    switch (action) {
      case 'submit': return 'Gửi phê duyệt';
      case 'approve': return 'Phê duyệt phiên bản';
      case 'reject': return 'Từ chối phiên bản';
    }
  };

  const getButtonText = () => {
    switch (action) {
      case 'submit': return 'Gửi phê duyệt';
      case 'approve': return 'Phê duyệt';
      case 'reject': return 'Từ chối';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()}>
      <div className="space-y-4">
        {action === 'submit' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn người phê duyệt *
            </label>
            <div className="space-y-2">
              {mockApprovers.map(approver => (
                <label key={approver.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={approvers.includes(approver.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setApprovers(prev => [...prev, approver.id]);
                      } else {
                        setApprovers(prev => prev.filter(id => id !== approver.id));
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">
                    {approver.name} - {approver.role}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ghi chú {action !== 'submit' ? '(tùy chọn)' : ''}
          </label>
          <Textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder={
              action === 'approve' 
                ? 'Ghi chú khi phê duyệt...' 
                : action === 'reject'
                ? 'Lý do từ chối...'
                : 'Ghi chú khi gửi phê duyệt...'
            }
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button 
            onClick={handleSubmit}
            variant={action === 'reject' ? 'destructive' : 'default'}
            disabled={submitMutation.isPending || approveMutation.isPending || rejectMutation.isPending}
          >
            {getButtonText()}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export const BomVersion: React.FC = () => {
  const { id: bomId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [createModal, setCreateModal] = useState(false);
  const [approvalModal, setApprovalModal] = useState<{
    isOpen: boolean;
    action: 'submit' | 'approve' | 'reject';
    versionId?: string;
  }>({ isOpen: false, action: 'submit' });

  // Mock data - Replace with actual API calls
  const mockVersions = [
    {
      id: '1',
      versionNo: 'v1.0',
      description: 'Phiên bản đầu tiên',
      status: 'APPROVED',
      isCurrent: true,
      createdAt: '2024-01-15T10:00:00Z',
      approvedAt: '2024-01-16T14:30:00Z',
      createdBy: { name: 'Nguyễn Văn A' },
      approvedBy: { name: 'Trần Thị B' },
      approvals: [
        { id: '1', approver: { name: 'Trần Thị B' }, status: 'APPROVED', approvedAt: '2024-01-16T14:30:00Z' },
        { id: '2', approver: { name: 'Lê Văn C' }, status: 'APPROVED', approvedAt: '2024-01-16T16:45:00Z' }
      ]
    },
    {
      id: '2',
      versionNo: 'v1.1',
      description: 'Cập nhật nguyên liệu và số lượng',
      status: 'PENDING_APPROVAL',
      isCurrent: false,
      createdAt: '2024-01-20T09:15:00Z',
      createdBy: { name: 'Nguyễn Văn A' },
      approvals: [
        { id: '3', approver: { name: 'Trần Thị B' }, status: 'PENDING' },
        { id: '4', approver: { name: 'Lê Văn C' }, status: 'PENDING' }
      ]
    },
    {
      id: '3',
      versionNo: 'v2.0',
      description: 'Phiên bản mới với BOM hoàn toàn mới',
      status: 'DRAFT',
      isCurrent: false,
      createdAt: '2024-01-25T11:30:00Z',
      createdBy: { name: 'Phạm Văn D' },
      approvals: []
    }
  ];

  const handleCreateVersion = () => {
    setCreateModal(true);
  };

  const handleApprovalAction = (action: 'submit' | 'approve' | 'reject', versionId?: string) => {
    setApprovalModal({ isOpen: true, action, versionId });
  };

  const handleViewVersion = (versionId: string) => {
    navigate(`${urls.BOMS_DETAIL(bomId || '')}/versions/${versionId}`);
  };

  const handleCompareVersions = (versionId1: string, versionId2: string) => {
    navigate(`${urls.BOMS}/versions/compare/${versionId1}/${versionId2}`);
  };

  const getStatusBadge = (status: string, isCurrent: boolean) => {
    const variants = {
      'DRAFT': 'secondary' as const,
      'PENDING_APPROVAL': 'warning' as const,
      'APPROVED': 'success' as const,
      'REJECTED': 'destructive' as const
    };

    return (
      <div className="flex items-center space-x-2">
        <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
          {bomUtils.getVersionStatusLabel(status)}
        </Badge>
        {isCurrent && <Badge variant="outline">Hiện tại</Badge>}
      </div>
    );
  };

  const getApprovalProgress = (approvals: any[]) => {
    if (approvals.length === 0) return null;
    
    const approved = approvals.filter(a => a.status === 'APPROVED').length;
    const rejected = approvals.filter(a => a.status === 'REJECTED').length;
    const pending = approvals.filter(a => a.status === 'PENDING').length;
    
    return (
      <div className="flex items-center space-x-2 text-sm">
        <span>{approved} đã phê duyệt</span>
        {pending > 0 && <span className="text-yellow-600">{pending} chờ phê duyệt</span>}
        {rejected > 0 && <span className="text-red-600">{rejected} từ chối</span>}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(urls.BOMS_DETAIL(bomId || ''))}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Quay lại BOM
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý phiên bản BOM</h1>
            <p className="text-gray-600 mt-1">
              Theo dõi và quản lý các phiên bản BOM với approval workflow
            </p>
          </div>
        </div>

        <Button onClick={handleCreateVersion}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Tạo phiên bản mới
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{mockVersions.length}</div>
            <div className="text-sm text-gray-600">Tổng phiên bản</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {mockVersions.filter(v => v.status === 'APPROVED').length}
            </div>
            <div className="text-sm text-gray-600">Đã phê duyệt</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {mockVersions.filter(v => v.status === 'PENDING_APPROVAL').length}
            </div>
            <div className="text-sm text-gray-600">Chờ phê duyệt</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {mockVersions.filter(v => v.isCurrent).length}
            </div>
            <div className="text-sm text-gray-600">Phiên bản hiện tại</div>
          </CardContent>
        </Card>
      </div>

      {/* Versions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ClockIcon className="w-5 h-5" />
            <span>Danh sách phiên bản</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phiên bản</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Người tạo</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Tiến độ phê duyệt</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockVersions.map((version) => (
                <TableRow key={version.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-lg">{version.versionNo}</span>
                      {version.isCurrent && (
                        <Badge variant="outline" className="text-xs">
                          Hiện tại
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={version.description}>
                      {version.description || 'Không có mô tả'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(version.status, version.isCurrent)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <UserGroupIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{version.createdBy.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(version.createdAt).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell>
                    {getApprovalProgress(version.approvals)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewVersion(version.id)}
                      >
                        <EyeIcon className="w-3 h-3" />
                      </Button>
                      
                      {version.status === 'DRAFT' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprovalAction('submit', version.id)}
                        >
                          <DocumentDuplicateIcon className="w-3 h-3" />
                        </Button>
                      )}
                      
                      {version.status === 'PENDING_APPROVAL' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprovalAction('approve', version.id)}
                          >
                            <CheckIcon className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprovalAction('reject', version.id)}
                          >
                            <XMarkIcon className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCompareVersions('1', version.id)}
                        disabled={version.id === '1'}
                      >
                        <ChatBubbleLeftRightIcon className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Version Workflow Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <InformationCircleIcon className="w-5 h-5" />
            <span>Hướng dẫn quy trình</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-sm font-bold">1</span>
              </div>
              <div className="font-medium">Tạo phiên bản</div>
              <div className="text-sm text-gray-600">Tạo phiên bản mới từ BOM hiện tại</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-sm font-bold">2</span>
              </div>
              <div className="font-medium">Gửi phê duyệt</div>
              <div className="text-sm text-gray-600">Chọn người phê duyệt và gửi</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-sm font-bold">3</span>
              </div>
              <div className="font-medium">Phê duyệt</div>
              <div className="text-sm text-gray-600">Người có thẩm quyền phê duyệt</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-sm font-bold">4</span>
              </div>
              <div className="font-medium">Kích hoạt</div>
              <div className="text-sm text-gray-600">Phiên bản được phê duyệt trở thành hiện tại</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateVersionModal 
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        bomId={bomId || ''}
      />

      {approvalModal.versionId && (
        <ApprovalModal
          isOpen={approvalModal.isOpen}
          onClose={() => setApprovalModal({ isOpen: false, action: 'submit' })}
          versionId={approvalModal.versionId}
          action={approvalModal.action}
        />
      )}
    </div>
  );
};
