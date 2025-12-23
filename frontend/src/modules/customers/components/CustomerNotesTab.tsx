import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addNote, deleteNote, listNotes } from "../fake/customer-notes.store";

type Props = { customerId: string };

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return `${d.toLocaleDateString("vi-VN")} ${d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`;
}

export default function CustomerNotesTab({ customerId }: Props) {
  const qc = useQueryClient();
  const [text, setText] = useState("");

  const query = useQuery({
    queryKey: ["customer-notes", customerId],
    queryFn: async () => listNotes(customerId),
  });

  const rows = query.data ?? [];

  const mAdd = useMutation({
    mutationFn: async () => {
      const note = text.trim();
      if (!note) throw new Error("Ghi chú trống");
      addNote({ customerId, note, createdByName: "Bạn" });
      return true;
    },
    onSuccess: async () => {
      setText("");
      await qc.invalidateQueries({ queryKey: ["customer-notes", customerId] });
    },
  });

  const mDel = useMutation({
    mutationFn: async (id: string) => {
      deleteNote(id);
      return true;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["customer-notes", customerId] });
    },
  });

  return (
    <div className="space-y-3">
      <div>
        <div className="text-sm font-semibold text-gray-900">
          Ghi chú chăm sóc
        </div>
        <div className="text-xs text-gray-500 mt-0.5">
          Lưu lịch sử trao đổi/nhắc việc với khách hàng
        </div>
      </div>

      <div className="bg-white border rounded-2xl shadow-sm p-4">
        <div className="text-xs text-gray-500">Thêm ghi chú</div>
        <textarea
          className="mt-2 w-full min-h-[96px] px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          placeholder="Ví dụ: Khách muốn nhận báo giá trước thứ 6. Gọi lại 15:00."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => mAdd.mutate()}
            disabled={mAdd.isPending || !text.trim()}
            className="h-10 px-4 rounded-xl bg-gray-900 text-white text-sm font-semibold disabled:opacity-60"
          >
            {mAdd.isPending ? "Đang lưu..." : "Lưu ghi chú"}
          </button>
        </div>
      </div>

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        {rows.length === 0 ? (
          <div className="p-8 text-center">
            <div className="font-semibold text-gray-900">Chưa có ghi chú</div>
            <div className="text-sm text-gray-500 mt-1">
              Thêm ghi chú để theo dõi lịch sử chăm sóc khách.
            </div>
          </div>
        ) : (
          <div className="divide-y">
            {rows.map((r) => (
              <div key={r.id} className="p-4 hover:bg-gray-50/60">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-gray-500">
                      {r.createdByName ?? "Unknown"} • {formatTime(r.createdAt)}
                    </div>
                    <div className="mt-2 text-sm text-gray-900 whitespace-pre-wrap">
                      {r.note}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const ok = confirm("Xóa ghi chú này?");
                      if (ok) mDel.mutate(r.id);
                    }}
                    className="h-9 px-3 rounded-xl bg-rose-50 text-rose-700 text-sm font-semibold hover:bg-rose-100"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
