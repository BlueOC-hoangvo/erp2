import { useState, useEffect } from "react";
import type { Item } from "../types";
import { getItems } from "../api/get-items";
import Items from "./Items";
import { ModalBase } from "../../../components/modalbase/ModalBase";
import { getItemById } from "../api/get-item-id";

export default function WarehouseItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingViewItems, setLoadingViewItems] = useState(false);
  const [viewType, setViewType] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Item | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await getItems({ page: 1, limit: 20 })
      setItems(res.data.items);
    } finally {
      setLoading(false);
    }
  }

  const handleViewItem = async (itemId: number) => {
    setViewType("items");
    setLoadingViewItems(true);
    try {
      const res = await getItemById(itemId);
      setSelectedItems(res.data);
    }
    finally {
      setLoadingViewItems(false);
    }
  }

  const closeView = () => {
    setViewType(null);
    setSelectedItems(null);
  };

  return (
    <div className="flex flex-col gap-y-[1.5rem]">
      <div className="p-6 bg-white rounded-lg shadow-sm flex flex-col gap-y-[1.5rem]">
        <Items onView={handleViewItem} items={items} loading={loading} />
        <div className="flex justify-end items-center space-x-2 text-sm">
          <button className="px-2 py-1 text-gray-500 hover:text-black">‹</button>
          <button className="px-3 py-1 border rounded text-blue-600 border-blue-600">
            1
          </button>
          <button className="px-2 py-1 text-gray-500 hover:text-black">›</button>
        </div>
      </div>
      <ModalBase
        open={viewType !== null}
        title="Thông tin nguyên vật liệu"
        onClose={closeView}
      >
        {viewType === "items" &&
          (loadingViewItems ? (
            <div className="text-gray-500">Đang tải...</div>
          ) : !selectedItems ? (
            <div className="text-gray-500">Không có dữ liệu</div>
          ) : (
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500">Mã NVL</div>
                <div className="font-medium">{selectedItems.sku}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Tên NVL</div>
                <div className="font-medium">{selectedItems.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Nhãn</div>
                <div className="font-medium">{selectedItems.itemType}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Đơn vị</div>
                <div className="font-medium">{selectedItems.baseUom}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Ghi chú</div>
                <div className="font-medium">{selectedItems.note ?? "---"}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Trạng thái</div>
                <div className={`font-medium ${selectedItems.isActive ? "text-green-600" : "text-red-600"}`}>{selectedItems.isActive === true ? "Hoạt động" : "Không hoạt động"}</div>
              </div>
            </div>
          ))}
      </ModalBase>
    </div>
  );
}
