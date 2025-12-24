import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getHandbook, upsertHandbook } from "../fake/customer-handbook.store";

type Props = { customerId: string };

function pretty(obj: any) {
  try {
    return JSON.stringify(obj ?? {}, null, 2);
  } catch {
    return "{}";
  }
}

function parseJson(text: string) {
  const t = text.trim();
  if (!t) return {};
  return JSON.parse(t);
}

export default function CustomerHandbookTab({ customerId }: Props) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["customer-handbook", customerId],
    queryFn: async () => getHandbook(customerId),
  });

  const [generalInfo, setGeneralInfo] = useState("{}");
  const [persona, setPersona] = useState("{}");
  const [carePolicy, setCarePolicy] = useState("{}");
  const [consultingHistory, setConsultingHistory] = useState("{}");
  const [equipments, setEquipments] = useState("{}");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const r = query.data;
    setGeneralInfo(pretty(r?.generalInfo));
    setPersona(pretty(r?.persona));
    setCarePolicy(pretty(r?.carePolicy));
    setConsultingHistory(pretty(r?.consultingHistory));
    setEquipments(pretty(r?.equipments));
  }, [query.data]);

  const m = useMutation({
    mutationFn: async () => {
      setError(null);
      try {
        const payload = {
          generalInfo: parseJson(generalInfo),
          persona: parseJson(persona),
          carePolicy: parseJson(carePolicy),
          consultingHistory: parseJson(consultingHistory),
          equipments: parseJson(equipments),
        };
        return upsertHandbook(customerId, payload);
      } catch (e: any) {
        setError(e?.message ?? "JSON không hợp lệ");
        throw e;
      }
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: ["customer-handbook", customerId],
      });
    },
  });

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="text-sm font-semibold text-gray-900">
            Cẩm nang khách hàng
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            Lưu thông tin dạng JSON theo các section (giống schema
            CustomerHandbook)
          </div>
        </div>

        <button
          onClick={() => m.mutate()}
          disabled={m.isPending}
          className="h-10 px-4 rounded-xl bg-gray-900 text-white text-sm font-semibold disabled:opacity-60"
        >
          {m.isPending ? "Đang lưu..." : "Lưu"}
        </button>
      </div>

      {error ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-3 text-sm">
          JSON lỗi: {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <Section
          title="General Info"
          value={generalInfo}
          onChange={setGeneralInfo}
        />
        <Section title="Persona" value={persona} onChange={setPersona} />
        <Section
          title="Care Policy"
          value={carePolicy}
          onChange={setCarePolicy}
        />
        <Section
          title="Consulting History"
          value={consultingHistory}
          onChange={setConsultingHistory}
        />
        <div className="xl:col-span-2">
          <Section
            title="Equipments"
            value={equipments}
            onChange={setEquipments}
          />
        </div>
      </div>

      <div className="text-xs text-gray-500">
        Tip: bạn có thể đổi UI sau (form fields), hiện tại JSON giúp đội nghiệp
        vụ nhập linh hoạt.
      </div>
    </div>
  );
}

function Section({
  title,
  value,
  onChange,
}: {
  title: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b bg-gray-50">
        <div className="text-sm font-semibold text-gray-900">{title}</div>
      </div>
      <div className="p-4">
        <textarea
          className="w-full min-h-[180px] font-mono text-xs px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
