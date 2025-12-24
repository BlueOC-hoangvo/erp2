import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Supplier, SupplierCreate } from "../api/suppliers.api";

interface SupplierFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: SupplierCreate) => Promise<void>;
  initialValues?: Supplier | null;
  loading?: boolean;
}

const SupplierFormModal: React.FC<SupplierFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  loading = false,
}) => {
  const [formData, setFormData] = useState<SupplierCreate>({
    code: "",
    name: "",
    taxCode: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form when initial values change
  useEffect(() => {
    if (initialValues) {
      setFormData({
        code: initialValues.code || "",
        name: initialValues.name || "",
        taxCode: initialValues.taxCode || "",
        phone: initialValues.phone || "",
        email: initialValues.email || "",
        address: initialValues.address || "",
        note: initialValues.note || "",
      });
    } else {
      setFormData({
        code: "",
        name: "",
        taxCode: "",
        phone: "",
        email: "",
        address: "",
        note: "",
      });
    }
    setErrors({});
  }, [initialValues, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên nhà cung cấp là bắt buộc";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
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

  const handleInputChange = (field: keyof SupplierCreate, value: string) => {
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
            {initialValues ? "Chỉnh sửa nhà cung cấp" : "Thêm nhà cung cấp mới"}
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
            {/* Mã nhà cung cấp */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã nhà cung cấp
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => handleInputChange("code", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="VD: SUP001"
              />
            </div>

            {/* Tên nhà cung cấp */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên nhà cung cấp <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Tên công ty"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Số điện thoại */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0123456789"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="email@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Mã số thuế */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã số thuế
            </label>
            <input
              type="text"
              value={formData.taxCode}
              onChange={(e) => handleInputChange("taxCode", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0123456789"
            />
          </div>

          {/* Địa chỉ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Địa chỉ đầy đủ"
            />
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ghi chú
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => handleInputChange("note", e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ghi chú thêm về nhà cung cấp"
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

export default SupplierFormModal;

