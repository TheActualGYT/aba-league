"use client";

export default function ConfirmModal({
  message,
  confirmLabel = "OK",
  danger = false,
  onConfirm,
  onCancel,
}: {
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4" onClick={onCancel}>
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-xl border border-neutral-600 bg-neutral-900 px-6 py-6 shadow-2xl"
        style={{ fontFamily: "Inter, sans-serif" }}
        onClick={event => event.stopPropagation()}
      >
        <p className="text-center text-base font-semibold leading-6 text-white">{message}</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-9 min-w-24 rounded border border-neutral-500 px-4 text-sm font-semibold text-neutral-200 hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`h-9 min-w-24 rounded px-4 text-sm font-bold ${danger ? "bg-red-500 text-white hover:bg-red-400" : "bg-neutral-100 text-black hover:bg-white"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
