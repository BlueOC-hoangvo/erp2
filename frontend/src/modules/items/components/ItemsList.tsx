import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  type Item,
  type ItemCreate,
  type ItemQuery,
  getItemTypeOptions,
} from "../api/items.api";
import ItemFormModal from "./ItemFormModal";

interface ItemsListProps {
  onViewDetail?: (item: Item) => void;
}

const ItemsList: React.FC<ItemsListProps> = ({ onViewDetail }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemTypeFilter, setItemTypeFilter] = useState<string>("");
  const [isActiveFilter, setIsActiveFilter] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const queryClient = useQueryClient();

  // Query for items list
  const { data, isLoading, error } = useQuery({
    queryKey: ["items", { page: currentPage, pageSize, search: searchTerm, itemType: itemTypeFilter, isActive: isActiveFilter }],
    queryFn: async () => {
      const query: ItemQuery = {
        page: currentPage,
        pageSize,
        q: searchTerm || undefined,
        itemType: (itemTypeFilter as any) || undefined,
        isActive: isActiveFilter ? isActiveFilter === "true" : undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      };
      const response = await getItems(query);
      return response;
    },
  });

  // Create mutation
  const createMut = useMutation({
    mutationFn: (data: ItemCreate) => createItem(data),
    onSuccess: () => {
      message.success("Tạo sản phẩm thành công");
      queryClient.invalidateQueries({ queryKey: ["items"] });
      setIsModalVisible(false);
    },
    onError: (error: any) => {
      message.error(error?.message || "Tạo sản phẩm thất bại");
    },
  });

  // Update mutation
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ItemCreate> }) =>
      updateItem(id, data),
    onSuccess: () => {
      message.success("Cập nhật sản phẩm thành công");
      queryClient.invalidateQueries({ queryKey: ["items"] });
      setIsModalVisible(false);
    },
    onError: (error: any) => {
      message.error(error?.message || "Cập nhật thất bại");
    },
  });

  // Delete mutation
  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteItem(id),
    onSuccess: () => {
      message.success("Xóa sản phẩm thành công");
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
    onError: (error: any) => {
      message.error(error?.message || "Xóa thất bại");
    },
  });

  const itemTypeOptions = getItemTypeOptions();

  // Table columns
  const columns: ColumnsType<Item> = [
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      width: 120,
      render: (text: string) => <strong>{text || "-"}</strong>,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      render: (text: string, record: Item) => (
        <div>
          <div
            className="font-medium text-blue-600 cursor-pointer hover:text-blue-800"
            onClick={() => onViewDetail?.(record)}
          >
            {text}
          </div>
          <div className="text-xs text-gray-500">
            {record.baseUom} • {record.itemType}
          </div>
        </div>
      ),
    },
    {
      title: "Loại",
      dataIndex: "itemType",
      key: "itemType",
      width: 100,
      render: (type: string) => {
        const option = itemTypeOptions.find(opt => opt.value === type);
        return option?.label || type;
      },
    },
    {
      title: "Đơn vị",
      dataIndex: "baseUom",
      key: "baseUom",
      width: 80,
      render: (uom: string) => uom,
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      width: 100,
      render: (isActive: boolean) => (
        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
          isActive 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        }`}>
          {isActive ? "Hoạt động" : "Ngừng hoạt động"}
        </span>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      ellipsis: true,
      width: 150,
      render: (note: string) => note || "-",
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
      render: (_, record: Item) => (
        <div className="flex gap-2">
          <button
            className="text-blue-600 hover:text-blue-800 p-1 rounded"
            onClick={() => {
              setEditingItem(record);
              setIsModalVisible(true);
            }}
            title="Chỉnh sửa"
          >
            <EditOutlined />
          </button>
          <button
            className="text-red-600 hover:text-red-800 p-1 rounded"
            onClick={() => {
              if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
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
  const handleSubmit = async (values: ItemCreate) => {
    if (editingItem) {
      await updateMut.mutateAsync({
        id: editingItem.id,
        data: values,
      });
    } else {
      await createMut.mutateAsync(values);
    }
  };

  // Handle filters
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
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
          Lỗi khi tải dữ liệu sản phẩm
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Quản lý sản phẩm/hàng hóa
        </h1>
        <p className="text-gray-600">
          Quản lý danh sách sản phẩm và hàng hóa trong hệ thống
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-4 space-y-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm theo tên, SKU..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
            onClick={() => {
              setEditingItem(null);
              setIsModalVisible(true);
            }}
          >
            <PlusOutlined />
            Thêm sản phẩm
          </button>
        </div>

        <div className="flex gap-4 items-center">
          <select
            value={itemTypeFilter}
            onChange={(e) => {
              setItemTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả loại</option>
            {itemTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={isActiveFilter}
            onChange={(e) => {
              setIsActiveFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="true">Hoạt động</option>
            <option value="false">Ngừng hoạt động</option>
          </select>

          <button
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={() => {
              setSearchTerm("");
              setItemTypeFilter("");
              setIsActiveFilter("");
              setCurrentPage(1);
            }}
          >
            Xóa bộ lọc
          </button>
        </div>
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
            {data.meta.total || 0} sản phẩm
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
      <ItemFormModal
        open={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setEditingItem(null);
        }}
        onSubmit={handleSubmit}
        initialValues={editingItem}
        loading={createMut.isPending || updateMut.isPending}
      />
    </div>
  );
};

export default ItemsList;

