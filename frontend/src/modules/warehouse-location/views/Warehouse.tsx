import type { Warehouse } from "../types";

type Props = {
    items: Warehouse[];
    loading?: boolean;
    onView: (warehouseId: number) => void;
    onEdit: (warehouse: Warehouse) => void;
    onAdd?: () => void;
};

export default function Warehouse({ items, loading, onView, onEdit, onAdd }: Props) {

    return (
        <>
            <div className="flex flex-row justify-between">
                <h1 className="text-xl font-semibold">Danh sách kho</h1>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={onAdd}
                >
                    Thêm kho mới
                </button>
            </div>
            <div className="overflow-x-auto overflow-y-auto max-h-[25rem]">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-left text-sm font-semibold text-gray-700">
                            <th className="px-4 py-3">Mã kho</th>
                            <th className="px-4 py-3">Tên kho</th>
                            <th className="px-4 py-3">Nhãn</th>
                            <th className="px-4 py-3">Hành động</th>
                        </tr>
                    </thead>

                    <tbody className="text-sm">
                        {!loading && items.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                        {!loading &&
                            items.map((w) => {
                                return (
                                    <tr key={w.id} className={`border-t hover:bg-gray-50`}>
                                        <td className="px-4 py-3">
                                            <button className="text-blue-600 hover:underline">
                                                {w.code}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">{w.name}</td>
                                        <td className="px-4 py-3">{w.note ?? "---"}</td>
                                        <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                                            <button className="px-3 py-1 border rounded hover:bg-gray-100"
                                                onClick={() => onView(Number(w.id))}
                                            >Xem</button>
                                            <button
                                                className="px-3 py-1 border rounded hover:bg-gray-100"
                                                onClick={() => onEdit(w)}
                                            >
                                                Sửa
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>


        </>
    )
}