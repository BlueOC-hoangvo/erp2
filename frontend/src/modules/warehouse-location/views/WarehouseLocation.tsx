import { useEffect, useState } from "react";
import Warehouse from "./Warehouse";
import Location from "./Location";
import { ModalBase } from "@/components/modalbase/ModalBase";
import { getWarehouses } from "../api/get-warehouse";
import { getLocations } from "../api/get-location";
import { getWarehouseById } from "../api/get-warehouse-id";
import { getLocationById } from "../api/get-location-id";
import { updateWarehouse } from "../api/update-warehouse";
import { updateLocation } from "../api/update-location";
import { addWarehouses } from "../api/add-warehouse";
import { addLocations } from "../api/add-location";
import type {
    Warehouse as WarehouseType,
    Location as LocationType,
    WarehouseUpsertBody,
    LocationUpsertBody,
} from "../types";
import { deleteLocation } from "../api/delete-location-id";

type ViewType = null | "warehouse" | "location";
type EditType = null | "warehouse" | "location";
type AddType = null | "warehouse" | "location";

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

    const [addType, setAddType] = useState<AddType>(null);
    const [creating, setCreating] = useState(false);

    const [addWarehouseForm, setAddWarehouseForm] = useState<WarehouseUpsertBody>({
        code: "",
        name: "",
        note: "",
    });

    const [addLocationForm, setAddLocationForm] = useState<LocationUpsertBody>({
        warehouseId: 0,
        code: "",
        name: "",
        parentId: null,
    });

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
        setEditingWarehouseId(Number(w.id));
        setEditWarehouseForm({
            code: w.code ?? "",
            name: w.name ?? "",
            note: w.note ?? "",
        });
    };

    const handleEditLocation = (l: LocationType) => {
        setEditType("location");
        setEditingLocationId(Number(l.id));
        setEditLocationForm({
            warehouseId: Number(l.warehouseId),
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
                });

                closeEdit();
                await loadData();
                return;
            }
        } finally {
            setSaving(false);
        }
    };

    const openAddWarehouse = () => {
        setAddWarehouseForm({ code: "", name: "", note: "" });
        setAddType("warehouse");
    };

    const openAddLocation = () => {
        const firstWarehouseId = warehouses[0]?.id ? Number(warehouses[0].id) : 0;
        setAddLocationForm({
            warehouseId: firstWarehouseId,
            code: "",
            name: "",
            parentId: null,
        });
        setAddType("location");
    };

    const closeAdd = () => {
        setAddType(null);
        setCreating(false);
    };

    const submitAdd = async () => {
        setCreating(true);
        try {
            if (addType === "warehouse") {
                if (!addWarehouseForm.code.trim() || !addWarehouseForm.name.trim()) return;

                await addWarehouses({
                    code: addWarehouseForm.code.trim(),
                    name: addWarehouseForm.name.trim(),
                    note: addWarehouseForm.note?.trim() || undefined,
                });

                closeAdd();
                await loadData();
                return;
            }

            if (addType === "location") {
                if (!addLocationForm.code.trim() || !addLocationForm.name.trim()) return;

                await addLocations({
                    warehouseId: addLocationForm.warehouseId,
                    code: addLocationForm.code.trim(),
                    name: addLocationForm.name.trim(),
                    parentId: addLocationForm.parentId ?? null,
                });

                closeAdd();
                await loadData();
                return;
            }
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteLocation = async (l: LocationType) => {
        const ok = window.confirm(
            `Bạn có chắc muốn xóa location "${l.name}"?`
        );
        if (!ok) return;

        try {
            await deleteLocation(l.id);
            await loadData();
        } catch (e: any) {
            alert(e?.message ?? "Không thể xóa location");
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
                    onAdd={openAddWarehouse}
                    />
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm flex flex-col gap-y-[1.5rem]">
                <Location
                    items={locations}
                    loading={loadingLocations}
                    onView={handleViewLocation}
                    onEdit={handleEditLocation}
                    onAdd={openAddLocation}
                    onDelete={handleDeleteLocation}
                />
            </div>

            <ModalBase
                open={addType !== null}
                title={addType === "warehouse" ? "Thêm kho mới" : "Thêm địa điểm kho"}
                onClose={closeAdd}
                footer={
                    <div className="flex gap-2">
                        <button onClick={closeAdd} className="rounded border px-4 py-2 hover:bg-gray-50">
                            Hủy
                        </button>
                        <button
                            onClick={submitAdd}
                            disabled={creating}
                            className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
                        >
                            {creating ? "Đang tạo..." : "Tạo"}
                        </button>
                    </div>
                }
            >
                {addType === "warehouse" && (
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm text-gray-600">Mã kho</label>
                            <input
                                className="w-full rounded border px-3 py-2"
                                value={addWarehouseForm.code}
                                onChange={(e) => setAddWarehouseForm((p) => ({ ...p, code: e.target.value }))}
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm text-gray-600">Tên kho</label>
                            <input
                                className="w-full rounded border px-3 py-2"
                                value={addWarehouseForm.name}
                                onChange={(e) => setAddWarehouseForm((p) => ({ ...p, name: e.target.value }))}
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm text-gray-600">Ghi chú</label>
                            <textarea
                                className="w-full rounded border px-3 py-2"
                                rows={3}
                                value={addWarehouseForm.note ?? ""}
                                onChange={(e) => setAddWarehouseForm((p) => ({ ...p, note: e.target.value }))}
                            />
                        </div>
                    </div>
                )}

                {addType === "location" && (
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm text-gray-600">Kho</label>
                            <select
                                className="w-full rounded border px-3 py-2"
                                value={addLocationForm.warehouseId}
                                onChange={(e) =>
                                    setAddLocationForm((p) => ({ ...p, warehouseId: Number(e.target.value) }))
                                }
                            >
                                <option value={0}>-- Chọn kho --</option>
                                {warehouses.map((w) => (
                                    <option key={w.id} value={Number(w.id)}>
                                        {w.code} - {w.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm text-gray-600">Mã địa điểm kho</label>
                            <input
                                className="w-full rounded border px-3 py-2"
                                value={addLocationForm.code}
                                onChange={(e) => setAddLocationForm((p) => ({ ...p, code: e.target.value }))}
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm text-gray-600">Tên địa điểm</label>
                            <input
                                className="w-full rounded border px-3 py-2"
                                value={addLocationForm.name}
                                onChange={(e) => setAddLocationForm((p) => ({ ...p, name: e.target.value }))}
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm text-gray-600">Mã khu vực (nếu có)</label>
                            <input
                                className="w-full rounded border px-3 py-2"
                                type="number"
                                value={addLocationForm.parentId ?? ""}
                                onChange={(e) =>
                                    setAddLocationForm((p) => ({
                                        ...p,
                                        parentId: e.target.value === "" ? null : Number(e.target.value),
                                    }))
                                }
                                placeholder="để trống nếu root"
                            />
                        </div>
                    </div>
                )}
            </ModalBase>

            <ModalBase
                open={viewType !== null}
                title={viewType === "warehouse" ? "Chi tiết kho" : "Chi tiết địa điểm kho"}
                onClose={closeView}
            >
                {viewType === "warehouse" &&
                    (loadingViewWarehouse ? (
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
                    ))}

                {viewType === "location" &&
                    (loadingViewLocation ? (
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
                    ))}
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
                                onChange={(e) => setEditWarehouseForm((p) => ({ ...p, code: e.target.value }))}
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm text-gray-600">Tên kho</label>
                            <input
                                className="w-full rounded border px-3 py-2"
                                value={editWarehouseForm.name}
                                onChange={(e) => setEditWarehouseForm((p) => ({ ...p, name: e.target.value }))}
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm text-gray-600">Ghi chú</label>
                            <textarea
                                className="w-full rounded border px-3 py-2"
                                rows={3}
                                value={editWarehouseForm.note ?? ""}
                                onChange={(e) => setEditWarehouseForm((p) => ({ ...p, note: e.target.value }))}
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
                                onChange={(e) => setEditLocationForm((p) => ({ ...p, code: e.target.value }))}
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm text-gray-600">Tên địa điểm</label>
                            <input
                                className="w-full rounded border px-3 py-2"
                                value={editLocationForm.name}
                                onChange={(e) => setEditLocationForm((p) => ({ ...p, name: e.target.value }))}
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
