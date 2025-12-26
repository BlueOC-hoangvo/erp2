import type { Item } from "../types";

type Props = {
    items: Item[];
    loading?: boolean;
    onView: (itemId: number) => void;
    // onEdit: (item: Item) => void;
    // onAdd?: () => void;
};

export default function Items({ items, loading, onView }: Props) {

    return (
        <>
            <div className="flex flex-row justify-between">
                <h1 className="text-xl font-semibold">Danh sách nguyên vật liệu</h1>
            </div>
            <div className="overflow-x-auto overflow-y-auto min-h-[36rem] max-h-[36rem]">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-left text-sm font-semibold text-gray-700">
                            <th className="px-4 py-3">Mã NVL</th>
                            <th className="px-4 py-3">Tên NVL</th>
                            <th className="px-4 py-3">Nhãn</th>
                            <th className="px-4 py-3">Đơn vị</th>
                            <th className="px-4 py-3">Ghi chú</th>
                            <th className="px-4 py-3">Trạng thái</th>
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
                            items.map((i) => {
                                return (
                                    <tr key={i.id} className={`border-t hover:bg-gray-50`}>
                                        <td className="px-4 py-3">
                                            <button className="text-blue-600 hover:underline">
                                                {i.sku }
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">{i.name}</td>
                                        <td className="px-4 py-3">{i.itemType}</td>
                                        <td className="px-4 py-3">{i.baseUom}</td>
                                        <td className="px-4 py-3">{i.note ? i.note : "---"}</td>
                                        <td className={`px-4 py-3 font-medium ${i.isActive ? "text-green-600" : "text-red-600"}`}>{i.isActive === true ? "Hoạt động" : "Không hoạt động"}</td>
                                        <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                                            <button className="px-3 py-1 border rounded hover:bg-gray-100"
                                                onClick={() => onView(i.id)}
                                            >Xem</button>
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