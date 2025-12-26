import type { WarehouseIn } from "../types";

type Props = {
    items: WarehouseIn[];
    loading?: boolean;
    onAdd: () => void;
};

export default function WarehouseInModal({ items, loading, onAdd }: Props) {
    return (
        <>
            <div className="flex flex-row justify-between">
                <h1 className="text-xl font-semibold">Danh sách phiếu nhập kho</h1>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={onAdd}
                >
                    Lập phiếu nhập kho
                </button>
            </div>
            <div className="overflow-x-auto overflow-y-auto min-h-[36rem] max-h-[36rem]">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-left text-sm font-semibold text-gray-700">
                            <th className="px-4 py-3">Mã phiếu nhập</th>
                            <th className="px-4 py-3">Mã NCC</th>
                            <th className="px-4 py-3">Người tạo</th>
                            <th className="px-4 py-3">Ngày tạo</th>
                            <th className="px-4 py-3">Trạng thái</th>
                            <th className="px-4 py-3">Ghi chú</th>
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
                                                {i.poNo}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">{i.supplierId}</td>
                                        <td className="px-4 py-3">{i.createdById ? i.createdById : "1"}</td>
                                        <td className="px-4 py-3">{new Date(i.orderDate).toLocaleDateString('vi-VN')}</td>
                                        <td className="px-4 py-3">{i.note ? i.note : "---"}</td>
                                        <td className={`px-4 py-3 font-medium ${i.status === 'CONFIRMED' ? "text-green-600" : "text-red-600"}`}>{i.status}</td>
                                        <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                                            <button className="px-3 py-1 border rounded hover:bg-gray-100"
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