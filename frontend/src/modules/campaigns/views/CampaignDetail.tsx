import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { URLS } from "@/routes/urls";
import { deleteCampaign, getCampaign } from "../fake/campaign.store";
import { formatDate } from "../utils/date";
import { calculateROI, calculateProfit } from "../utils/roi";

function money(v: number) {
  return (v || 0).toLocaleString("vi-VN");
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

export default function CampaignDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["campaign", id],
    queryFn: async () => (id ? getCampaign(id) : null),
    enabled: !!id,
  });

  const row = query.data;

  const computed = useMemo(() => {
    if (!row) return { profit: 0, roi: 0 };
    const profit = calculateProfit(row.cost || 0, row.revenue || 0);
    const roi = calculateROI(row.cost || 0, row.revenue || 0);
    return { profit, roi };
  }, [row]);

  const del = useMutation({
    mutationFn: async () => {
      if (!id) return false;
      deleteCampaign(id);
      return true;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["campaigns"] });
      nav(URLS.SALES_CAMPAIGNS);
    },
  });

  if (query.isLoading) {
    return (
      <div className="p-4 lg:p-6 bg-gray-50 min-h-[calc(100vh-64px)]">
        Đang tải...
      </div>
    );
  }

  if (!row) {
    return (
      <div className="p-4 lg:p-6 bg-gray-50 min-h-[calc(100vh-64px)]">
        <div className="bg-white border rounded-2xl p-6">
          Không tìm thấy chiến dịch.{" "}
          <button
            className="underline"
            onClick={() => nav(URLS.SALES_CAMPAIGNS)}
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-[calc(100vh-64px)] space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="text-xs text-gray-500">Chiến dịch</div>
          <h1 className="text-2xl font-bold text-gray-900">{row.code}</h1>
          <div className="text-sm text-gray-600 mt-1">{row.name}</div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => nav(URLS.SALES_CAMPAIGNS_EDIT(row.id))}
            className="h-10 px-4 rounded-xl border bg-white text-sm font-semibold hover:bg-gray-50"
          >
            Sửa
          </button>
          <button
            onClick={() => {
              const ok = confirm(`Xóa chiến dịch ${row.code}?`);
              if (ok) del.mutate();
            }}
            className="h-10 px-4 rounded-xl bg-rose-50 text-rose-700 text-sm font-semibold hover:bg-rose-100"
          >
            Xóa
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <Stat label="Chi phí" value={`${money(row.cost)} VND`} />
        <Stat label="Doanh thu" value={`${money(row.revenue)} VND`} />
        <Stat
          label="Lợi nhuận"
          value={`${money(computed.profit)} VND`}
          sub="revenue - cost"
        />
        <Stat label="ROI" value={`${computed.roi.toFixed(1)}%`} />
      </div>

      <div className="bg-white border rounded-2xl shadow-sm p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div>
            <div className="text-xs text-gray-500">Trạng thái</div>
            <div className="mt-1 font-semibold text-gray-900">{row.status}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Thời gian</div>
            <div className="mt-1 text-gray-900">
              {formatDate(row.startDate)} → {formatDate(row.endDate)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Conversion rate</div>
            <div className="mt-1 text-gray-900">{row.conversionRate ?? 0}%</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t flex justify-between text-sm">
          <button
            className="underline text-gray-600"
            onClick={() => nav(URLS.SALES_CAMPAIGNS)}
          >
            ← Danh sách
          </button>
          <div className="text-gray-500">
            Updated: {formatDate(row.updatedAt)}
          </div>
        </div>
      </div>
    </div>
  );
}
