import { useState, useEffect } from "react";
import type { WarehouseIn } from "../types";
import WarehouseInModal from "./WarehouseInModal";
import WarehouseInAddModal from "./WarehouseInAdd";
import { getWarehouseIns } from "../api/get-purchase-in";
import { getSuppliers } from "../api/get-suppliers";
import { getItems } from "../api/get-items";
import { createPurchaseOrder } from "../api/add-purchase-order";

export default function WarehouseIns() {
  const [items, setItems] = useState<WarehouseIn[]>([]);
  const [loading, setLoading] = useState(false);

  const [openAdd, setOpenAdd] = useState(false);

  const [supplierOptions, setSupplierOptions] = useState<any[]>([]);
  const [itemOptions, setItemOptions] = useState<any[]>([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [poRes, supRes, itemRes] = await Promise.all([
        getWarehouseIns({ page: 1, limit: 20 }),
        getSuppliers({ page: 1, limit: 20 }),
        getItems({ page: 1, limit: 20 }),
      ]);

      setItems(poRes.data.items);

      setSupplierOptions(
        (supRes.data.items ?? []).map((s: any) => ({
          id: String(s.id),
          code: s.code,
          name: s.name,
        }))
      );

      setItemOptions(
        (itemRes.data.items ?? []).map((it: any) => ({
          id: String(it.id),
          sku: it.sku,
          name: it.name,
          baseUom: it.baseUom,
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchPOs = async () => {
    setLoading(true);
    try {
      const res = await getWarehouseIns({ page: 1, limit: 20 });
      setItems(res.data.items);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-[1.5rem]">
      <div className="p-6 bg-white rounded-lg shadow-sm flex flex-col gap-y-[1.5rem]">
        <WarehouseInModal
          items={items}
          loading={loading}
          onAdd={() => setOpenAdd(true)}
        />

        <div className="flex justify-end items-center space-x-2 text-sm">
          <button className="px-2 py-1 text-gray-500 hover:text-black">‹</button>
          <button className="px-3 py-1 border rounded text-blue-600 border-blue-600">
            1
          </button>
          <button className="px-2 py-1 text-gray-500 hover:text-black">›</button>
        </div>
      </div>

      <WarehouseInAddModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onCreated={fetchPOs}
        suppliers={supplierOptions}
        items={itemOptions}
        createFn={createPurchaseOrder}
      />
    </div>
  );
}
