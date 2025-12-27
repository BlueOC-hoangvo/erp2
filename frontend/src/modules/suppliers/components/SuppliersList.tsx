import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  type Supplier,
  type SupplierCreate,
  type SupplierQuery,
} from "../api/suppliers.api";
import SupplierFormModal from "./SupplierFormModal";

interface SuppliersListProps {
  onViewDetail?: (supplier: Supplier) => void;
}

const SuppliersList: React.FC<SuppliersListProps> = ({ onViewDetail }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const queryClient = useQueryClient();

  // Query for suppliers list
  const { data, isLoading, error } = useQuery({
    queryKey: ["suppliers", { page: currentPage, pageSize, search: searchTerm }],
    queryFn: async () => {
      const query: SupplierQuery = {
        page: currentPage,
        pageSize,
        q: searchTerm || undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      };
      const response = await getSuppliers(query);
      return response;
    },
  });

  // Create mutation
  const createMut = useMutation({
    mutationFn: (data: SupplierCreate) => createSupplier(data),
    onSuccess: () => {
      message.success("Tạo nhà cung cấp thành công");
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      setIsModalVisible(false);
    },
    onError: (error: any) => {
      message.error(error?.message || "Tạo nhà cung cấp thất bại");
    },
  });

  // Update mutation
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<SupplierCreate> }) =>
      updateSupplier(id, data),
    onSuccess: () => {
      message.success("Cập nhật nhà cung cấp thành công");
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      setIsModalVisible(false);
    },
    onError: (error: any) => {
      message.error(error?.message || "Cập nhật thất bại");
    },
  });

  // Delete mutation
  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteSupplier(id),
    onSuccess: () => {
      message.success("Xóa nhà cung cấp thành công");
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
    onError: (error: any) => {
      message.error(error?.message || "Xóa thất bại");
    },
  });

  // Table columns
  const columns: ColumnsType<Supplier> = [
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      width: 100,
      render: (text: string) => <strong>{text || "-"}</strong>,
    },
    {
      title: "Tên nhà cung cấp",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      render: (text: string, record: Supplier) => (
        <div>
          <div
            className="font-medium text-blue-600 cursor-pointer hover:text-blue-800"
            onClick={() => onViewDetail?.(record)}
          >
            {text}
          </div>
          <div className="text-xs text-gray-500">
            {record.email || record.phone}
          </div>
        </div>
      ),
    },
    {
      title: "Liên hệ",
      key: "contact",
      width: 150,
      render: (_, record: Supplier) => (
        <div className="text-xs">
          {record.phone && (
            <div className="mb-1">
              📞 {record.phone}
            </div>
          )}
          {record.email && (
            <div>📧 {record.email}</div>
          )}
        </div>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
      width: 200,
      render: (text: string) => text || "-",
    },
    {
      title: "Mã số thuế",
      dataIndex: "taxCode",
      key: "taxCode",
      width: 120,
      render: (text: string) => text || "-",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: string) =>
        new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      render: (_, record: Supplier) => (
        <div className="flex gap-2">
          <button
            className="text-blue-600 hover:text-blue-800 p-1 rounded"
            onClick={() => {
              setEditingSupplier(record);
              setIsModalVisible(true);
            }}
            title="Chỉnh sửa"
          >
            <EditOutlined />
          </button>
          <button
            className="text-red-600 hover:text-red-800 p-1 rounded"
            onClick={() => {
              if (confirm("Bạn có chắc chắn muốn xóa nhà cung cấp này?")) {
                deleteMut.mutate(record.id);
              }
            }}
            title="Xóa"
          >
            <DeleteOutlined />
          </button>
        </div>
      ),
    },
  ];

  // Handle form submission
  const handleSubmit = async (values: SupplierCreate) => {
    if (editingSupplier) {
      await updateMut.mutateAsync({
        id: editingSupplier.id,
        data: values,
      });
    } else {
      await createMut.mutateAsync(values);
    }
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle pagination
  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          Lỗi khi tải dữ liệu nhà cung cấp
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Quản lý nhà cung cấp
        </h1>
        <p className="text-gray-600">
          Thông tin và quản lý các nhà cung cấp trong hệ thống
        </p>
      </div>

      {/* Search and Add Button */}
      <div className="mb-4 flex gap-4 items-center">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm nhà cung cấp..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
          onClick={() => {
            setEditingSupplier(null);
            setIsModalVisible(true);
          }}
        >
          <PlusOutlined />
          Thêm nhà cung cấp
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key as string}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ width: col.width }}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  Đang tải...
                </td>
              </tr>
            ) : data?.data?.length ? (
              data.data.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key as string} className="px-6 py-4 whitespace-nowrap text-sm">
                      {col.render
                        ? col.render(
                            (record as any)[col.dataIndex as string],
                            record
                          )
                        : (record as any)[col.dataIndex as string] || "-"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data?.meta && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Hiển thị {(currentPage - 1) * pageSize + 1} đến{" "}
            {Math.min(currentPage * pageSize, data.meta.total || 0)} của{" "}
            {data.meta.total || 0} nhà cung cấp
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Trước
            </button>
            <span className="px-3 py-1 bg-blue-600 text-white rounded">
              {currentPage}
            </span>
            <button
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
              disabled={
                data.meta.total
                  ? currentPage >= Math.ceil(data.meta.total / pageSize)
                  : true
              }
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* Form Modal */}
      <SupplierFormModal
        open={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setEditingSupplier(null);
        }}
        onSubmit={handleSubmit}
        initialValues={editingSupplier}
        loading={createMut.isPending || updateMut.isPending}
      />
    </div>
  );
};

export default SuppliersList;

