
export default function Location() {
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
                        <tr className="border-t hover:bg-gray-50">
                            <td className="px-4 py-3">
                                <button className="text-blue-600 hover:underline">
                                    WH-MAIN
                                </button>
                            </td>
                            <td className="px-4 py-3">ZONE-A</td>
                            <td className="px-4 py-3">Khu thành phẩm</td>
                            <td className="px-4 py-3 text-center">---</td>
                            <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                                <button className="px-3 py-1 border rounded hover:bg-gray-100">
                                    Xem
                                </button>
                                <button className="px-3 py-1 border rounded hover:bg-gray-100">
                                    Sửa
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}