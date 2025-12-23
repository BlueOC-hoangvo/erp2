import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { URLS } from "@/routes/urls";
import type { CampaignStatus } from "../types";
import { deleteCampaign, listCampaigns } from "../fake/campaign.store";
import { formatDate } from "../utils/date";
import { calculateROI } from "../utils/roi";

const STATUS: Array<{ value: CampaignStatus | "all"; label: string }> = [
  { value: "all", label: "Tất cả" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

function money(v: number) {
  return (v || 0).toLocaleString("vi-VN");
}

function Badge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700",
    paused: "bg-amber-50 text-amber-700",
    completed: "bg-blue-50 text-blue-700",
    cancelled: "bg-rose-50 text-rose-700",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${map[status] ?? "bg-gray-100 text-gray-700"}`}
    >
      {status}
    </span>
  );
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-white border rounded-2xl shadow-sm p-4">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-xl font-extrabold text-gray-900 mt-1">{value}</div>
      {sub ? <div className="text-xs text-gray-500 mt-1">{sub}</div> : null}
    </div>
  );
}

export default function CampaignsList() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<CampaignStatus | "all">("all");

  const query = useQuery({
    queryKey: ["campaigns", q, status],
    queryFn: async () => listCampaigns({ q, status }),
  });

  const rows = query.data ?? [];

  const stats = useMemo(() => {
    const cost = rows.reduce((a, x) => a + (x.cost || 0), 0);
    const revenue = rows.reduce((a, x) => a + (x.revenue || 0), 0);
    const roi = calculateROI(cost, revenue);
    const active = rows.filter((x) => x.status === "active").length;
    return { cost, revenue, roi, active, total: rows.length };
  }, [rows]);

  const del = useMutation({
    mutationFn: async (id: string) => {
      deleteCampaign(id);
      return true;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-[calc(100vh-64px)] space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Chiến dịch marketing
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            FE-only (fake data lưu localStorage).
          </p>
        </div>
        <button
          onClick={() => nav(URLS.SALES_CAMPAIGNS_CREATE)}
          className="h-10 px-4 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-black"
        >
          + Tạo chiến dịch
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        <Stat label="Tổng chiến dịch" value={`${stats.total}`} />
        <Stat label="Đang chạy" value={`${stats.active}`} />
        <Stat label="Tổng chi phí" value={`${money(stats.cost)} VND`} />
        <Stat label="Tổng doanh thu" value={`${money(stats.revenue)} VND`} />
        <Stat
          label="ROI (ước tính)"
          value={`${stats.roi.toFixed(1)}%`}
          sub="(revenue - cost) / cost"
        />
      </div>

      <div className="bg-white border rounded-2xl shadow-sm p-4 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            className="h-10 w-full sm:w-[360px] px-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10"
            placeholder="Tìm theo mã / tên chiến dịch..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="h-10 px-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
          >
            {STATUS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="text-xs text-gray-500">
          localStorage key: <b>fake_campaigns_v1</b>
        </div>
      </div>

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-auto">
          <table className="min-w-[980px] w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Mã</th>
                <th className="text-left px-4 py-3 font-semibold">
                  Tên chiến dịch
                </th>
                <th className="text-left px-4 py-3 font-semibold">
                  Trạng thái
                </th>
                <th className="text-left px-4 py-3 font-semibold">Thời gian</th>
                <th className="text-right px-4 py-3 font-semibold">Chi phí</th>
                <th className="text-right px-4 py-3 font-semibold">
                  Doanh thu
                </th>
                <th className="text-right px-4 py-3 font-semibold w-[240px]">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody>
              {query.isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    Đang tải...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center">
                    <div className="text-gray-900 font-semibold">
                      Chưa có chiến dịch
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Tạo chiến dịch để theo dõi hiệu quả marketing.
                    </div>
                    <button
                      onClick={() => nav(URLS.SALES_CAMPAIGNS_CREATE)}
                      className="mt-4 h-10 px-4 rounded-xl bg-gray-900 text-white text-sm font-semibold"
                    >
                      + Tạo chiến dịch
                    </button>
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-t hover:bg-gray-50/60">
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {r.code}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{r.name}</td>
                    <td className="px-4 py-3">
                      <Badge status={r.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(r.startDate)} → {formatDate(r.endDate)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                      {money(r.cost)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                      {money(r.revenue)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => nav(URLS.SALES_CAMPAIGNS_DETAIL(r.id))}
                          className="h-9 px-3 rounded-xl border bg-white text-sm font-medium hover:bg-gray-50"
                        >
                          Xem
                        </button>
                        <button
                          onClick={() => nav(URLS.SALES_CAMPAIGNS_EDIT(r.id))}
                          className="h-9 px-3 rounded-xl border bg-white text-sm font-medium hover:bg-gray-50"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => {
                            const ok = confirm(`Xóa chiến dịch ${r.code}?`);
                            if (ok) del.mutate(r.id);
                          }}
                          className="h-9 px-3 rounded-xl bg-rose-50 text-rose-700 text-sm font-semibold hover:bg-rose-100"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
