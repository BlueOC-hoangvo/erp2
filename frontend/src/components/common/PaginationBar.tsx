interface PaginationBarProps {
  page: number;
  pageSize: number;
  total: number;
  onChangePage: (page: number) => void;
}

export default function PaginationBar({
  page,
  pageSize,
  total,
  onChangePage,
}: PaginationBarProps) {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-gray-500">
        Trang {page} / {totalPages} ({total} kết quả)
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onChangePage(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Trước
        </button>
        <button
          onClick={() => onChangePage(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Tiếp
        </button>
      </div>
    </div>
  );
}
