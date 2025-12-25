import type { Location } from "../types"

type Props = {
    items: Location[];
    loading?: boolean;
    onView: (locationId: number) => void;
    onEdit: (location: Location) => void;
};

export default function Location({ items, loading, onView, onEdit } : Props) {
    return (
        <>
            <div className="flex flex-row justify-between">
                <h1 className="text-xl font-semibold">Danh sách địa điểm kho</h1>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Thêm địa điểm kho mới
                </button>
            </div>
            <div className="overflow-x-auto overflow-y-auto max-h-[25rem]">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-left text-sm font-semibold text-gray-700">
                            <th className="px-4 py-3">Mã kho</th>
                            <th className="px-4 py-3">Mã địa điểm kho</th>
                            <th className="px-4 py-3">Tên địa điểm</th>
                            <th className="px-4 py-3 text-center">Mã khu vực (nếu có)</th>
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
                            items.map((l) => {
                                return (
                                    <tr key={l.id} className={`border-t hover:bg-gray-50`}>
                                        <td className="px-4 py-3">
                                            <button className="text-blue-600 hover:underline">
                                                {l.warehouseId}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button className="text-blue-600 hover:underline">
                                                {l.code}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">{l.name}</td>
                                        <td className="px-4 py-3 text-center">{l.parentId ?? "---"}</td>
                                        <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                                            <button className="px-3 py-1 border rounded hover:bg-gray-100"
                                                onClick={() => onView(l.id)}
                                            >Xem</button>
                                            <button className="px-3 py-1 border rounded hover:bg-gray-100"
                                                onClick={() => onEdit(l)}
                                            >Sửa</button>
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