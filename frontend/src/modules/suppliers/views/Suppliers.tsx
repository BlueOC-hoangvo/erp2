import { useEffect, useMemo, useState } from "react";
import { getSuppliers } from "../api/get-suppliers";
import { addSupplier } from "../api/add-supplier";
import { updateSupplier } from "../api/update-supplier";
import type { Supplier, SupplierUpsertBody } from "../types";
import { ModalBase } from "./SupplierModal";

type ModalMode = "add" | "view" | "edit";

const emptyForm: SupplierUpsertBody = {
  code: "",
  name: "",
  taxCode: "",
  phone: "",
  email: "",
  address: "",
  note: "",
};

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>("view");
  const [selected, setSelected] = useState<Supplier | null>(null);

  const [form, setForm] = useState<SupplierUpsertBody>({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getSuppliers({ page: 1, limit: 20 });
      setSuppliers(res.data.items);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    if (saving) return;
    setOpen(false);
    setMode("view");
    setSelected(null);
    setForm({ ...emptyForm });
    setErrorMsg("");
  };

  const openAdd = () => {
    setMode("add");
    setSelected(null);
    setForm({ ...emptyForm });
    setErrorMsg("");
    setOpen(true);
  };

  const openView = (s: Supplier) => {
    setMode("view");
    setSelected(s);
    setErrorMsg("");
    setOpen(true);
  };

  const openEdit = (s: Supplier) => {
    setMode("edit");
    setSelected(s);
    setForm({
      code: s.code,
      name: s.name,
      taxCode: s.taxCode ?? "",
      phone: s.phone ?? "",
      email: s.email ?? "",
      address: s.address ?? "",
      note: s.note ?? "",
    });
    setErrorMsg("");
    setOpen(true);
  };

  const modalTitle =
    mode === "add"
      ? "Thêm nhà cung cấp"
      : mode === "edit"
        ? "Sửa nhà cung cấp"
        : "Chi tiết nhà cung cấp";

  const canSave = useMemo(() => {
    return form.code.trim() !== "" && form.name.trim() !== "";
  }, [form.code, form.name]);

  const setField =
    (key: keyof SupplierUpsertBody) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((p) => ({ ...p, [key]: e.target.value }));
      };

  const cleanBody = (body: SupplierUpsertBody): SupplierUpsertBody => {
    const toUndef = (v?: string) => (v && v.trim() !== "" ? v : undefined);
    return {
      code: body.code.trim(),
      name: body.name.trim(),
      taxCode: toUndef(body.taxCode),
      phone: toUndef(body.phone),
      email: toUndef(body.email),
      address: toUndef(body.address),
      note: toUndef(body.note),
    };
  };

  const handleSave = async () => {
    if (!canSave) {
      setErrorMsg("Vui lòng nhập Mã và Tên.");
      return;
    }
    setSaving(true);
    setErrorMsg("");

    try {
      const body = cleanBody(form);

      if (mode === "add") {
        await addSupplier(body);
      } else if (mode === "edit") {
        if (!selected) throw new Error("Thiếu nhà cung cấp để sửa");
        await updateSupplier(selected.id, body);
      }

      await loadData();
      closeModal();
    } catch (e: any) {
      setErrorMsg(e?.message ?? "Lưu thất bại");
      setSaving(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Danh sách nhà cung cấp</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={openAdd}
        >
          Tạo nhà cung cấp mới
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left text-sm font-semibold text-gray-700">
              <th className="px-4 py-3">Mã NCC</th>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">MST</th>
              <th className="px-4 py-3">Điện thoại</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Địa chỉ</th>
              <th className="px-4 py-3">Ghi chú</th>
              <th className="px-4 py-3">Hành động</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {loading && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                  Đang tải...
                </td>
              </tr>
            )}

            {!loading && suppliers.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            )}

            {!loading &&
              suppliers.map((s) => (
                <tr key={s.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <button className="text-blue-600 hover:underline" onClick={() => openView(s)}>
                      {s.code}
                    </button>
                  </td>
                  <td className="px-4 py-3">{s.name}</td>
                  <td className="px-4 py-3">{s.taxCode || "-"}</td>
                  <td className="px-4 py-3">{s.phone || "-"}</td>
                  <td className="px-4 py-3">{s.email || "-"}</td>
                  <td className="px-4 py-3">{s.address || "-"}</td>
                  <td className="px-4 py-3">{s.note || "-"}</td>
                  <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                    <button className="px-3 py-1 border rounded hover:bg-gray-100" onClick={() => openView(s)}>
                      Xem
                    </button>
                    <button className="px-3 py-1 border rounded hover:bg-gray-100" onClick={() => openEdit(s)}>
                      Sửa
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <ModalBase
        open={open}
        title={modalTitle}
        onClose={closeModal}
        footer={
          <>
            <button
              className="rounded border px-4 py-2 hover:bg-gray-50"
              onClick={closeModal}
              disabled={saving}
            >
              Hủy
            </button>

            {mode === "view" && selected && (
              <button
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                onClick={() => openEdit(selected)}
              >
                Sửa
              </button>
            )}

            {mode !== "view" && (
              <button
                className={`rounded px-4 py-2 text-white ${canSave && !saving ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"
                  }`}
                onClick={handleSave}
                disabled={!canSave || saving}
              >
                {saving ? "Đang lưu..." : "Lưu"}
              </button>
            )}
          </>
        }
      >
        {errorMsg && (
          <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {mode === "view" && selected && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <label className="block">
              <div className="text-xs text-gray-500 mb-1">Mã *</div>
              <input
                className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-200"
                value={selected.code}
                readOnly
              />
            </label>

            <label className="block">
              <div className="text-xs text-gray-500 mb-1">Tên *</div>
              <input
                className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-200"
                value={selected.name}
                readOnly
              />
            </label>

            <label className="block">
              <div className="text-xs text-gray-500 mb-1">MST</div>
              <input
                className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-200"
                value={selected.taxCode ?? ""}
                readOnly
              />
            </label>

            <label className="block">
              <div className="text-xs text-gray-500 mb-1">Điện thoại</div>
              <input
                className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-200"
                value={selected.phone ?? ""}
                readOnly
              />
            </label>

            <label className="block">
              <div className="text-xs text-gray-500 mb-1">Email</div>
              <input
                className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-200"
                value={selected.email ?? ""}
                readOnly
              />
            </label>

            <label className="block">
              <div className="text-xs text-gray-500 mb-1">Địa chỉ</div>
              <input
                className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-200"
                value={selected.address ?? ""}
                readOnly
              />
            </label>

            <label className="block col-span-2">
              <div className="text-xs text-gray-500 mb-1">Ghi chú</div>
              <textarea
                className="w-full px-3 py-2 border rounded min-h-[90px] outline-none focus:ring-2 focus:ring-blue-200"
                value={selected.note ?? ""}
                readOnly
              />
            </label>

          </div>
        )}

        {mode !== "view" && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <label className="block">
              <div className="text-xs text-gray-500 mb-1">Mã *</div>
              <input
                className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-200"
                value={form.code}
                onChange={setField("code")}
              />
            </label>

            <label className="block">
              <div className="text-xs text-gray-500 mb-1">Tên *</div>
              <input
                className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-200"
                value={form.name}
                onChange={setField("name")}
              />
            </label>

            <label className="block">
              <div className="text-xs text-gray-500 mb-1">MST</div>
              <input
                className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-200"
                value={form.taxCode ?? ""}
                onChange={setField("taxCode")}
              />
            </label>

            <label className="block">
              <div className="text-xs text-gray-500 mb-1">Điện thoại</div>
              <input
                className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-200"
                value={form.phone ?? ""}
                onChange={setField("phone")}
              />
            </label>

            <label className="block">
              <div className="text-xs text-gray-500 mb-1">Email</div>
              <input
                className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-200"
                value={form.email ?? ""}
                onChange={setField("email")}
              />
            </label>

            <label className="block">
              <div className="text-xs text-gray-500 mb-1">Địa chỉ</div>
              <input
                className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-200"
                value={form.address ?? ""}
                onChange={setField("address")}
              />
            </label>

            <label className="block col-span-2">
              <div className="text-xs text-gray-500 mb-1">Ghi chú</div>
              <textarea
                className="w-full px-3 py-2 border rounded min-h-[90px] outline-none focus:ring-2 focus:ring-blue-200"
                value={form.note ?? ""}
                onChange={setField("note")}
              />
            </label>

            <div className="col-span-2 text-xs text-gray-500">(*) bắt buộc</div>
          </div>
        )}
      </ModalBase>
      <div className="flex justify-end items-center mt-6 space-x-2 text-sm">
        <button className="px-2 py-1 text-gray-500 hover:text-black">‹</button>
        <button className="px-3 py-1 border rounded text-blue-600 border-blue-600">
          1
        </button>
        <button className="px-2 py-1 text-gray-500 hover:text-black">›</button>
      </div>
    </div>
  );
}

