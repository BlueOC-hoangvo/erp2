import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteContact,
  listContacts,
  upsertContact,
  type CustomerContactEntity,
} from "../fake/customer-contacts.store";

type Props = { customerId: string };

type Draft = {
  id?: string;
  name: string;
  phone?: string;
  email?: string;
  position?: string;
};

export default function CustomerContactsTab({ customerId }: Props) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>({
    name: "",
    phone: "",
    email: "",
    position: "",
  });

  const query = useQuery({
    queryKey: ["customer-contacts", customerId],
    queryFn: async () => listContacts(customerId),
  });

  const rows = query.data ?? [];

  const mSave = useMutation({
    mutationFn: async () => {
      if (!draft.name.trim()) throw new Error("Tên liên hệ không được trống");
      return upsertContact({
        id: draft.id,
        customerId,
        name: draft.name.trim(),
        phone: draft.phone?.trim() || undefined,
        email: draft.email?.trim() || undefined,
        position: draft.position?.trim() || undefined,
      });
    },
    onSuccess: async () => {
      setOpen(false);
      setDraft({ name: "", phone: "", email: "", position: "" });
      await qc.invalidateQueries({
        queryKey: ["customer-contacts", customerId],
      });
    },
  });

  const mDel = useMutation({
    mutationFn: async (id: string) => {
      deleteContact(id);
      return true;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: ["customer-contacts", customerId],
      });
    },
  });

  const empty = rows.length === 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <div className="text-sm font-semibold text-gray-900">
            Người liên hệ
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            Quản lý danh sách liên hệ của khách hàng
          </div>
        </div>

        <button
          onClick={() => {
            setDraft({ name: "", phone: "", email: "", position: "" });
            setOpen(true);
          }}
          className="h-10 px-4 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-black"
        >
          + Thêm liên hệ
        </button>
      </div>

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        {empty ? (
          <div className="p-8 text-center">
            <div className="font-semibold text-gray-900">Chưa có liên hệ</div>
            <div className="text-sm text-gray-500 mt-1">
              Thêm người liên hệ để thuận tiện chăm sóc khách hàng.
            </div>
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-[860px] w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Tên</th>
                  <th className="text-left px-4 py-3 font-semibold">Chức vụ</th>
                  <th className="text-left px-4 py-3 font-semibold">
                    Điện thoại
                  </th>
                  <th className="text-left px-4 py-3 font-semibold">Email</th>
                  <th className="text-right px-4 py-3 font-semibold w-[220px]">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t hover:bg-gray-50/60">
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {r.name}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {r.position ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {r.phone ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {r.email ?? "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setDraft({
                              id: r.id,
                              name: r.name,
                              phone: r.phone ?? "",
                              email: r.email ?? "",
                              position: r.position ?? "",
                            });
                            setOpen(true);
                          }}
                          className="h-9 px-3 rounded-xl border bg-white text-sm font-medium hover:bg-gray-50"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => {
                            const ok = confirm(`Xóa liên hệ "${r.name}"?`);
                            if (ok) mDel.mutate(r.id);
                          }}
                          className="h-9 px-3 rounded-xl bg-rose-50 text-rose-700 text-sm font-semibold hover:bg-rose-100"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal nhẹ bằng tailwind */}
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="font-semibold">
                {draft.id ? "Sửa liên hệ" : "Thêm liên hệ"}
              </div>
              <button
                className="text-sm underline"
                onClick={() => setOpen(false)}
              >
                Đóng
              </button>
            </div>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <div className="text-xs text-gray-500">Tên liên hệ</div>
                <input
                  className="mt-1 h-10 w-full px-3 rounded-xl border"
                  value={draft.name}
                  onChange={(e) =>
                    setDraft((s) => ({ ...s, name: e.target.value }))
                  }
                />
              </div>

              <div>
                <div className="text-xs text-gray-500">Chức vụ</div>
                <input
                  className="mt-1 h-10 w-full px-3 rounded-xl border"
                  value={draft.position ?? ""}
                  onChange={(e) =>
                    setDraft((s) => ({ ...s, position: e.target.value }))
                  }
                />
              </div>

              <div>
                <div className="text-xs text-gray-500">Điện thoại</div>
                <input
                  className="mt-1 h-10 w-full px-3 rounded-xl border"
                  value={draft.phone ?? ""}
                  onChange={(e) =>
                    setDraft((s) => ({ ...s, phone: e.target.value }))
                  }
                />
              </div>

              <div className="sm:col-span-2">
                <div className="text-xs text-gray-500">Email</div>
                <input
                  className="mt-1 h-10 w-full px-3 rounded-xl border"
                  value={draft.email ?? ""}
                  onChange={(e) =>
                    setDraft((s) => ({ ...s, email: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="p-4 border-t flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="h-10 px-4 rounded-xl border bg-white text-sm font-semibold hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => mSave.mutate()}
                disabled={mSave.isPending || !draft.name.trim()}
                className="h-10 px-4 rounded-xl bg-gray-900 text-white text-sm font-semibold disabled:opacity-60"
              >
                {mSave.isPending ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
