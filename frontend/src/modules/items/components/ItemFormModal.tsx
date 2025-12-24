import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Item, ItemCreate } from "../api/items.api";
import { getItemTypeOptions, getUomOptions } from "../api/items.api";

interface ItemFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ItemCreate) => Promise<void>;
  initialValues?: Item | null;
  loading?: boolean;
}

const ItemFormModal: React.FC<ItemFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  loading = false,
}) => {
  const [formData, setFormData] = useState<ItemCreate>({
    sku: "",
    name: "",
    itemType: "FABRIC",
    baseUom: "pcs",
    isActive: true,
    note: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const itemTypeOptions = getItemTypeOptions();
  const uomOptions = getUomOptions();

  // Update form when initial values change
  useEffect(() => {
    if (initialValues) {
      setFormData({
        sku: initialValues.sku || "",
        name: initialValues.name || "",
        itemType: initialValues.itemType || "FABRIC",
        baseUom: initialValues.baseUom || "pcs",
        isActive: initialValues.isActive,
        note: initialValues.note || "",
      });
    } else {
      setFormData({
        sku: "",
        name: "",
        itemType: "FABRIC",
        baseUom: "pcs",
        isActive: true,
        note: "",
      });
    }
    setErrors({});
  }, [initialValues, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên sản phẩm là bắt buộc";
    }

    if (!formData.itemType) {
      newErrors.itemType = "Loại sản phẩm là bắt buộc";
    }

    if (!formData.baseUom.trim()) {
      newErrors.baseUom = "Đơn vị tính là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleInputChange = (field: keyof ItemCreate, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialValues ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SKU */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU/Mã sản phẩm
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => handleInputChange("sku", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="VD: FAB001"
              />
            </div>

            {/* Tên sản phẩm */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Tên sản phẩm"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Loại sản phẩm */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại sản phẩm <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.itemType}
                onChange={(e) => handleInputChange("itemType", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.itemType ? "border-red-500" : "border-gray-300"
                }`}
              >
                {itemTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.itemType && (
                <p className="text-red-500 text-sm mt-1">{errors.itemType}</p>
              )}
            </div>

            {/* Đơn vị tính */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đơn vị tính <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.baseUom}
                onChange={(e) => handleInputChange("baseUom", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.baseUom ? "border-red-500" : "border-gray-300"
                }`}
              >
                {uomOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.baseUom && (
                <p className="text-red-500 text-sm mt-1">{errors.baseUom}</p>
              )}
            </div>

            {/* Trạng thái */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                value={formData.isActive ? "true" : "false"}
                onChange={(e) => handleInputChange("isActive", e.target.value === "true")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="true">Hoạt động</option>
                <option value="false">Ngừng hoạt động</option>
              </select>
            </div>
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ghi chú
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => handleInputChange("note", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mô tả thêm về sản phẩm"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {initialValues ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemFormModal;

