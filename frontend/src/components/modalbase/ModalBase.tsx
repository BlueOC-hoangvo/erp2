import type { ReactNode } from "react";

type ModalBaseProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export function ModalBase({ open, title, onClose, children, footer }: ModalBaseProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-lg min-w-[50rem]">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="text-lg font-semibold">{title ?? "Modal"}</h3>
          <button
            onClick={onClose}
            className="rounded px-2 py-1 hover:bg-gray-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="px-5 py-4">
          {children}
        </div>
        <div className="flex justify-end gap-2 border-t px-5 py-4">
          {footer ?? (
            <button
              onClick={onClose}
              className="rounded border px-4 py-2 hover:bg-gray-50"
            >
              Đóng
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
