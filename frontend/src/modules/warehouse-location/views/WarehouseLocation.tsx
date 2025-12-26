import { useEffect, useState } from "react";
import Warehouse from "./Warehouse";
import Location from "./Location";
import { ModalBase } from "@/components/modalbase/ModalBase";
import { getWarehouses } from "../api/get-warehouse";
import { getLocations } from "../api/get-location";
import { getWarehouseById } from "../api/get-warehouse-id";
import { getLocationById } from "../api/get-location-id";
import { updateWarehouse } from "../api/update-warehouse";
import { addWarehouses } from "../api/add-warehouse";
import type {
    Warehouse as WarehouseType,
    Location as LocationType,
    WarehouseUpsertBody,
    LocationUpsertBody,
} from "../types";
import { updateLocation } from "../api/update-location";

type ViewType = null | "warehouse" | "location";
type EditType = null | "warehouse" | "location";

export default function WarehouseLocation() {
    const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
    const [locations, setLocations] = useState<LocationType[]>([]);

    const [loadingWarehouses, setLoadingWarehouses] = useState(false);
    const [loadingLocations, setLoadingLocations] = useState(false);

    const [viewType, setViewType] = useState<ViewType>(null);
    const [loadingViewWarehouse, setLoadingViewWarehouse] = useState(false);
    const [loadingViewLocation, setLoadingViewLocation] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseType | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(null);

    const [editType, setEditType] = useState<EditType>(null);
    const [saving, setSaving] = useState(false);

    const [editingWarehouseId, setEditingWarehouseId] = useState<number | null>(null);
    const [editWarehouseForm, setEditWarehouseForm] = useState<WarehouseUpsertBody>({
        code: "",
        name: "",
        note: "",
    });

    const [editingLocationId, setEditingLocationId] = useState<number | null>(null);
    const [editLocationForm, setEditLocationForm] = useState<LocationUpsertBody>({
        warehouseId: 0,
        code: "",
        name: "",
        parentId: null,
    });

    const [createWarehouseOpen, setCreateWarehouseOpen] = useState(false);
    const [creatingWarehouse, setCreatingWarehouse] = useState(false);
    const [createWarehouseForm, setCreateWarehouseForm] = useState<WarehouseUpsertBody>({
        code: "",
        name: "",
        note: "",
    });

    const openCreateWarehouse = () => {
        setCreateWarehouseForm({ code: "", name: "", note: "" });
        setCreateWarehouseOpen(true);
    };

    const closeCreateWarehouse = () => {
        setCreateWarehouseOpen(false);
        setCreatingWarehouse(false);
    };

    const submitCreateWarehouse = async () => {
        if (!createWarehouseForm.code.trim() || !createWarehouseForm.name.trim()) return;

        setCreatingWarehouse(true);
        try {
            await addWarehouses({
                code: createWarehouseForm.code.trim(),
                name: createWarehouseForm.name.trim(),
                note: createWarehouseForm.note?.trim() || undefined,
            });
            closeCreateWarehouse();
            await loadData();
        } finally {
            setCreatingWarehouse(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoadingWarehouses(true);
        setLoadingLocations(true);
        try {
            const [resWH, resLoc] = await Promise.all([
                getWarehouses({ page: 1, limit: 20 }),
                getLocations({ page: 1, limit: 20 }),
            ]);

            setWarehouses(resWH.data.items);
            setLocations(resLoc.data);
        } finally {
            setLoadingWarehouses(false);
            setLoadingLocations(false);
        }
    };

    const handleViewWarehouse = async (id: number) => {
        setViewType("warehouse");
        setSelectedWarehouse(null);
        setSelectedLocation(null);

        setLoadingViewWarehouse(true);
        try {
            const res = await getWarehouseById(id);
            setSelectedWarehouse(res.data);
        } finally {
            setLoadingViewWarehouse(false);
        }
    };

    const handleViewLocation = async (id: number) => {
        setViewType("location");
        setSelectedWarehouse(null);
        setSelectedLocation(null);

        setLoadingViewLocation(true);
        try {
            const res = await getLocationById(id);
            setSelectedLocation(res.data);
        } finally {
            setLoadingViewLocation(false);
        }
    };

    const closeView = () => {
        setViewType(null);
        setSelectedWarehouse(null);
        setSelectedLocation(null);
    };

    const handleEditWarehouse = (w: WarehouseType) => {
        setEditType("warehouse");
        setEditingWarehouseId(w.id);
        setEditWarehouseForm({
            code: w.code ?? "",
            name: w.name ?? "",
            note: w.note ?? "",
        });
    };

    const handleEditLocation = (l: LocationType) => {
        setEditType("location");
        setEditingLocationId(l.id);
        setEditLocationForm({
            warehouseId: l.warehouseId,
            code: l.code ?? "",
            name: l.name ?? "",
            parentId: l.parentId ?? null,
        });
    };

    const closeEdit = () => {
        setEditType(null);
        setSaving(false);
        setEditingWarehouseId(null);
        setEditingLocationId(null);
    };

    const submitEdit = async () => {
        setSaving(true);
        try {
            if (editType === "warehouse") {
                if (!editingWarehouseId) return;
                if (!editWarehouseForm.code.trim() || !editWarehouseForm.name.trim()) return;

                await updateWarehouse(editingWarehouseId, {
                    code: editWarehouseForm.code.trim(),
                    name: editWarehouseForm.name.trim(),
                    note: editWarehouseForm.note?.trim() || undefined,
                });

                closeEdit();
                await loadData();
                return;
            }

            if (editType === "location") {
                if (!editingLocationId) return;
                if (!editLocationForm.code.trim() || !editLocationForm.name.trim()) return;

                await updateLocation(editingLocationId, {
                    warehouseId: editLocationForm.warehouseId,
                    code: editLocationForm.code.trim(),
                    name: editLocationForm.name.trim(),
                    parentId: editLocationForm.parentId ?? null,
                })

                closeEdit();
                await loadData();
                return;
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-y-[1.5rem]">
            <div className="p-6 bg-white rounded-lg shadow-sm flex flex-col gap-y-[1.5rem]">
                <Warehouse
                    items={warehouses}
                    loading={loadingWarehouses}
                    onView={handleViewWarehouse}
                    onEdit={handleEditWarehouse}
                    onAdd={openCreateWarehouse}
                />

            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm flex flex-col gap-y-[1.5rem]">
                <Location
                    items={locations}
                    loading={loadingLocations}
                    onView={handleViewLocation}
                    onEdit={handleEditLocation}
                />
            </div>

            <ModalBase
                open={createWarehouseOpen}
                title="Thêm kho mới"
                onClose={closeCreateWarehouse}
                footer={
                    <div className="flex gap-2">
                        <button onClick={closeCreateWarehouse} className="rounded border px-4 py-2 hover:bg-gray-50">
                            Hủy
                        </button>
                        <button
                            onClick={submitCreateWarehouse}
                            disabled={creatingWarehouse}
                            className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
                        >
                            {creatingWarehouse ? "Đang tạo..." : "Tạo"}
                        </button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm text-gray-600">Mã kho</label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            value={createWarehouseForm.code}
                            onChange={(e) => setCreateWarehouseForm((p) => ({ ...p, code: e.target.value }))}
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm text-gray-600">Tên kho</label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            value={createWarehouseForm.name}
                            onChange={(e) => setCreateWarehouseForm((p) => ({ ...p, name: e.target.value }))}
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm text-gray-600">Nhãn</label>
                        <textarea
                            className="w-full rounded border px-3 py-2"
                            rows={3}
                            value={createWarehouseForm.note ?? ""}
                            onChange={(e) => setCreateWarehouseForm((p) => ({ ...p, note: e.target.value }))}
                        />
                    </div>
                </div>
            </ModalBase>

            <ModalBase
                open={viewType !== null}
                title={viewType === "warehouse" ? "Chi tiết kho" : "Chi tiết địa điểm kho"}
                onClose={closeView}
            >
                {viewType === "warehouse" && (
                    loadingViewWarehouse ? (
                        <div className="text-gray-500">Đang tải...</div>
                    ) : !selectedWarehouse ? (
                        <div className="text-gray-500">Không có dữ liệu</div>
                    ) : (
                        <div className="space-y-3">
                            <div>
                                <div className="text-sm text-gray-500">Mã kho</div>
                                <div className="font-medium">{selectedWarehouse.code}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Tên kho</div>
                                <div className="font-medium">{selectedWarehouse.name}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Ghi chú</div>
                                <div className="font-medium">{selectedWarehouse.note ?? "---"}</div>
                            </div>
                        </div>
                    )
                )}

                {viewType === "location" && (
                    loadingViewLocation ? (
                        <div className="text-gray-500">Đang tải...</div>
                    ) : !selectedLocation ? (
                        <div className="text-gray-500">Không có dữ liệu</div>
                    ) : (
                        <div className="space-y-3">
                            <div>
                                <div className="text-sm text-gray-500">Mã kho</div>
                                <div className="font-medium">{selectedLocation.warehouseId}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Mã địa điểm kho</div>
                                <div className="font-medium">{selectedLocation.code}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Tên địa điểm</div>
                                <div className="font-medium">{selectedLocation.name}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Mã khu vực (nếu có)</div>
                                <div className="font-medium">{selectedLocation.parentId ?? "---"}</div>
                            </div>
                        </div>
                    )
                )}
            </ModalBase>

            <ModalBase
                open={editType !== null}
                title={editType === "warehouse" ? "Cập nhật kho" : "Cập nhật location"}
                onClose={closeEdit}
                footer={
                    <div className="flex gap-2">
                        <button onClick={closeEdit} className="rounded border px-4 py-2 hover:bg-gray-50">
                            Hủy
                        </button>
                        <button
                            onClick={submitEdit}
                            disabled={saving}
                            className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
                        >
                            {saving ? "Đang lưu..." : "Lưu"}
                        </button>
                    </div>
                }
            >
                {editType === "warehouse" && (
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm text-gray-600">Mã kho</label>
                            <input
                                className="w-full rounded border px-3 py-2"
                                value={editWarehouseForm.code}
                                onChange={(e) =>
                                    setEditWarehouseForm((p) => ({ ...p, code: e.target.value }))
                                }
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm text-gray-600">Tên kho</label>
                            <input
                                className="w-full rounded border px-3 py-2"
                                value={editWarehouseForm.name}
                                onChange={(e) =>
                                    setEditWarehouseForm((p) => ({ ...p, name: e.target.value }))
                                }
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm text-gray-600">Ghi chú</label>
                            <textarea
                                className="w-full rounded border px-3 py-2"
                                rows={3}
                                value={editWarehouseForm.note ?? ""}
                                onChange={(e) =>
                                    setEditWarehouseForm((p) => ({ ...p, note: e.target.value }))
                                }
                            />
                        </div>
                    </div>
                )}

                {editType === "location" && (
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm text-gray-600">Mã kho</label>
                            <input
                                className="w-full rounded border px-3 py-2"
                                type="number"
                                value={editLocationForm.warehouseId}
                                onChange={(e) =>
                                    setEditLocationForm((p) => ({ ...p, warehouseId: Number(e.target.value) }))
                                }
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm text-gray-600">Mã địa điểm kho</label>
                            <input
                                className="w-full rounded border px-3 py-2"
                                value={editLocationForm.code}
                                onChange={(e) =>
                                    setEditLocationForm((p) => ({ ...p, code: e.target.value }))
                                }
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm text-gray-600">Tên địa điểm</label>
                            <input
                                className="w-full rounded border px-3 py-2"
                                value={editLocationForm.name}
                                onChange={(e) =>
                                    setEditLocationForm((p) => ({ ...p, name: e.target.value }))
                                }
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm text-gray-600">Mã khu vực (nếu có)</label>
                            <input
                                className="w-full rounded border px-3 py-2"
                                type="number"
                                value={editLocationForm.parentId ?? ""}
                                onChange={(e) =>
                                    setEditLocationForm((p) => ({
                                        ...p,
                                        parentId: e.target.value === "" ? null : Number(e.target.value),
                                    }))
                                }
                                placeholder="* Có thể để trống"
                            />
                        </div>
                    </div>
                )}
            </ModalBase>
        </div>
    );
}
