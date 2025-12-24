import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { URLS } from "@/routes/urls";
import type { CampaignStatus } from "../types";
import { getCampaign, upsertCampaign } from "../fake/campaign.store";
import { calculateROI, calculateProfit } from "../utils/roi";

type FormState = {
  code: string;
  name: string;
  startDate?: string;
  endDate?: string;
  cost: number;
  revenue: number;
  conversionRate: number;
  status: CampaignStatus;
};

const STATUS: CampaignStatus[] = ["active", "paused", "completed", "cancelled"];

function toDateInput(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function CampaignForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const nav = useNavigate();
  const qc = useQueryClient();

  const detail = useQuery({
    queryKey: ["campaign", id],
    queryFn: async () => (id ? getCampaign(id) : null),
    enabled: isEdit,
  });

  // Initialize form state - generate code only for new campaigns
  const [form, setForm] = useState<FormState>(() => {
    if (isEdit) {
      // For edit mode, we'll populate from query data when available
      return {
        code: "",
        name: "",
        startDate: "",
        endDate: "",
        cost: 0,
        revenue: 0,
        conversionRate: 0,
        status: "active",
      };
    }

    const year = new Date().getFullYear();
    const seq = String(((Date.now() / 1000) | 0) % 10000).padStart(4, "0");
    return {
      code: `MKT-${year}-${seq}`,
      name: "",
      startDate: "",
      endDate: "",
      cost: 0,
      revenue: 0,
      conversionRate: 0,
      status: "active",
    };
  });

  // Update form when detail data becomes available
  const editForm = useMemo(() => {
    if (isEdit && detail.data) {
      return {
        code: detail.data.code,
        name: detail.data.name,
        startDate: toDateInput(detail.data.startDate),
        endDate: toDateInput(detail.data.endDate),
        cost: detail.data.cost ?? 0,
        revenue: detail.data.revenue ?? 0,
        conversionRate: detail.data.conversionRate ?? 0,
        status: detail.data.status,
      };
    }
    return null;
  }, [isEdit, detail.data]);

  // Use edit data when available, otherwise use form state
  const activeForm = editForm || form;

  const computed = useMemo(() => {
    const profit = calculateProfit(
      Number(activeForm.cost) || 0,
      Number(activeForm.revenue) || 0
    );
    const roi = calculateROI(
      Number(activeForm.cost) || 0,
      Number(activeForm.revenue) || 0
    );
    return { profit, roi };
  }, [activeForm.cost, activeForm.revenue]);

  const m = useMutation({
    mutationFn: async () => {
      const saved = upsertCampaign({
        id,
        code: activeForm.code.trim(),
        name: activeForm.name.trim(),
        startDate: activeForm.startDate
          ? new Date(activeForm.startDate).toISOString()
          : undefined,
        endDate: activeForm.endDate
          ? new Date(activeForm.endDate).toISOString()
          : undefined,
        cost: Number(activeForm.cost) || 0,
        revenue: Number(activeForm.revenue) || 0,
        conversionRate: Number(activeForm.conversionRate) || 0,
        status: activeForm.status,
      });
      return saved;
    },
    onSuccess: async (saved) => {
      await qc.invalidateQueries({ queryKey: ["campaigns"] });
      nav(URLS.SALES_CAMPAIGNS_DETAIL(saved.id));
    },
  });

  if (isEdit && detail.isLoading) {
    return (
      <div className="p-4 lg:p-6 bg-gray-50 min-h-[calc(100vh-64px)]">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-[calc(100vh-64px)] space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? "Sửa chiến dịch" : "Tạo chiến dịch"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Fake data — lưu localStorage.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => nav(URLS.SALES_CAMPAIGNS)}
            className="h-10 px-4 rounded-xl border bg-white text-sm font-semibold hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={() => m.mutate()}
            disabled={
              m.isPending || !activeForm.name.trim() || !activeForm.code.trim()
            }
            className="h-10 px-4 rounded-xl bg-gray-900 text-white text-sm font-semibold disabled:opacity-60"
          >
            {m.isPending ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="bg-white border rounded-2xl shadow-sm p-4 space-y-4 xl:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-gray-500">Mã chiến dịch</div>
              <input
                className="mt-1 h-10 w-full px-3 rounded-xl border bg-white"
                value={activeForm.code}
                onChange={(e) => {
                  if (!isEdit) {
                    setForm((s) => ({ ...s, code: e.target.value }));
                  }
                }}
              />
            </div>
            <div>
              <div className="text-xs text-gray-500">Trạng thái</div>
              <select
                className="mt-1 h-10 w-full px-3 rounded-xl border bg-white"
                value={activeForm.status}
                onChange={(e) => {
                  if (!isEdit) {
                    setForm((s) => ({
                      ...s,
                      status: e.target.value as CampaignStatus,
                    }));
                  }
                }}
              >
                {STATUS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <div className="text-xs text-gray-500">Tên chiến dịch</div>
              <input
                className="mt-1 h-10 w-full px-3 rounded-xl border bg-white"
                value={activeForm.name}
                onChange={(e) => {
                  if (!isEdit) {
                    setForm((s) => ({ ...s, name: e.target.value }));
                  }
                }}
                placeholder="Ví dụ: Chạy quảng cáo Tết (Facebook/Google)"
              />
            </div>

            <div>
              <div className="text-xs text-gray-500">Ngày bắt đầu</div>
              <input
                type="date"
                className="mt-1 h-10 w-full px-3 rounded-xl border bg-white"
                value={activeForm.startDate || ""}
                onChange={(e) => {
                  if (!isEdit) {
                    setForm((s) => ({ ...s, startDate: e.target.value }));
                  }
                }}
              />
            </div>
            <div>
              <div className="text-xs text-gray-500">Ngày kết thúc</div>
              <input
                type="date"
                className="mt-1 h-10 w-full px-3 rounded-xl border bg-white"
                value={activeForm.endDate || ""}
                onChange={(e) => {
                  if (!isEdit) {
                    setForm((s) => ({ ...s, endDate: e.target.value }));
                  }
                }}
              />
            </div>

            <div>
              <div className="text-xs text-gray-500">Chi phí (VND)</div>
              <input
                type="number"
                min="0"
                className="mt-1 h-10 w-full px-3 rounded-xl border bg-white text-right"
                value={activeForm.cost}
                onChange={(e) => {
                  if (!isEdit) {
                    setForm((s) => ({
                      ...s,
                      cost: Math.max(0, Number(e.target.value)),
                    }));
                  }
                }}
              />
            </div>
            <div>
              <div className="text-xs text-gray-500">Doanh thu (VND)</div>
              <input
                type="number"
                min="0"
                className="mt-1 h-10 w-full px-3 rounded-xl border bg-white text-right"
                value={activeForm.revenue}
                onChange={(e) => {
                  if (!isEdit) {
                    setForm((s) => ({
                      ...s,
                      revenue: Math.max(0, Number(e.target.value)),
                    }));
                  }
                }}
              />
            </div>

            <div>
              <div className="text-xs text-gray-500">Conversion rate (%)</div>
              <input
                type="number"
                step="0.1"
                className="mt-1 h-10 w-full px-3 rounded-xl border bg-white text-right"
                value={activeForm.conversionRate}
                onChange={(e) => {
                  if (!isEdit) {
                    setForm((s) => ({
                      ...s,
                      conversionRate: Number(e.target.value),
                    }));
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-2xl shadow-sm p-4 space-y-3">
          <div className="text-sm font-semibold text-gray-900">
            Tóm tắt hiệu quả
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Lợi nhuận</span>
            <span className="font-bold text-gray-900">
              {computed.profit.toLocaleString("vi-VN")} VND
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">ROI</span>
            <span className="font-bold text-gray-900">
              {computed.roi.toFixed(1)}%
            </span>
          </div>
          <div className="pt-3 border-t text-xs text-gray-500">
            ROI = (revenue - cost) / cost
          </div>
        </div>
      </div>
    </div>
  );
}
