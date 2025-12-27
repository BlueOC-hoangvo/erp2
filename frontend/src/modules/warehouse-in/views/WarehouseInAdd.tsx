import { useMemo, useState } from "react";
import { ModalBase } from "../../../components/modalbase/ModalBase";

type SupplierOption = { id: string; code?: string; name: string };
type ItemOption = { id: string; sku: string; name: string; baseUom: string };

type LineForm = {
  lineNo: number;
  itemId: string;
  uom: string;
  qty: string; 
  unitPrice: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  suppliers: SupplierOption[];
  items: ItemOption[];
  createFn: (payload: any) => Promise<any>;
};

export default function WarehouseInAddModal({
  open,
  onClose,
  onCreated,
  suppliers,
  items,
  createFn,
}: Props) {
  const today = new Date().toISOString().slice(0, 10);

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    poNo: `PO-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
    supplierId: suppliers[0]?.id ?? "",
    orderDate: today,
    note: "",
    status: "DRAFT" as "DRAFT" | "CONFIRMED" | "RECEIVING" | "RECEIVED" | "CANCELLED",
  });

  const [lines, setLines] = useState<LineForm[]>([
    {
      lineNo: 1,
      itemId: items[0]?.id ?? "",
      uom: items[0]?.baseUom ?? "pcs",
      qty: "",
      unitPrice: "",
    },
  ]);

  const totalAmount = useMemo(() => {
    const toNum = (s: string) => {
      const n = Number(String(s).replaceAll(",", ""));
      return Number.isFinite(n) ? n : 0;
    };
    return lines.reduce((sum, l) => sum + toNum(l.qty) * toNum(l.unitPrice), 0);
  }, [lines]);

  const addLine = () => {
    const nextLineNo = (lines.at(-1)?.lineNo ?? 0) + 1;
    const firstItem = items[0];
    setLines((prev) => [
      ...prev,
      {
        lineNo: nextLineNo,
        itemId: firstItem?.id ?? "",
        uom: firstItem?.baseUom ?? "pcs",
        qty: "",
        unitPrice: "",
      },
    ]);
  };

  const removeLine = (lineNo: number) => {
    setLines((prev) => prev.filter((l) => l.lineNo !== lineNo).map((l, idx) => ({ ...l, lineNo: idx + 1 })));
  };

  const updateLine = (lineNo: number, patch: Partial<LineForm>) => {
    setLines((prev) =>
      prev.map((l) => {
        if (l.lineNo !== lineNo) return l;
        const next = { ...l, ...patch };
        if (patch.itemId) {
          const it = items.find((x) => x.id === patch.itemId);
          if (it) next.uom = it.baseUom;
        }
        return next;
      })
    );
  };

  const validate = () => {
    if (!form.poNo.trim()) return "Thiếu poNo";
    if (!form.supplierId) return "Thiếu supplierId";
    if (!lines.length) return "Thiếu chi tiết (lines)";
    for (const l of lines) {
      if (!l.itemId) return `Line ${l.lineNo}: thiếu itemId`;
      if (!String(l.qty).trim()) return `Line ${l.lineNo}: thiếu qty`;
      if (!String(l.unitPrice).trim()) return `Line ${l.lineNo}: thiếu unitPrice`;
    }
    return null;
  };

  const onSubmit = async () => {
    const err = validate();
    if (err) {
      alert(err);
      return;
    }
    setSaving(true);
    try {
      const payload = {
        poNo: form.poNo.trim(),
        supplierId: String(form.supplierId),
        orderDate: new Date(form.orderDate).toISOString(),
        status: form.status,
        note: form.note,
        lines: lines.map((l) => ({
          lineNo: l.lineNo,
          itemId: String(l.itemId),
          uom: l.uom || "pcs",
          qty: String(l.qty),
          unitPrice: String(l.unitPrice),
        })),
      };

      await createFn(payload);
      onClose();
      onCreated();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalBase open={open} title="Lập phiếu nhập kho" onClose={onClose}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div className="text-sm text-gray-500">Số PO</div>
            <input
              className="w-full border rounded px-3 py-2"
              value={form.poNo}
              onChange={(e) => setForm((p) => ({ ...p, poNo: e.target.value }))}
            />
          </div>

          <div>
            <div className="text-sm text-gray-500">Nhà cung cấp</div>
            <select
              className="w-full border rounded px-3 py-2"
              value={form.supplierId}
              onChange={(e) => setForm((p) => ({ ...p, supplierId: e.target.value }))}
            >
              <option value="" disabled>-- chọn --</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {(s.code ? `${s.code} - ` : "") + s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="text-sm text-gray-500">Ngày</div>
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={form.orderDate}
              onChange={(e) => setForm((p) => ({ ...p, orderDate: e.target.value }))}
            />
          </div>

          <div>
            <div className="text-sm text-gray-500">Trạng thái</div>
            <select
              className="w-full border rounded px-3 py-2"
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as any }))}
            >
              <option value="DRAFT">Bản nháp</option>
              <option value="CONFIRMED">Đã xác nhận</option>
              <option value="RECEIVING">Đang nhận hàng</option>
              <option value="RECEIVED">Đã nhận hàng</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <div className="text-sm text-gray-500">Ghi chú</div>
            <textarea
              className="w-full border rounded px-3 py-2"
              rows={2}
              value={form.note}
              onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="font-semibold">Chi tiết (lines)</div>
          <button className="px-3 py-2 border rounded hover:bg-gray-50" onClick={addLine}>
            + Thêm dòng
          </button>
        </div>

        <div className="overflow-auto border rounded">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="px-3 py-2 w-[70px]">Dòng</th>
                <th className="px-3 py-2 min-w-[260px]">NVL</th>
                <th className="px-3 py-2 w-[110px]">Đơn vị</th>
                <th className="px-3 py-2 w-[140px]">Số lượng</th>
                <th className="px-3 py-2 w-[160px]">Giá tiền/NVL</th>
                <th className="px-3 py-2 w-[70px]"></th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l) => (
                <tr key={l.lineNo} className="border-t">
                  <td className="px-3 py-2">{l.lineNo}</td>

                  <td className="px-3 py-2">
                    <select
                      className="w-full border rounded px-2 py-1"
                      value={l.itemId}
                      onChange={(e) => updateLine(l.lineNo, { itemId: e.target.value })}
                    >
                      <option value="" disabled>-- chọn item --</option>
                      {items.map((it) => (
                        <option key={it.id} value={it.id}>
                          {it.sku} - {it.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-3 py-2">
                    <input
                      className="w-full border rounded px-2 py-1"
                      value={l.uom}
                      onChange={(e) => updateLine(l.lineNo, { uom: e.target.value })}
                    />
                  </td>

                  <td className="px-3 py-2">
                    <input
                      className="w-full border rounded px-2 py-1"
                      value={l.qty}
                      onChange={(e) => updateLine(l.lineNo, { qty: e.target.value })}
                      placeholder="vd: 1000"
                    />
                  </td>

                  <td className="px-3 py-2">
                    <input
                      className="w-full border rounded px-2 py-1"
                      value={l.unitPrice}
                      onChange={(e) => updateLine(l.lineNo, { unitPrice: e.target.value })}
                      placeholder="vd: 72000"
                    />
                  </td>

                  <td className="px-3 py-2">
                    <button
                      className="px-2 py-1 border rounded hover:bg-gray-50"
                      onClick={() => removeLine(l.lineNo)}
                      disabled={lines.length === 1}
                      title={lines.length === 1 ? "Phải có ít nhất 1 dòng" : "Xóa dòng"}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-gray-600">
            Tổng tiền (ước tính): <span className="font-semibold">{totalAmount.toLocaleString("vi-VN")} đ</span>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border rounded hover:bg-gray-50" onClick={onClose} disabled={saving}>
              Hủy
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={onSubmit} disabled={saving}>
              {saving ? "Đang lưu..." : "Tạo phiếu"}
            </button>
          </div>
        </div>
      </div>
    </ModalBase>
  );
}
